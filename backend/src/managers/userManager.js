// import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager.js";
export class UserManager {
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  addUser(name, socket) {
    this.users.push({
      name, socket
    })
    this.queue.push(socket.id);
    this.createSpace();
    this.initHandler(socket);
  }

  removeUser(socketId) {
    this.users = this.users.filter(user => user.socket.id !== socketId);
    this.queue = this.queue.filter(x => x === socketId);
  }

  createSpace() {
    if(this.users.length < 2) {
      return;
    }

    const id1 = this.queue.pop();
    const id2 = this.queue.pop();

    const user1 = this.users.find((user) => user.socket.id === id1);
    const user2 = this.users.find((user) => user.socket.id === id2);

    if(!user1 || !user2) {
      return
    }
    this.roomManager.addRoom(user1, user2);
  }


  initHandler(socket) {

    socket.on('offer', ({ sdp, roomId }) => {
      this.roomManager.onOffer(sdp, roomId)
    });

    socket.on('answer', ({ sdp, roomId }) => {
      this.roomManager.onAnswer(sdp, roomId)
    });

    socket.on('add-ice-candidate', ({ candidate, roomId, type }) => {
      this.roomManager.onIceCandidates(candidate, roomId, type, socket.id);
    });
  }
}