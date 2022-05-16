const { Router } = require('express')
const { check } = require('express-validator')
const { crearCategoria, obtenerCategories,obtenerCategory, actualizarCategory, borrarCategory } = require('../controllers/categories')
const { existeCategory } = require('../helpers/db-validators')
const { validarCampos, validarjwt, esAdminRole } = require('../middlewares')




const router = Router()


router.get('/', obtenerCategories)

router.get('/:id',[
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategory),
    validarCampos
], obtenerCategory)

router.post('/', [
    validarjwt,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

router.put('/:id', [
    validarjwt,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategory),
    validarCampos
],actualizarCategory)

router.delete('/:id',[
    validarjwt,
    esAdminRole,
    check('id','No es un mongo id').isMongoId(),
    check('id').custom(existeCategory),
    validarCampos
],borrarCategory)


module.exports = router