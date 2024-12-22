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
    res.render('index' , {RoomId:req.params.room});
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
    // socket.join(room);
    // socket.to(room).broadcast.emit('userJoined' , id);
    // console.log([room , id]);
    // console.log(socket.id);
    socket.on('disconnect' , ()=>{
        socket.to(rajRooms).broadcast.emit('userDisconnect' , id);
    })
  })
})


  // // Match users
  // if (connectedUsers.length >= 2) {
  //   const user1 = connectedUsers.shift();
  //   const user2 = connectedUsers.shift();
  //   console.log([user1, user2]);
  //   // Notify users about their pair
  //   io.to(user1).emit("match", { peerId: user2 });
  //   io.to(user2).emit("match", { peerId: user1 });
  //   console.log("Matched users:", [user1, user2]);
  // }
server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})
