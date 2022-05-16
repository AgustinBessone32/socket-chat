const jwt = require('jsonwebtoken')
const {User} = require('../models')

const generarJWT = (uuid = '') => {

    return new Promise((resolve,reject) => {
            const payload = {uuid}
            jwt.sign(payload,process.env.SECRETKEY, {
                expiresIn: '4h'
            },(err,token) => {
                if(err){
                    console.log(err)
                    reject('No se pudo generar el token')
                }else{
                    resolve(token)
                }
            })

    })

}


const comprobarJWT = async(token = '') => {

    try {
        if(token.length < 10){
            return null
        }

        const {uuid}= jwt.verify(token, process.env.SECRETKEY)
        const user = await User.findById(uuid)

        if(user){
            if(user.status){
                return user
            }
            return null
        }else{
            return null
        }

        
    } catch (error) {
        return null   
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}