const dylan = require('../../database/lib/comandos')
const sistema = require('../../sub')

dylan.setCommand({
  nome: 'restartsub',
  comandos: ['restartsub'],
  categoria: 'sub',
  info: {
    descricao: 'Reinicia um processo de Sub Bot pelo bot principal.',
    uso: 'restartsub numero',
    permissao: 'Dono',
    categoria: 'sub'
  },
  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())
    const number = sistema.store.normalize(ctx.q)
    const sub = sistema.store.get(number)
    if (!sub) return ctx.reply(`- ⚠️ \`𝚂𝚄𝙱 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\``)
    try {
      await sistema.manager.restart(number)
      return ctx.reply(`- ✅ \`𝚂𝚄𝙱 𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙳𝙾\`\n\n> • ׄ ( ${number} foi reiniciado. )`)
    } catch (error) {
      return ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
    }
  }
})