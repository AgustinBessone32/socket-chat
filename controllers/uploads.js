const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { User, Product } = require('../models')
const cloudinary = require('cloudinary')
cloudinary.config(process.env.CLOUDINARY_URL)
const path = require('path')
const fs = require('fs')


const cargarArchivos = async (req, res = response) => {
    if (!req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir'
        });
    }

    try {
        //const path = await subirArchivo(req.files,undefined,'images')
        const path = await subirArchivo(req.files)
        res.json({
            nombre: path
        })


    } catch (msg) {
        res.status(400).json({ msg })
    }

}

const actualizarImagen = async (req, res = response) => {

    const { id, colection } = req.params

    let model

    switch (colection) {
        case 'user':
            model = await User.findById(id)
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'product':
            model = await Product.findById(id)
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    //limpiar imagenes previas 
    if (model.img){
        const pathImg = path.join(__dirname ,'../uploads',colection,model.img)
        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg)
        }

    }

    const name = await subirArchivo(req.files, undefined, colection)
    model.img = name

    await model.save()

    res.json(model)


}


const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, colection } = req.params

    let model

    switch (colection) {
        case 'user':
            model = await User.findById(id)
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'product':
            model = await Product.findById(id)
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    //limpiar imagenes previas 
    if (model.img){
        const nameArr = model.img.split('/')
        const name = nameArr[nameArr.length - 1]
        const [public_id] = name.split('.')

        cloudinary.uploader.destroy(public_id)
    }

    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    
    model.img = secure_url

    await model.save()

    res.json(model)


}

const mostrarImg = async(req,res=response) => {

    const {colection,id} = req.params

    let model

    switch (colection) {
        case 'user':
            model = await User.findById(id)
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'product':
            model = await Product.findById(id)
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    //limpiar imagenes previas 
    if (model.img){
        const pathImg = path.join(__dirname ,'../uploads',colection,model.img)
        if(fs.existsSync(pathImg)){
            return res.sendFile(pathImg)
        }

    }

    const pathDefault = path.join(__dirname,'../assets/no-image.jpg')


    res.sendFile(pathDefault)
}



module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImg,
    actualizarImagenCloudinary
}