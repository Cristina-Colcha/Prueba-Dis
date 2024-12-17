const express = require('express');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Configuración de CORS y middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos desde la carpeta 'public'
app.use(express.json()); // Para leer cuerpos de solicitudes POST

// WebSocket para comunicación en tiempo real
const wss = new WebSocket.Server({ port: 3001 });
let clients = [];

// Cola para los mensajes
let messageQueue = [];

// WebSocket: Alguien se conecta
wss.on('connection', (ws) => {
    clients.push(ws);

    // Cuando un mensaje es recibido, se envía a todos los demás clientes
    ws.on('message', (message) => {
        console.log('Mensaje recibido: ', message);
        clients.forEach(client => {
            if (client !== ws) {
                client.send(message);  // Reenviar el mensaje a todos los clientes
            }
        });
    });

    // Eliminar cliente de la lista cuando se desconecta
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

// Endpoint POST /message para recibir los mensajes
app.post('/message', (req, res) => {
    const { sender, message } = req.body;

    if (!message) {
        return res.status(400).send({ error: 'El mensaje es obligatorio.' });
    }

    // Agregar un timestamp para organizar los mensajes por orden de llegada
    const timestamp = Date.now();
    messageQueue.push({ sender, message, timestamp });

    console.log('Nuevo mensaje recibido:', message);
    processQueue();

    // Enviar mensaje a todos los clientes en tiempo real (WebSocket)
    clients.forEach(client => {
        client.send(`${sender}: ${message}`);
    });

    res.status(200).send({ message: 'Mensaje recibido y procesado.' });
});

// Función para simular el procesamiento de los mensajes en la cola
function processQueue() {
    if (messageQueue.length === 0) {
        console.log('No hay mensajes en la cola.');
        return;
    }

    // Ordenar los mensajes por timestamp para garantizar que se procesen en el orden correcto
    messageQueue.sort((a, b) => a.timestamp - b.timestamp);

    const currentMessage = messageQueue.shift(); // Procesar el primer mensaje
    console.log('Procesando mensaje:', currentMessage);

    setTimeout(() => {
        console.log(`Mensaje procesado: ${currentMessage.message}`);
        processQueue();  // Llamada recursiva para procesar el siguiente mensaje
    }, 2000);  // Simulación de retraso en el procesamiento
}

// Endpoint GET /messages para obtener todos los mensajes
app.get('/messages', (req, res) => {
    res.status(200).send(messageQueue);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
