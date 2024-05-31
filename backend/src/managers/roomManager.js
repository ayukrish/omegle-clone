let GLOBAL_ROOM_ID = 0;

export class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  addRoom(user1, user2) {
    const roomId = this.generate().toString();
    this.rooms.set(roomId, {
      user1,
      user2
    });
    user1.socket.emit("send-offer", {
      roomId
    });

    user2.socket.emit("send-offer", {
      roomId
    });
  }



  onIceCandidates(candidate, roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room) {
        return;
    }
    const receivingUser = room.user1.socket.id === socketId ? room.user2: room.user1;
    console.log(receivingUser, 'receivingUser');
    receivingUser.socket.emit("add-ice-candidate", ({ candidate }));
  }

  onOffer(sdp, roomId) {
    const room = this.rooms.get(roomId);
    const otherUser = room.user1.socket.id === senderSocketid ? room.user2: room.user1;
    otherUser?.socket.emit("receive-offer", {
      sdp,
      roomId
    })
  }


  generate() {
    return GLOBAL_ROOM_ID++;
  }
}