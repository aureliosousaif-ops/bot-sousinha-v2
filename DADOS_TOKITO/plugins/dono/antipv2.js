const modulos = require('../../sistemas/modulos')
const dylan = require('../../database/lib/comandos')

const emoji = '🔒'
const titulo = '𝙰𝙽𝚃𝙸-𝙿𝚅 2'
const descricao = 'ᴀᴠɪsᴀ ᴇ ʙʟᴏǫᴜᴇɪᴀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ ǫᴜᴇᴍ ᴄʜᴀᴍᴀʀ ᴏ ʙᴏᴛ ɴᴏ ᴘʀɪᴠᴀᴅᴏ.'

dylan.setCommand({
nome: 'antipv2',
comandos: ['antipv2'],
categoria: 'dono',
info: {
descricao: 'Ativa ou desativa o Anti-PV 2 global.',
uso: 'antipv2 1/0',
permissao: 'Dono'
},
async executar(ctx) {
if (!ctx.SoDono) return ctx.reply(ctx.mess.onlyOwner())
const valor = String(ctx.q || '').trim()
if (!['0', '1'].includes(valor)) {
return ctx.reply(ctx.mess.funcaoUso(emoji, titulo, ctx.prefix, ctx.command, descricao))
}
const config = modulos.globalCfg()
config.antipv2 = valor === '1'
modulos.salvarGlobal(config)
return ctx.reply(
config.antipv2
? ctx.mess.funcaoAtivada(emoji, titulo, descricao)
: ctx.mess.funcaoDesativada(emoji, titulo, descricao)
)
}
})
