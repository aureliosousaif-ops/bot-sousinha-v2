const dylan = require('../../database/lib/comandos')
const sistema = require('../../sub')
const aluguel = require('../../sistemas/aluguel')

const uso = ctx => `- 🤖 \`𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> • ׄ ( ${ctx.prefix}sub — abrir a loja. )\n> • ׄ ( ${ctx.prefix}sub 7 — contratar 7 dias. )\n> • ׄ ( ${ctx.prefix}sub 15 — contratar 15 dias. )\n> • ׄ ( ${ctx.prefix}sub 20 — contratar 20 dias. )\n> • ׄ ( ${ctx.prefix}sub 30 — contratar 30 dias. )\n> • ׄ ( ${ctx.prefix}sub 40 — contratar 40 dias. )\n> • ׄ ( ${ctx.prefix}sub 50 — contratar 50 dias. )\n> • ׄ ( ${ctx.prefix}sub 60 — contratar 60 dias. )`

dylan.setCommand({
  nome: 'sub',
  comandos: ['sub'],
  categoria: 'sub',
  info: {
    descricao: 'Loja e cadastro de Sub Bot.',
    uso: 'sub 30',
    categoria: 'sub'
  },
  async executar(ctx) {
    const input = String(ctx.q || '').trim()

    if (!input) {
      return sistema.ui.enviarLoja(ctx, aluguel.planos())
    }

    const parts = input.split(/\s+/)
    const action = String(parts[0] || '').toLowerCase()

    if (action === 'manual') {
      if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())
      const plan = sistema.store.plan(Number(parts[1]))
      if (!plan) return ctx.reply(uso(ctx))
      return sistema.cadastro.iniciar(ctx, plan, { paid: false, buyer: ctx.sender })
    }

    const plan = sistema.store.plan(Number(action))
    if (!plan) return ctx.reply(uso(ctx))

    try {
      const item = await sistema.pagamentos.criar(ctx, plan.dias)
      return sistema.ui.enviarPix(ctx, item)
    } catch (error) {
      if (String(error?.message || '') === 'MP_TOKEN_NAO_CONFIGURADO') {
        return ctx.reply(ctx.mess.tokenMpAusente())
      }
      return ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾 𝙽𝙾 𝙿𝙰𝙶𝙰𝙼𝙴𝙽𝚃𝙾\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
    }
  }
})