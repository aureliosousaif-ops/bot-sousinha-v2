const dylan = require('../../database/lib/comandos')
const sistema = require('../../sub')

dylan.setCommand({
  nome: 'delsub',
  comandos: ['delsub'],
  categoria: 'sub',
  info: {
    descricao: 'Remove um Sub Bot e a sessão salva.',
    uso: 'delsub numero',
    permissao: 'Dono',
    categoria: 'sub'
  },
  async executar(ctx) {
    if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())
    const number = sistema.store.normalize(ctx.q)
    if (!number) return ctx.reply(`- 🗑️ \`𝚁𝙴𝙼𝙾𝚅𝙴𝚁 𝚂𝚄𝙱\`\n\n> • ׄ ( Use ${ctx.prefix}delsub 5511999999999. )`)
    if (!sistema.store.get(number)) return ctx.reply(`- ⚠️ \`𝚂𝚄𝙱 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\``)
    await sistema.manager.remove(number)
    return ctx.reply(`- ✅ \`𝚂𝚄𝙱 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\`\n\n> • ׄ ( ${number} foi removido com a sessão e os dados próprios. )`)
  }
})