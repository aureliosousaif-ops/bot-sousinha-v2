/*
 * ============================================================
 *                     TOKITO BOT V10
 * ============================================================
 *
 * Projeto disponibilizado gratuitamente para a comunidade.
 *
 * Você pode modificar, personalizar e utilizar este bot
 * conforme sua preferência, inclusive mantendo o nome Tokito.
 *
 * REGRAS:
 * • É proibida a venda ou revenda deste código-fonte.
 * • Não comercialize versões modificadas deste projeto.
 * • Não reivindique a autoria original do projeto.
 * • Respeite os créditos e o trabalho dos desenvolvedores.
 * • Utilize o projeto com respeito e responsabilidade.
 *
 * ATENÇÃO:
 * A venda, revenda ou comercialização não autorizada deste
 * projeto poderá resultar em medidas legais para proteção
 * dos direitos dos autores, incluindo processo judicial,
 * conforme a legislação aplicável.
 *
 * Author: Dylan Modz
 * API oficial: https://tokito-apis.com.br
 *
 * Modifique como quiser. Apenas respeite as regras.
 * ============================================================
 */

const aluguel = require('../../sistemas/aluguel/index')

const dylan = require('../../database/lib/comandos')

dylan.setCommand({
nome: 'lista-aluguel',
comandos: ['lista-aluguel'],
categoria: 'aluguel',
info: {
descricao: 'Lista grupos registrados no aluguel.',
uso: 'lista-aluguel',
permissao: 'Dono',
categoria: 'aluguel'
},
async executar(ctx) {
if (!ctx.SoDono)
return ctx.reply(ctx.mess.onlyOwner())
const lista = aluguel.ativos()
const enriquecida = await Promise.all(lista.map(async g => {
let grupoNome = String(g.grupoNome || '').trim()
let quantidadeMembros = Number(g.quantidadeMembros || 0)
try {
if (ctx.tokito?.groupMetadata) {
const meta = await ctx.tokito.groupMetadata(g.id)
grupoNome = String(meta?.subject || grupoNome).trim()
quantidadeMembros = Array.isArray(meta?.participants) ? meta.participants.length : quantidadeMembros
}
} catch {}
return { ...g, grupoNome, quantidadeMembros }
}))
return ctx.reply(ctx.mess.aluguelLista(enriquecida))
}
}
)
