//inclusão das bibliotecas
const express = require('express')
const app  = express()

app.use(express.static('public'))

const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)

const porta = process.env.PORT || 8000 //verifica qual a porta está hospedado

const host = process.env.PORT.HEROKU_APP_NAME ? `http://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

http.listen(porta, function(){
    const portaStr = porta === 80 ? '' : ':' + porta
    if (process.env.PORT.HEROKU_APP_NAME) {
        console.log("Servidor iniciado. Abra o navegador em: " + host);
    } else {
        
    }
    console.log("Servidor iniciado. Abra o navegador em: " + host + portaStr);
})

app.get('/', function(req, resp){
    resp.sendFile(__dirname + '/index.html')
})

serverSocket.on('connection', function (socket) {
    
    socket.on('login', function(nickname){
        console.log("Cliente conectado:"+nickname)
        serverSocket.emit('chat msg', `Usuário ${nickname} conectou.`)
        socket.nickname = nickname
    })

    
    socket.on('chat msg', function(msg){
        console.log(`Msg recebida do cliente ${socket.nickname}: ${msg}`);
        
        //enviar a msg para tds os clientes conectados
        serverSocket.emit('chat msg', `${socket.nickname}: ${msg}`) 
    })

    socket.on('status', function(msg){        
        //enviar a msg para tds os clientes conectados
        socket.broadcast.emit('status', msg)//mandando msg p tdo mundo menos para ele mesmo 
    })

})