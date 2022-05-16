const { Router } = require('express')
const { check } = require('express-validator')
const { crearProduct, obtenerProduct, actualizarProduct, borrarProduct, obtenerProducts } = require('../controllers/products')
const { existeCategory, existeProduct } = require('../helpers/db-validators')
const { validarCampos, validarjwt, esAdminRole } = require('../middlewares')




const router = Router()


router.get('/', obtenerProducts)

 router.get('/:id',[
     check('id', 'No es un id de mongo valido').isMongoId(),
     check('id').custom(existeProduct),
     validarCampos
 ], obtenerProduct)

router.post('/', [
    validarjwt,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id de mongo').isMongoId(),
    check('category').custom(existeCategory),
    validarCampos
], crearProduct)

 router.put('/:id', [
     validarjwt,
     check('id').custom(existeProduct),
     validarCampos
 ],actualizarProduct)

 router.delete('/:id',[
     validarjwt,
     esAdminRole,
     check('id','No es un mongo id').isMongoId(),
     check('id').custom(existeProduct),
     validarCampos
 ],borrarProduct )


module.exports = router