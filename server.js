const express = require('express');
const socket = require('socket.io');

const app = express();

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('New client! His id is ' + socket.id);
  
  socket.emit('updateData', tasks);

  socket.on('addTask', newTask => {
    tasks.push(newTask);
    socket.broadcast.emit('addTask', newTask);
    console.log('Task array:', tasks);
    console.log('New task:' , newTask ,' from ' + socket.id);
  });

  socket.on('removeTask', id => {
    console.log('Please remove ' + id);
    tasks.splice(id, 1);
    socket.broadcast.emit('removeTask', id);
    console.log('Task array:', tasks);
  })
});