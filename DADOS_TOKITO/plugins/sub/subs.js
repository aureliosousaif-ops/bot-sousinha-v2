const dylan = require('../../database/lib/comandos')
const sistema = require('../../sub')

dylan.setCommand({
  nome: 'subs',
  comandos: ['subs'],
  categoria: 'sub',
  info: {
    descricao: 'Lista todos os Sub Bots.',
    uso: 'subs',
    permissao: 'Dono',
    categoria: 'sub'
  },
  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())
    sistema.store.expire()
    const items = sistema.store.list()
    const stats = sistema.manager.stats()
    if (!items.length) return ctx.reply(`- 🤖 \`𝚂𝚄𝙱 𝙱𝙾𝚃𝚂\`\n\n> • ׄ ( Nenhum Sub Bot cadastrado. )`)

    const list = items.map((x, i) => `> 『 \`${i + 1}°\` 』— 📱 ${x.number}\n> 👤 ׄ ( ${x.owner || '—'} — dono. )\n> 📦 ׄ ( ${x.days || 0} dias — plano. )\n> 📌 ׄ ( ${x.status || 'offline'} — status. )`).join('\n\n')
    return ctx.reply(`- 🤖 \`𝚂𝚄𝙱 𝙱𝙾𝚃𝚂\`\n\n> 🧊 ׄ ( ${stats.total} — cadastrados. )\n> 🟢 ׄ ( ${stats.online} — online. )\n> ⚙️ ׄ ( ${stats.running} — processos ativos. )\n\n${list}`)
  }
})