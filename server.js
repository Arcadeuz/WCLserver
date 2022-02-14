const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 8080 });

webSocketServer.on('connection', webSocket => {
  webSocket.on('message', message => {
    console.log('Received:', message);
    broadcast(message);
  });
});

function broadcast(data) {
  webSocketServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}






/*const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 },()=>{
    console.log('server started')
})
wss.on('connection', function connection(ws) {
   ws.on('message', (data) => {
      console.log('data received \n %o',data)
      ws.send(data);
   })
})
wss.on('listening',()=>{
   console.log('listening on 8080')
})*/
