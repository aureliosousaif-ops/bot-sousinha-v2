const crypto = require('crypto')
const { criarPagamentoPix, verificarPix, tokenConfigurado } = require('../src/pix')
const store = require('./store')
const cadastro = require('./cadastro')

let socket = null
let timer = null
let busy = false

const criar = async (ctx, days) => {
  const plan = store.plan(days)
  if (!plan) throw new Error('PLANO_SUB_INVALIDO')
  if (!tokenConfigurado()) throw new Error('MP_TOKEN_NAO_CONFIGURADO')

  const buyer = store.normalize(ctx.sender)
  let payments = store.readPayments()

  const pending = payments.find(item =>
    store.normalize(item.buyer) === buyer && item.status === 'pending' && Number(item.expiresAt || 0) > Date.now()
  )
  if (pending) return pending

  const pix = await criarPagamentoPix(
    plan.valor,
    `Sub Bot Tokito - ${plan.dias} dias`,
    crypto.randomUUID()
  )

  const item = {
    id: pix.id,
    status: 'pending',
    buyer,
    chat: ctx.from,
    plan,
    qr_code: pix.qr_code || '',
    qr_code_base64: pix.qr_code_base64 || '',
    pix_copia_e_cola: pix.qr_code || '',
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + 30 * 60 * 1000
  }

  payments = payments.filter(x => !(store.normalize(x.buyer) === buyer && x.status === 'pending'))
  payments.push(item)
  store.savePayments(payments)
  return item
}

const processar = async () => {
  if (!socket || busy || !tokenConfigurado()) return
  busy = true
  try {
    const payments = store.readPayments()
    let changed = false

    for (const item of payments) {
      if (item.status !== 'pending') continue

      if (Date.now() > Number(item.expiresAt || 0)) {
        item.status = 'expired'
        item.expiredAt = new Date().toISOString()
        changed = true
        continue
      }

      let status
      try { status = await verificarPix(item.id) } catch { continue }
      if (status?.status !== 'approved') continue

      item.status = 'approved'
      item.approvedAt = new Date().toISOString()
      changed = true

      const jid = String(item.chat || item.buyer || '')
      if (jid) {
        await socket.sendMessage(jid, {
          text: `- ✅ \`𝙿𝙰𝙶𝙰𝙼𝙴𝙽𝚃𝙾 𝙰𝙿𝚁𝙾𝚅𝙰𝙳𝙾\`\n\n> 💸 ׄ ( R$ ${Number(item.plan?.valor || 0).toFixed(2).replace('.', ',')} — pagamento confirmado. )\n> 🤖 ׄ ( ${Number(item.plan?.dias || 0)} dias — Sub Bot. )\n\n> • ׄ ( Vamos configurar sua conexão agora. )`
        }).catch(() => {})

        await cadastro.iniciarPagamento(socket, jid, item.plan, item.buyer)
      }
    }

    if (changed) store.savePayments(payments)
  } finally {
    busy = false
  }
}

const iniciar = tokito => {
  socket = tokito
  if (!timer) {
    timer = setInterval(() => processar().catch(() => {}), 10000)
    timer.unref?.()
  }
  processar().catch(() => {})
}

module.exports = { criar, iniciar, processar, tokenConfigurado }