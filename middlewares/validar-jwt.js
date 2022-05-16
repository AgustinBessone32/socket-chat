const { response } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/usuario')

const validarjwt = async(req,res=response,next) => {

    const token = req.header('x-token')
    
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const {uuid} = jwt.verify(token,process.env.SECRETKEY)

        const user = await User.findById(uuid)

        if(!user){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existente en DB'
            })
        }

        if(!user.status){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }
        
        req.user = user
        
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

   
}


module.exports = {
    validarjwt
}