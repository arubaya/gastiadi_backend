"use strict";
const Message = use("App/Models/Message");
const ChatRoom = use("App/Models/ChatRoom");

const chatRoom = [];

class ChatController {
  constructor({ socket, request, response }) {
    this.socket = socket;
    this.request = request;
    console.log("user joined with %s socket id", socket.id);
    socket.emit('connected', `user joined with ${socket.id} socket id`)
  }

  async onJoin_room(data) {
    const messageList = await Message
    .query()
    .select('users.name', 'messages.message')
    .innerJoin('users', 'messages.user_id', 'users.id')
    .where('chat_room_id', data.room_id)
    .fetch();

    let noSameRoomId = false;
    if(chatRoom.length < 1){
      chatRoom.push({
        room_id: data.room_id,
        sockets_id: [`${this.socket.id}`]
      });
      console.log("first room created")
    } else {
      chatRoom.forEach((room) => {
        if(room.room_id === data.room_id) {
          const sameSocket = room.sockets_id.indexOf(`${this.socket.id}`);
          if(sameSocket < 0 ) {
            room.sockets_id.push(`${this.socket.id}`);
            console.log(`${this.socket.id} join to room`)
          }
          noSameRoomId = false;
          return true;
        } else {
          noSameRoomId = true;
        }
      })
    }

    if (noSameRoomId) {
      chatRoom.push({
        room_id: data.room_id,
        sockets_id: [`${this.socket.id}`]
      });
      console.log("create another room")
    }
    console.log(chatRoom)
    this.socket.emit("init_messages", messageList);
    this.socket.emit('message', "Joined");
  }

  async onSend_message(data) {
    let user_sockets;
    chatRoom.map((room) => {
      if(room.room_id === data.room_id) {
        user_sockets = room.sockets_id;
      }
    })

    const message = new Message();
    message.chat_room_id = data.room_id;
    message.user_id = data.user_id;
    message.message = data.message;
    await message.save();

    this.socket.emitTo("message", {name: data.name, message: data.message}, user_sockets);
  }

  onClose() {
    let empty_room = false;
    let room_sockets;

    if(chatRoom.length === 0) {
      console.log(`Disconnect socket id ${this.socket.id}`);
    } 
    else {
      chatRoom.map((room, index) => {
        const room_index = room.sockets_id.indexOf(`${this.socket.id}`)
        if(room_index > -1) {
          room.sockets_id.splice(room_index, 1)
        }
        if (room.sockets_id.length === 0){
          console.log("ruangan ini kosong")
          empty_room = true;
          room_sockets = index;
        }
      })
      if(empty_room) {
        chatRoom.splice(room_sockets, 1)
      }
      console.log(`Disconnect socket id ${this.socket.id}`);
    }
    console.log(chatRoom);
  }
}

module.exports = ChatController;
