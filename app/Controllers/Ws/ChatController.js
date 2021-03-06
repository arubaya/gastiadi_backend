"use strict";
const Message = use("App/Models/Message");
const ChatRoom = use("App/Models/ChatRoom");

const botMessages = [
  'Halo, selamat datang di Gastiadi. Ada yang bisa kami bantu?',
  'Dimana lokasi kejadian itu?',
  'Bisakah Anda menceritakan kronologinya?',
  'Bisakah Anda memberitahu kondisi terkini dari korban?',
  'Apakah korban sudah mendapatkan pertolongan pertama?',
  'Apakah Anda mengenal korban?',
  'Bisakah Anda memberikan identitas dan alamat korban?',
  'Ada lagi yang bisa kami bantu?',
]

const chatRoom = [];

class ChatController {
  constructor({ socket, request, response }) {
    this.socket = socket;
    this.request = request;
    console.log("user joined with %s socket id", socket.id);
    socket.emit('message', {
      event: 'message', 
      data: {
        message: `user joined with ${socket.id} socket id`
      }
    })

  }

  async onInit_chat(data) {
    const result = await ChatRoom
    .query()
    .select('chat_rooms.id', 'users.name', 'chat_rooms.status')
    .where('cs_id', data.id)
    .innerJoin('users', 'chat_rooms.user_id', 'users.id')
    .fetch()

    this.socket.broadcastToAll('init_chat', result)
  }

  async onJoin_room(data) {
    const messageList = await Message
    .query()
    .select('messages.user_id', 'users.name', 'messages.message', 'messages.created_at')
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
          return noSameRoomId
        } else {
          noSameRoomId = true;
          return noSameRoomId
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

    const messageList = await Message
    .query()
    .select('messages.user_id', 'users.name', 'messages.message', 'messages.created_at')
    .innerJoin('users', 'messages.user_id', 'users.id')
    .where('chat_room_id', data.room_id)
    .fetch();

    this.socket.emitTo('messages', messageList, user_sockets);
    // this.socket.emitTo("message", {name: data.name, message: data.message}, user_sockets);
  }

  onMessage(message) {
    console.log(message)
    this.socket.broadcastToAll('message', {
        message: `Terusan dari server ${message.body}`
      }
     )
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
