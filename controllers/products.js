const { response } = require("express");
const { Category, Product } = require('../models')


const obtenerProducts = async(req, res = response) => {
    const { limite = 10, desde = 0 } = req.query

    //Manda un arreglo con todas las promesas que quiero q se ejecuten
    const [productos, total] = await Promise.all([
        Product.find({ status: true })
            .populate('user','name')
            .populate('category','name')
            .skip(Number(desde))
            .limit(Number(limite)),
        Product.countDocuments({ status: true })
    ])

    res.json({
        total,
        productos
    })
}

const obtenerProduct = async(req,res=response) => {
    
    const {id} = req.params

    const product = await Product.findById(id).populate('user','name')

    res.json(product)


}


const crearProduct = async (req, res = response) => {

    const {status,user, ...body} = req.body

    const productDB = await Product.findOne({ name: body.name })

    if (productDB) {
        return res.status(400).json({
            msg: `El producto ${productDB} ya existe`
        })
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = await new Product(data)

    await product.save()

    res.status(201).json({
        product
    })
}

const actualizarProduct = async(req, res= response) => {
    const {id} = req.params

    const {status,user, ...data} = req.body

    if(data.name){
        data.name = data.name.toUpperCase()
    }


    data.user = req.user._id

    const product = await Product.findByIdAndUpdate(id, data,{new:true})

    res.json(product)
}

const borrarProduct = async(req,res = response) => {

    const {id}= req.params

    const prod = await Product.findByIdAndUpdate(id, {status:false}, {new:true})

    res.json(prod)
}


module.exports = {
    crearProduct,
    obtenerProducts,
    obtenerProduct,
    actualizarProduct,
    borrarProduct
}