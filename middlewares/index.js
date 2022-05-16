const validarCampos = require('./validar-campos')
const validarjwt  = require('./validar-jwt')
const validarRoles = require('./validar-rol')
const validarArchivo = require('./validar-archivo')

module.exports = {
    ...validarCampos,
    ...validarjwt,
    ...validarRoles,
    ...validarArchivo
}