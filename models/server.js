const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')
const { socketController } = require('../sockets/controller')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.server = require('http').createServer(this.app)
        this.io = require('socket.io')(this.server)


        this.paths ={
            auth: '/api/auth',
            users: '/api/users',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }


        //Conectar BD
        this.conectarDB()

        //Middlewares
        this.middlewares()

        //Rutas
        this.routes()

        //Sockets
        this.sockets()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        //CORS
        this.app.use(cors())
        //Parseo
        this.app.use(express.json())
        //Directorio publico
        this.app.use(express.static('public'))
        //FileUpload - carga de archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.users,require('../routes/user') )
        this.app.use(this.paths.auth,require('../routes/auth') )
        this.app.use(this.paths.categories,require('../routes/categories') )
        this.app.use(this.paths.products,require('../routes/products') )
        this.app.use(this.paths.search,require('../routes/search') )
        this.app.use(this.paths.uploads,require('../routes/uploads') )
    }

    sockets(){
        this.io.on('connection',(socket) => socketController(socket,this.io))
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`)
          })
    }


}

module.exports = Server