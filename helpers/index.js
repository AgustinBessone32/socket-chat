const dbValidators = require('./db-validators')
const generarjwt = require('./generar-jwt')
const googleVerify = require('./google-verify')
const subirArchivo = require('./subir-archivo')

module.exports ={
    ...dbValidators,
    ...generarjwt,
    ...googleVerify,
    ...subirArchivosubirArchivo
}