export class UserManager {
  constructor() {
    this.user = [];
  }


  addUser(name, socket) {
    this.user.push({
      name, socket
    })
  }

  removeUser(socketId) {
    this.user = this.user.filter(user => user.socket.id !== socketId);
  }
}