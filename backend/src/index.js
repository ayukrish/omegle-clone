import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from './managers/userManager';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on("connection", (socket) => {
  userManager.addUser('name', socket);
  socket.on('disconnect', () => {
    userManager.removeUser(socket.id);
  })
});

server.listen(3003, () => {
  console.log('listening to port 3003');
})