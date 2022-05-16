const { response } = require("express");
const { ObjectId } = require('mongoose').Types
const { User, Category, Product } = require('../models')

const coleccionesPermitidas = [
    'user',
    'category',
    'product',
    'role'
]

const busquedaUser = async (term = '', res = response) => {
    const esMongoId = ObjectId.isValid(term)

    if (esMongoId) {
        const user = await User.findById(term)
        return res.json({
            results: [user]
        })
    }

    const regex = new RegExp(term, 'i')

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    })

    const total = await User.count({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    })

    res.json({
        total,
        results: [users]
    })
}

const busquedaProduct = async (term = '', res = response) => {
    const esMongoId = ObjectId.isValid(term)

    if (esMongoId) {
        const prod = await Product.findById(term)
            .populate('category', 'name')
        return res.json({
            results: [prod]
        })
    }

    const regex = new RegExp(term, 'i')

    const products = await Product.find({ name: regex })
        .populate('category', 'name')

    const total = await Product.count({ name: regex })

    res.json({
        total,
        results: [products]
    })
}


const busquedaCategory = async (term = '', res = response) => {
    const esMongoId = ObjectId.isValid(term)

    if (esMongoId) {
        const category = await Category.findById(term)
        return res.json({
            results: [category]
        })
    }

    const regex = new RegExp(term, 'i')

    const categories = await Category.find({
        $or: [{ name: regex }],
        $and: [{ status: true }]
    })

    const total = await Category.count({
        $or: [{ name: regex }],
        $and: [{ status: true }]
    })

    res.json({
        total,
        results: [categories]
    })
}

const search = (req, res = response) => {

    const { colection, term } = req.params

    if (!coleccionesPermitidas.includes(colection)) {
        res.status(400).json({
            msg: `Las colecciones permitidas son : ${coleccionesPermitidas}`
        })
    }

    switch (colection) {
        case 'user':
            busquedaUser(term, res)
            break

        case 'product':
            busquedaProduct(term, res)
            break

        case 'category':
            busquedaCategory(term, res)
            break

        default:
            res.status(500).json({
                msg: 'Se olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    search
}