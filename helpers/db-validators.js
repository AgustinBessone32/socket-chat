const { Category,User,Role,Product } = require('../models')


const esRolValido = async(role='') => {
    const existeRol = await Role.findOne({role})
    if(!existeRol){
        throw new Error(`El rol ${role} no esta registrado en la BD`)
    }
}

const emailExiste = async(email = '') => {
    const existeEmail = await User.findOne({email})
    if(existeEmail){
        throw new Error(`El email ${email} ya esta registrado`)
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUser = await User.findById(id)

    if(!existeUser){
        throw new Error(`El id ${id} no existe`)
    }
}

const existeCategory = async(id) => {
    const existeCategory = await Category.findById(id)

    if(!existeCategory){
        throw new Error(`El id ${id} no existe`)
    }
}

const existeProduct = async(id) => {
    const existeProduct = await Product.findById(id)

    if(!existeProduct){
        throw new Error(`El id ${id} no existe`)
    }
}

const coleccionesPermitidas = (colection='',colects=[]) => {

    const incluida = colects.includes(colection)

    if(!incluida){
        throw new Error(`La coleccion ${colection} no es permitida - ${colects}`)
    }

    return true
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategory,
    existeProduct,
    coleccionesPermitidas
}