const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer} = require('socket.io')
const { connectionChat } = require('./options/sqlite3con.js')
const { connectionProducts } = require('./options/mysqlcon.js')
const ClientSql = require('./sqlContainer')

const { Router } = express
const app = express()
const httpServer = HttpServer(app)
const io = new IOServer(httpServer)

const products = new Router

const PORT = 8080


const sql = new ClientSql(connectionProducts)
const sqlChat = new ClientSql(connectionChat)


app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api/productos", products)


sql.createProdTable()
sqlChat.createChatTable()


//gets
products.get('/', async (req, res) =>{
    const products = await sql.getAll()
    res.render("layout", {products})
})

products.get('/:id', async (req, res) =>{
    const id = req.params.id
    res.json(await sql.getById(parseInt(id)))
})


//post
products.post('/', async (req, res) =>{
    res.json(await sql.writeFile(req.body), res.redirect('/api/productos'))
})


//put
products.put('/id', async (req, res) =>{
    const id = req.params.id
    const object = req.body
    res.json(await sql.update(obj, parseInt(id)))
})


// delete
products.delete('/', async (req, res) =>{
    const id = req.params.id
    res.json(await sql.deleteById(parseInt(id)))
})


//sockets
io.on('connection', async socket =>{
    socket.emit('messages', await sqlChat.getAll())

    socket.on('new-message', async data =>{
        await sqlChat.writeFile({...data, fyh: new Date().toLocaleString})

        io.sockets.emit('messages', await sqlChat.getAll())
    })

})

httpServer.listen(PORT, ()=>{
    console.log('Servidor escuchando en ' + PORT)
})