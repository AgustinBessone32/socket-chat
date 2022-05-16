const { response, json } = require("express");
const User = require('../models/usuario')
const bcrypt = require('bcryptjs');
const usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const {googleVerify} = require('../helpers/google-verify')



const login = async(req, res = response) => {

    const { email, password } = req.body


    try {

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                msg: 'Usuario / Contraseña incorrectos - correo'
            })
        }

        if(!user.status){
            return res.status(400).json({
                msg: 'Usuario / Contraseña incorrectos - estado: false'
            })
        }

        const validPass = bcrypt.compareSync(password, user.password)

        if(!validPass){
            return res.status(400).json({
                msg: 'Usuario / Contraseña incorrectos - contraseña'
            })
        }

        //Generar JWT
        const token = await generarJWT(user.id)

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }



}

const googleSignIn = async(req,res=response) => {

    const {id_token} = req.body

    try {
        const {name,email,picture} = await googleVerify(id_token)
        
        let user = await User.findOne({email})

        if(!user){
            const data = {
                name,
                email,
                password:':P',
                img: picture,
                google: true,
                role: 'USER'
            }

            user = new User(data)
            await user.save()
        }

        if(!user.status ){
            res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT(user.id)

        res.json({
            user,
            token
        })
        
    } catch (error) {
         res.status(400).json({
             msg: ' El token no se pudo verificar'
         })
    }
}

const validaryrenovarToken = async(req,res=response) => {

    const {user} = req

    const token = await generarJWT(user.id)
    
    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    validaryrenovarToken
}