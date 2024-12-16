// Importar las dependencias
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(cors());

// procesar los datos en formato JSON
app.use(express.json());

// Cola para simular los mensajes en espera
let messageQueue = [];

// Endpoint POST /message
app.post('/message', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ error: 'El mensaje es obligatorio.' });
  }

  // Simulamos que el mensaje se agrega a la cola
  console.log('Nuevo mensaje recibido:', message);
  messageQueue.push(message);
  
  // Simulamos el procesamiento asíncrono del mensaje
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

  // Simulamos el procesamiento de cada mensaje
  const currentMessage = messageQueue.shift();  // Obtener el primer mensaje de la cola

  // Aquí podrías agregar más lógica, como enviar el mensaje, procesar respuestas, etc.
  console.log('Procesando mensaje:', currentMessage);

  // Simulamos un retraso en el procesamiento (por ejemplo, 2 segundos)
  setTimeout(() => {
    console.log(`Mensaje procesado: ${currentMessage}`);
    processQueue();  // Llamamos recursivamente para procesar el siguiente mensaje
  }, 2000);  // 2 segundos de retraso
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
