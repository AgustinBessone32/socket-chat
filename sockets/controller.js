const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers/generar-jwt")
const {ChatInfo} = require('../models')

const chatInfo = new ChatInfo()

const socketController = async(socket = new Socket(),io) => {
    const token = socket.handshake.headers['x-token']
    const user = await comprobarJWT(token)

    if(!user){
        return socket.disconnect()
    }

    //Agregar el usuario conectado
    chatInfo.agregarUsuario(user)
    io.emit('usuarios-activos',chatInfo.usuariosArr )
    socket.emit('recibir-mensajes', chatInfo.ultimos10)

    //Conectarlo a una sala especial
    socket.join(user._id.toString())

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatInfo.desconectarUsuario(user.id)
        io.emit('usuarios-activos',chatInfo.usuariosArr )
    })

    socket.on('enviar-mensaje', ({uid,msj}) => {
        if(uid){
            //mensaje privado
            socket.to(uid).emit('mensaje-privado',{de: user.name, msj})
        }else{
            chatInfo.enviarMensaje(user.id, user.name,msj)
            io.emit('recibir-mensajes', chatInfo.ultimos10)
        }

    })
}

module.exports = {
    socketController
}