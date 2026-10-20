const dylan = require('../../database/lib/comandos')
const sistema = require('../../sub')

const dataBR = value => {
  const date = new Date(value || 0)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' })
}

dylan.setCommand({
  nome: 'meu',
  comandos: ['meu'],
  categoria: 'sub',
  info: {
    descricao: 'Mostra os Sub Bots cadastrados no seu número.',
    uso: 'meu',
    categoria: 'sub'
  },
  async executar(ctx) {
    sistema.store.expire()
    const items = sistema.store.byOwner(ctx.sender)
    if (!items.length) {
      return ctx.reply(`- 🤖 \`𝙼𝙴𝚄 𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n> • ׄ ( Você ainda não possui um Sub Bot cadastrado. )`)
    }

    const list = items.map((x, i) => `> 『 \`${i + 1}°\` 』— 📱 ${x.number}\n> 🟢 ׄ ( ${x.status || 'offline'} — status. )\n> 📦 ׄ ( ${x.days || 0} dias — plano. )\n> 📅 ׄ ( ${dataBR(x.expiresAt)} — validade. )`).join('\n\n')
    return ctx.reply(`- 🤖 \`𝙼𝙴𝚄 𝚂𝚄𝙱 𝙱𝙾𝚃\`\n\n${list}`)
  }
})