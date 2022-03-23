// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const cors=require("cors");
app.use(cors());
const io = require('socket.io')(server,{
        cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
                transports: ['websocket', 'polling'],
        },
        allowEIO3: true
        });




const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

let numUsers = 0;
let gameServers = new Array();
let userID = 1; //mejorar para que no se mezclen los ids. Tendria que ser un array
let svrID = 1; //mejorar para que no se mezclen. Tendria que ser un array

io.on('connection', (socket) => {
        let addedUser = false;
        socket.username = "";
        socket.userID = 0;
        socket.svrID = 0;      

        // when the client emits 'new message', this listens and executes
        socket.on('new message', (data) => {
                // we tell the client to execute 'new message'
                socket.broadcast.emit('new message', {
                        username: socket.username,
                        message: data
                });
        });

        // when the client emits 'add user', this listens and executes
        socket.on('add user', (username) => {
                if (addedUser) return;
                // we store the username in the socket session for this client
                socket.username = username;
                socket.userID = userID;
                socket.svrID = 0;
                ++numUsers;
                ++userID;
                addedUser = true;
                socket.emit('login', {
                        numUsers: numUsers,
                        loginUserID: userID
                 });
    
                // echo globally (all clients) that a person has connected
                socket.broadcast.emit('user joined', {
                        username: socket.username,
                        numUsers: numUsers
                });
          });
  
        // when the clientServer emits 'createGameServer', this listens and executes
        socket.on('createGameServer', (serverConfig) => {
                if (socket.svrID != 0) {
                        socket.emit('onlineError', "alredyOnServer");
                }else{
                        let server = {ownerName: socket.username, ownerID: socket.userID, sID: svrID, players: [socket.userID], sData: serverConfig}
                        gameServers.push(server);
                        socket.join("svrID-"+svrID);
                        socket.svrID = svrID;
                        io.sockets.in("svrID-"+socket.svrID).emit('onGameServer', socket.svrID);
                        ++svrID;
                } 
        });
        
        // when the clientServer emits 'actualizeGameServer', this listens and executes
        socket.on('actualizeGameServer', (serverConfig) => {
                if (socket.svrID == 0) {
                        socket.emit('onlineError', "notOnServer");
                }else{        
                        i = gameServers.findIndex(server => server.sID == socket.svrID;);
                        gameServers[i].sData = serverConfig;
                        io.sockets.in("svrID-"+socket.svrID).emit('newConfigGameServer', gameServers[i].sData);
                }
                
                
        });
        
  
        socket.on('listGameServer', (from) => {
                socket.emit('currentGameServer', gameServers);
        });
  
        socket.on('joinGameServer', (serverID) => {
                if (socket.svrID != 0) {
                        socket.emit('onlineError', "alredyOnServer");
                }else{        
                        socket.svrID = serverID;
                        socket.join("svrID-"+serverID);
                        io.sockets.in("svrID-"+serverID).emit('playerJoin', {userID: socket.userID, userName: socket.username});
                        i = gameServers.findIndex(server => server.sID == serverID);
                        gameServers[i].players.push(socket.userID);
             
                }
        });

        socket.on('leaveGameServer', (data) => {
                if (socket.svrID == 0) {
                        socket.emit('onlineError', "NotOnServer");
                }else{        
                        io.sockets.in("svrID-"+socket.svrID ).emit('playerLeft', {userID: socket.userID});
                        socket.leave("svrID-"+socket.svrID );
                        i = gameServers.findIndex(server => server.sID == socket.svrID);
                        j = gameServers[i].players.indexOf(socket.userID)
                        gameServers[i].players.splice(j,1);
                        if ( gameServers[i].ownerID  == socket.userID){
                            if (gameServers[i].players.length > 0){ //put first player joint to owner
                                gameServers[i].ownerID = gameServers[i].players[0];
                            } else{
                                //delete gameserver
                                gameServers.splice(i,1);    
                            }   
                        }
                        socket.svrID = 0;
             
                }
        });
        
        socket.on('deleteGameServer', (data) => {
                if (socket.svrID == 0) {
                        socket.emit('onlineError', "NotOnServer");
                }else{        
                        io.sockets.in("svrID-"+socket.svrID ).emit('serverLeft', "disconnectServer");
                        //socket.leave("svrID-"+socket.svrID );
                        socket.socketsLeave("svrID-"+socket.svrID );
                        i = gameServers.findIndex(server => server.sID == socket.svrID);
                        gameServers.splice(i,1); 
                        socket.svrID = 0;
                }
        });
        
  
        socket.on('sendtoGameServer', (data) => {
                if (socket.svrID == 0) {
                        socket.emit('onlineError', "notOnServer");
                }else{
                        io.sockets.in("svrID-"+ socket.svrID).emit('gameServerInfo', data);
                }
        });

  
  
        // when the user disconnects.. perform this
        socket.on('disconnect', () => {
                if (addedUser) {
                        --numUsers;
                        // echo globally that this client has left
                        socket.broadcast.emit('user left', {
                                username: socket.username,
                                numUsers: numUsers
                        });
                }
        });
});
