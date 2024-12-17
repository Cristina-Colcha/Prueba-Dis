// Importar las dependencias
const express = require('express');
const cors = require('cors');
const path = require('path');  // Para trabajar con rutas de archivos

const app = express();
const port = 3000;

app.use(cors());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Para poder leer el cuerpo de las solicitudes POST
app.use(express.json());

// Cola para simular los mensajes en espera
let messageQueue = [];

// Endpoint POST /message
app.post('/message', (req, res) => {
  const { sender, message } = req.body;

  if (!message) {
    return res.status(400).send({ error: 'El mensaje es obligatorio.' });
  }

  // Simulamos que el mensaje se agrega a la cola
  console.log('Nuevo mensaje recibido:', message);
  messageQueue.push({ sender, message });

  // procesamiento asíncrono del mensaje
  processQueue();

  // Responder al cliente que el mensaje fue recibido
  res.status(200).send({ message: 'Mensaje recibido y procesado.' });
});

// Función para simular el procesamiento de la cola
function processQueue() {
  if (messageQueue.length === 0) {
    console.log('No hay mensajes en la cola.');
    return;
  }

  //procesamiento de cada mensaje
  const currentMessage = messageQueue.shift();  // Obtener el primer mensaje de la cola

  // Aquí podrías agregar más lógica, como enviar el mensaje, procesar respuestas, etc.
  console.log('Procesando mensaje:', currentMessage);

  // Simulamos un retraso en el procesamiento (por ejemplo, 2 segundos)
  setTimeout(() => {
    console.log(`Mensaje procesado: ${currentMessage.message}`);
    processQueue();  // Llamamos recursivamente para procesar el siguiente mensaje
  }, 2000);  // 2 segundos de retraso
}

// Endpoint GET /messages para devolver la lista de mensajes
app.get('/messages', (req, res) => {
  res.status(200).send(messageQueue);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
