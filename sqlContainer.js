const knex = require('knex')


class ClientSql{

    constructor(options){
        this.knex = knex(options)
    }

    createProdTable(){
        return this.knex.schema.hasTable('productos')
            .then(()=>{
                return this.knex.schema.createTable('productos', table => {
                    table.increments('id').primary()
                    table.string('title', 25).notNullable()
                    table.float('price')
                    table.string('thumbnail', 75).notNullable()
                    table.integer('stock')
                })
            })
            .catch(()=>{
                console.log('Error en creacion de tabla')
            })
    }

    writeFile(productos){ //save - write
        return this.knex('productos').insert(productos)
    }

    getAll(){ //getAll
        return this.knex('productos').select('*')
    }

    getById = id => { //getById
        return this.knex('productos').select('*').where('id', '=', id)
    }

    deleteById(id){ //deleteById
        return this.knex('productos').where('id', '=', id).del()
    }

    deleteAll(){
        return this.knex('productos').del()
    }

    update(obj, id){ //update
        return this.knex('productos').where('id', '=', id).update(obj)
    }

    //sqlite3
    createChatTable(){
        return this.knex.schema.hasTable('chat')
        .then(()=>{
            return this.knex.schema.createTable('chat', table =>{
                table.increments('id').primary()
                table.string('author', 30).notNullable()
                table.string('text')
                table.string('fyh').notNullable()
            })
        })
        .catch(() =>{
            console.log('error en creacion de tabla')
        })
    }

    getAllChat(){
        return this.knex('chat').select('*')
    }

    newChat(chat){
        return this.knex('chat').insert(chat)
    }

    close(){
        this.knex.destroy()
    }
}

module.exports = ClientSql
