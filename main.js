const express = require('express');
const app = express();
const path = require('path');

const server = require('http').Server(app);
const WebSocketServer = require("websocket").server;
//const cors = require('cors');


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);





/*// importamos las librerías requeridas

const express = require('express');
const app = express();
const path = require("path");

const server = require('http').Server(app);
const WebSocketServer = require("websocket").server;
const cors = require('cors');

// Creamos el servidor de sockets y lo incorporamos al servidor de la aplicación
/*const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// Especificamos el puerto en una varibale port, incorporamos cors, express 
// y la ruta a los archivo estáticos (la carpeta public)
//app.set("port", 3001);
//app.use(cors());
//app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);

/*

//app.use(express.static(path.join(__dirname, "")));

function originIsAllowed(origin) {
    // Para evitar cualquier conexión no permitida, validamos que 
    // provenga de el cliente adecuado, en este caso del mismo servidor.
    if(origin === "http://localhost:3000"){
        return true;
    }
    return false;
}

// Cuando llega un request por sockets validamos el origen
// En caso de origen permitido, recibimos el mensaje y lo mandamos
// de regreso al cliente
wsServer.on("request", (request) =>{
    if (!originIsAllowed(request.origin)) {
        // Sólo se aceptan request de origenes permitidos
        request.reject();
        console.log((new Date()) + ' Conexión del origen ' + request.origin + ' rechazada.');
        return;
      }
    const connection = request.accept(null, request.origin);
    connection.on("message", (message) => {
        console.log("Mensaje recibido: " + message.utf8Data);
        connection.sendUTF("Recibido: " + message.utf8Data);
    });
    connection.on("close", (reasonCode, description) => {
        console.log("El cliente se desconecto");
    });
});


// Iniciamos el servidor en el puerto establecido por la variable port (3000)
server.listen(app.get('port'), () =>{
    console.log('Servidor iniciado en el puerto: ' + app.get('port'));
})



/**/
