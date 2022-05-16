const { Router } = require('express')
const { check } = require('express-validator')
const { login, googleSignIn,validaryrenovarToken } = require('../controllers/auth')
const { validarCampos,validarjwt } = require('../middlewares')



const router = Router()


router.post('/login',[
    check('email','El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
] ,login)

router.post('/google',[
    check('id_token','Token de google necesario').not().isEmpty(),
    validarCampos
] ,googleSignIn)

router.get('/',validarjwt, validaryrenovarToken)



module.exports = router