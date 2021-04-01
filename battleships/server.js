const express = require('express')
const path=require('path')
const http=require('http')
const PORT=process.env.PORT || 3000
const socketio=require('socket.io')
const { Console } = require('console')
const app=express()
const server=http.createServer(app)
const io=socketio(server)

// set static folde3r
app.use(express.static(path.join(__dirname,"public")))
//console.log("__dirname " + (path.join( "public")))
//start server
server.listen(PORT, ()=>console.log(`server running on port ${PORT}`))

//handle a socket connection request from web client
const connections=[null,null];

io.on('connection', socket=>{
    //console.log('NEw WS Connection')
    
    //find an available player number
    let playerIndex = -1;
    for(const i in connections){
        if(connections[i]===null){
            playerIndex=i;
            break;
        }
    }

   

    //tell the connecting client what player number they are
    socket.emit('player-number', playerIndex);
    console.log(`Player ${playerIndex} has connected`)

     //ignore player 3
     if(playerIndex===-1) return;
     connections[playerIndex]=false
     //tell everyone what player number just connected
     socket.broadcast.emit('player-connection', playerIndex)

     //handle Disconnect
     socket.on('disconnect', ()=>{
         console.log(`Player ${playerIndex} disconnected`)
         connections[playerIndex]=null
         //tell everyone what player nuber just disconnected
         socket.broadcast.emit('player-connection', playerIndex)
     })
     //on ready
     socket.on('player-ready', ()=>{
         socket.broadcast.emit('enemy-ready', playerIndex)
         connections[playerIndex]=true

     })
     //check player connections
     socket.on('check-players',()=>{
         const players=[]
         for (const i in connections){
            (connections[i]===null) ? (players.push({connected:false,ready:false})): (players.push({connected:true, ready:connections[i]}))
         }
         socket.emit('check-players', players)
     })
    // on Fire received
    socket.on('fire', id=>{
       console.log(`shot fired from ${playerIndex}`, id) 

    //emit the move to the other player
       socket.broadcast.emit('fire', id) 

    })
    //on fire reply
    socket.on('fire-reply', square=>{
        console.log(square)

        //forward the reply to the other player
        socket.broadcast.emit('fire-reply', square)
    })
    //Timeout connection
    setTimeout(()=>{
        connections[playerIndex]=null
        socket.emit('timeout')
        socket.disconnect()
    }, 600000)//10 min limit per player
})

