const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const tf = require('@tensorflow/tfjs-node');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('frame', async (data) => {
    const buffer = Buffer.from(data.split(',')[1], 'base64');
    const interpretedText = await interpretSignLanguage(buffer);
    socket.emit('translated', { text: interpretedText });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

let model;

// Load the TensorFlow.js model
(async () => {
  model = await tf.loadLayersModel('file://tfjs_model/model.json');
})();

// Function to preprocess the input
function preprocessInput(imageBuffer) {
  const image = tf.node.decodeImage(imageBuffer, 3);
  const resizedImage = tf.image.resizeBilinear(image, [64, 64]);
  const normalizedImage = resizedImage.div(tf.scalar(255));
  return normalizedImage.expandDims(0);
}

// Function to interpret sign language
async function interpretSignLanguage(imageBuffer) {
  if (!model) {
    throw new Error('Model not loaded');
  }
  const input = preprocessInput(imageBuffer);
  const prediction = model.predict(input);
  const predictedClass = prediction.argMax(-1).dataSync()[0];
  return predictedClass;  // Map this to your class names
}
