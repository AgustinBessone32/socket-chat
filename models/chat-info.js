class Mensaje{
    constructor(uid,name,msj){
        this.uid = uid
        this.name = name
        this.msj = msj
    }
}

class ChatInfo {
    constructor(){
        this.mensajes = []
        this.usuarios = {}
    }

    get ultimos10(){
        this.mensajes = this.mensajes.splice(0,10)
        return this.mensajes
    }

    get usuariosArr(){
        return Object.values(this.usuarios)
    }

    enviarMensaje(uid,name,msj){
        this.mensajes.unshift(
            new Mensaje(uid,name,msj)
        )
    }

    agregarUsuario(user){
        this.usuarios[user.id] = user
    }

    desconectarUsuario(id){
        delete this.usuarios[id]
    }
}

module.exports = ChatInfo