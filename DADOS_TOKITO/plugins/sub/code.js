const dylan = require('../../database/lib/comandos')
const sistema = require('../../sub')

const escolher = ctx => {
  const digitado = sistema.store.normalize(ctx.q)
  if (digitado) {
    const item = sistema.store.get(digitado)
    if (item && (ctx.SoDono || sistema.store.normalize(item.owner) === sistema.store.normalize(ctx.sender))) return item
  }
  const meus = sistema.store.byOwner(ctx.sender)
  return meus.length === 1 ? meus[0] : null
}

dylan.setCommand({
  nome: 'code',
  comandos: ['code'],
  categoria: 'sub',
  info: {
    descricao: 'Inicia/reconecta a sessão do próprio Sub Bot.',
    uso: 'code',
    categoria: 'sub'
  },
  async executar(ctx) {
    if (ctx.isGroup) return ctx.reply(`- 🔒 \`𝙿𝚁𝙸𝚅𝙰𝙳𝙾\`\n\n> • ׄ ( Use este comando no privado. )`)

    const sub = escolher(ctx)
    if (!sub) {
      const meus = sistema.store.byOwner(ctx.sender)
      if (meus.length > 1) {
        return ctx.reply(`- 🤖 \`𝚂𝙴𝚄𝚂 𝚂𝚄𝙱𝚂\`\n\n${meus.map(x => `> • ׄ ( ${x.number} — ${x.status}. )`).join('\n')}\n\n> • ׄ ( Informe o número depois de ${ctx.prefix}code. )`)
      }
      return ctx.reply(`- ⚠️ \`𝚂𝚄𝙱 𝙽𝙰̃𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙾\`\n\n> • ׄ ( Nenhum Sub Bot foi encontrado para você. )`)
    }

    try {
      const result = sistema.manager.start(sub.number, {
        onCode: (code, current) => sistema.ui.enviarCodigoPrivado(ctx, current, code),
        onOnline: current => sistema.ui.enviarConectado(ctx, current),
        onError: error => ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
      })

      if (result.reused) {
        return ctx.reply(`- 🟢 \`𝚂𝚄𝙱 𝙰𝚃𝙸𝚅𝙾\`\n\n> • ׄ ( A sessão ${sub.number} já está em execução. )`)
      }

      if (result.registered) {
        return ctx.reply(`- 🟡 \`𝚂𝙴𝚂𝚂𝙰̃𝙾 𝚂𝙰𝙻𝚅𝙰\`\n\n> • ׄ ( Iniciando a sessão ${sub.number} sem gerar um novo código. )`)
      }

      return true
    } catch (error) {
      return ctx.reply(`- ❌ \`𝙴𝚁𝚁𝙾\`\n\n> • ׄ ( ${String(error?.message || error)} )`)
    }
  }
})