const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivos, actualizarImagen, mostrarImg, actualizarImagenCloudinary } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers/db-validators')
const { validarArchivo } = require('../middlewares')
const { validarCampos } = require('../middlewares/validar-campos')



const router = Router()

router.post('/',validarArchivo, cargarArchivos)


router.put('/:colection/:id', [
    validarArchivo,
    check('id','El id debe ser de mongo').isMongoId(),
    check('colection').custom(c => coleccionesPermitidas(c, ['user','product'])),
    validarCampos
],actualizarImagenCloudinary)

router.get('/:colection/:id',[
    check('id','El id debe ser de mongo').isMongoId(),
    check('colection').custom(c => coleccionesPermitidas(c, ['user','product'])),
    validarCampos
], mostrarImg)




module.exports = router