const express = require('express')//absalute path: node_modules
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')

const app=express()
const server=http.createServer(app)
const io=socketio(server)


// set static folder
app.use(express.static(path.join(__dirname,"public")))

//start server
server.listen(PORT,()=>console.log(`server running on port ${PORT}`))
//handle a socket connection request from web client
const connections=[null,null] //keeping treck og only two players



io.on('connection', socket=>{
    //console.log('new webSocket connection')
    //find an available player number
    let playerIndex=-1 //on defaul or the server is full; we pass this value to user
    for(const i in connections){
        if(connections[i]===null){ //if array is empty playerIndex changes to 0 or 1
            playerIndex=i
            break
        }
    }
    
    //tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)//is going to tell (only) the connecting socket what player number they are
    console.log(`Player ${playerIndex} has connected`)
    //ignore player 3
    if(playerIndex===-1)return

    //keeping the track whether the player ready or not
    connections[playerIndex]=false//we know that we have player index which is not -1; it was null and now we gonna set it to false
     //tell everyone what player number just connnected
     socket.broadcast.emit('player-connection', playerIndex)//is going to tell (everybody else) what player number is connected
     //handle disconnect
     socket.on('disconnect',()=>{
         console.log(`Player ${playerIndex} disconnected`)
         connections[playerIndex]=null
         //Tell everyone what player number just disconnected
         socket.broadcast.emit('player-connection', playerIndex)
     })

     //on ready
     socket.on('player-ready', ()=>{
         socket.broadcast.emit('enemy-ready',playerIndex)
         connections[playerIndex]=true
     })
     //check player connections
     socket.on('check-players',()=>{
         const players=[]
         for (const i in connections){
             connections[i]===null ? players.push({connected:false, ready:false}): //if the particular connection 
             players.push({connected:true, ready:connections[i]})
         } 
         socket.emit('check-players',players)
     })

     //on fire received
     socket.on('mark',id=>{
         console.log(`Shot fired from ${playerIndex}`, id)

         //emit a move to the other player
         socket.broadcast.emit('mark', id)
     })
     socket.on('mark-reply', cell=>{
         console.log(square)

         //forward the reply to the other player
         socket.broadcast.emit('mark-reply', cell)
     })
})
