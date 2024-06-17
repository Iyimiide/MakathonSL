const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const streamRouter = require('./routes/stream');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/stream', streamRouter);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('frame', async (data) => {
    const interpretedText = await interpretSignLanguage(data);
    socket.emit('translated', { text: interpretedText });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Placeholder function for sign language interpretation
async function interpretSignLanguage(data) {
  // Implement your image processing and machine learning logic here
  return "Interpreted English text";
}
