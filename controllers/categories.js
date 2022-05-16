const { response } = require("express");
const { Category } = require('../models')


const obtenerCategories = async(req, res = response) => {
    const { limite = 10, desde = 0 } = req.query

    //Manda un arreglo con todas las promesas que quiero q se ejecuten
    const [categorias, total] = await Promise.all([
        Category.find({ status: true })
            .populate('user','name')
            .skip(Number(desde))
            .limit(Number(limite)),
        Category.countDocuments({ status: true })
    ])

    res.json({
        total,
        categorias
    })
}

const obtenerCategory = async(req,res=response) => {
    
    const {id} = req.params

    const category = await Category.findById(id).populate('user','name')

    res.json(category)


}


const crearCategoria = async (req, res = response) => {

    const name = req.body.name.toUpperCase()

    const categoryDB = await Category.findOne({ name })

    if (categoryDB) {
        return res.status(400).json({
            msg: `La categoria ${name} ya existe`
        })
    }

    const data = {
        name,
        user: req.user._id
    }

    const category = await new Category(data)

    await category.save()

    res.status(201).json({
        category
    })
}

const actualizarCategory = async(req, res= response) => {
    const {id} = req.params

    const {status,user, ...data} = req.body

    data.name = data.name.toUpperCase()

    data.user = req.user._id

    const category = await Category.findByIdAndUpdate(id, data,{new:true})

    res.json(category)
}

const borrarCategory = async(req,res = response) => {

    const {id}= req.params

    const cat = await Category.findByIdAndUpdate(id, {status:false}, {new:true})

    res.json(cat)
}


module.exports = {
    crearCategoria,
    obtenerCategories,
    obtenerCategory,
    actualizarCategory,
    borrarCategory
}