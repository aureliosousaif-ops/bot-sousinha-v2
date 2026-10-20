const permitidosDonoSub = new Set([
  'prefixo',
  'channel',
  'bangp',
  'bangplit',
  'entrar',
  'seradm',
  'sermembro',
  'sairall'
])

const aliasesPermitidos = new Set([
  'prefixo', 'setprefix',
  'channel', 'setchannel',
  'bangp', 'unbangp',
  'bangplit',
  'entrar', 'sairgp',
  'seradm', 'sermembro',
  'sairall'
])

const donoPermitido = (canonico, comando) => {
  return permitidosDonoSub.has(String(canonico || '').toLowerCase()) ||
    aliasesPermitidos.has(String(comando || '').toLowerCase())
}

module.exports = { permitidosDonoSub, aliasesPermitidos, donoPermitido }