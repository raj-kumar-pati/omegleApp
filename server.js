const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});
app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))
let rajRooms =0;
app.get('/' , (req,res)=>{
  //res.send(uuidv4());
  res.render('home' , {RoomId:rajRooms});
});
app.get('/:room' , (req,res)=>{
    res.render('index' , {RoomId:req.params.room,newRoomId:rajRooms});
});
let connectUsers = [];


io.on("connection" , (socket)=>{
  
  socket.on('newUser' , (id , room)=>{
    connectUsers.push(id);
    socket.join(rajRooms);
  


    if(connectUsers.length >= 2){
      const user1 = connectUsers.shift();
      const user2 = connectUsers.shift();
      
      socket.to(rajRooms).broadcast.emit('userJoined' , user1);
      socket.to(rajRooms).broadcast.emit('userJoined' , user2);
      rajRooms ++;
      connectUsers = [];
      console.log([user1 , user2]);
    }
    console.log(rajRooms);
    
    socket.on('disconnect' , ()=>{
        socket.to(rajRooms).broadcast.emit('userDisconnect' , id);
    })
  })
})


server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})
