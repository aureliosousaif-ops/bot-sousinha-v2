const manager = require('./manager')
const pagamentos = require('./pagamentos')
const cadastro = require('./cadastro')
const store = require('./store')
const ui = require('./ui')

let started = false
let monitor = null

const verificarValidade = async () => {
  store.expire()
  for (const [number] of manager.workers) {
    const sub = store.get(number)
    if (!sub || sub.status === 'expirado') await manager.stop(number).catch(() => {})
  }
}

const iniciar = async tokito => {
  pagamentos.iniciar(tokito)
  if (!started) {
    started = true
    await manager.restore().catch(() => 0)
  }
  if (!monitor) {
    monitor = setInterval(() => verificarValidade().catch(() => {}), 60000)
    monitor.unref?.()
  }
  return true
}

module.exports = { iniciar, verificarValidade, manager, pagamentos, cadastro, store, ui }