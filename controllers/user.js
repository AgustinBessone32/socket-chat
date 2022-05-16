const {response} = require('express')
const User = require('../models/usuario')
const bcrypt = require('bcryptjs')

const usuariosGet = async(req, res=response) => {

    const {limite = 10,desde=0} = req.query

    //Manda un arreglo con todas las promesas que quiero q se ejecuten
    const [usuarios,total] = await Promise.all([
        User.find({status:true})
            .skip(Number(desde))
            .limit(Number(limite)),
        User.countDocuments({status:true})
    ])
    
    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async(req, res=response) => {

    const {id} = req.params
    const {_id,password,google,email,...resto} = req.body

    if(password){
        const salt = bcrypt.genSaltSync()
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await User.findByIdAndUpdate(id,resto)

    res.json({
        usuario  
    })
}

const usuariosPost = async(req, res=response) => {

    const {name,email,password,role} = req.body
    const user = new User({name,email,password,role})
    
    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)
    
    //Guarda en BD
    await user.save()

    res.status(200).json({
        user
    })
}

const usuariosDelete = async(req, res) => {

    const {id} = req.params


    //Borra fisicamente
    //const usuario = await User.findByIdAndDelete(id)

    const usuario = await User.findByIdAndUpdate(id,{status: false})
    const usuarioAutenticado = req.user

    res.json({
        usuario,
    })
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}