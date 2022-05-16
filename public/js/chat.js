
let usuario = null
let socket = null 
const url = 'http://localhost:8080/api/auth/'

const txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const btnSalir = document.querySelector('#btnSalir')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')

const validarJWT = async() => {
    const tokenn = localStorage.getItem('token') || ''

    if(tokenn.length  <= 10){
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    const rta = await fetch(url, {
        headers: {'x-token': tokenn}
    })

    const {user, token} = await rta.json()
    localStorage.setItem('token',token)
    usuario = user

    await conectarSocket()
    
}


const conectarSocket =async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    })

    socket.on('connect', () => {

    })

    socket.on('disconnect', () => {
        
    })

    socket.on('recibir-mensajes', (payload) => {
        dibujarMensajes(payload)
    })

    socket.on('usuarios-activos', (payload) => {
        dibujarUsuarios(payload)
    })

    socket.on('mensaje-privado', (payload) => {
        console.log(payload)
    })

}

const dibujarUsuarios = (users = []) => {
    let usersHtml = ''
    users.forEach(({name,uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class='text-success'>${name} </h5>
                    <span class='fs-6 text-muted'>${uid}</span>

                </p>
            </li>
        `
    })

    ulUsuarios.innerHTML = usersHtml
}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = ''
    console.log(mensajes)
    mensajes.forEach(({name,msj}) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class='text-primary'>${name}:  </span>
                    <span >${msj}</span>

                </p>
            </li>
        `
    })

    ulMensajes.innerHTML = mensajesHtml
}

txtMensaje.addEventListener('keyup' , ({keyCode}) => {
    
    const msj = txtMensaje.value
    const uid = txtUid.value
    if(keyCode !== 13) {return}

    if(msj.length === 0) {return}

    socket.emit('enviar-mensaje', {msj,uid})

    txtMensaje.value = ''

})

const main = async() => {

    await validarJWT()

}


main()


//const socket = io()

