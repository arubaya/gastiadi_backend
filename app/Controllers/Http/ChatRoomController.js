'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ChatRoom = use("App/Models/ChatRoom");
const User = use("App/Models/User");
const Chance = use('chance')
const Database = use('Database')
const { validate } = use("Validator");

/**
 * Resourceful controller for interacting with chatrooms
 */
class ChatRoomController {
  /**
   * Function for create random unique id.
   */
   async idGenerator () {
    let notUnique = true;
    const chance = new Chance();
    do {
      const id = chance.string({ length: 20, alpha: true, numeric: true })
      const data = await User.findBy('id', id)
      if (data) {
        notUnique = true;
      } else {
        notUnique = false;
        return id;
      }
    } while(notUnique);
  }
  /**
   * Show a list of all chat room.
   * DEVELOPMENT ONLY
   */
  async devIndex ({ request, response }) {
    const resData = await ChatRoom.all();
    return response.status(200).json(resData);
  }



  /**
   * Create/save a new chat room for general user only.
   * if there is exist, will return room id.
   * POST method
   */
   async storeNewRoom ({ request, response }) {
    const req = request.all();
    const rules = {
      location_id: "required|integer",
      user_id: "required|string",
    };

    const validation = await validate(req, rules);

    if (validation.fails()) {
      return response.status(400).json({
        message: validation.messages(),
      });
    }

    const cs = await User.findBy('cs_region_id', req.location_id);

    if (cs) {
      const checkRoom = await ChatRoom
                              .query()
                              .where('user_id', req.user_id)
                              .where('cs_id', cs.id)
                              .fetch();
      
      if (checkRoom.rows.length > 0) {
        return response.status(201).json({data: checkRoom});
      } else {
        const id = await this.idGenerator();

        const chatRoom = new ChatRoom();
        chatRoom.id = `room:${id}`;
        chatRoom.status = "active";
        chatRoom.cs_id = `${cs.id}`;
        chatRoom.user_id = `${req.user_id}`;
        await chatRoom.save();

        const roomData = await ChatRoom.findBy('id', `room:${id}`);
        const resData = {
          code: 201,
          message: "Chat room has been created successfully",
          data: roomData,
        };

        return response.status(201).json(resData);
      }
    } else {
      const resData = {
        code: 200,
        message: "User name does'nt exist.",
      };
      return response.status(200).json(resData);
    }
  }

  /**
   * Get chat room by user id and status active.
   * if there is exist, will return room id.
   * POST method
   */
   async checkRoomActive ({ request, response }) {
    const req = request.all();
    
    const result = await ChatRoom
                      .query()
                      .select('chat_rooms.id', 'chat_rooms.cs_id', 'users.name', 'chat_rooms.status')
                      .where('user_id', req.user_id)
                      .where('status', 'active')
                      .innerJoin('users', 'chat_rooms.cs_id', 'users.id')
                      .fetch()

    if (result) {
      return response.status(200).json({data: result});
    }
  }

  /**
   * Get a single chatroom detail.
   * GET chatrooms/:id
   */
  async getRoomDetails ({ params, response}) {
    const id = params.id;

    const result = await ChatRoom.findBy('id', id);
    // const result = await ChatRoom
    //                     .query()
    //                     .select('chat_rooms.id', 'users.name', 'chat_rooms.cs_id')
    //                     .innerJoin('id', id);
    
    if(result) {
      return response.status(200).json({data: result});
    } else {
      return response.status(200).json({message: 'Room id not found'});
    }
  }

  /**
   * Get all chatroom list. Return id and user_name.
   * GET chatrooms/
   */
   async getAllRooms ({ response}) {
    const result = await ChatRoom.query().select('chat_rooms.id', 'users.name')
    .innerJoin('users', 'chat_rooms.user_id', 'users.id')
    .fetch();
    
    if(result) {
      return response.status(200).json({data: result});
    } else {
      return response.status(200).json({message: 'Room id not found'});
    }
  }

  /**
   * Get all chatroom list. Return id and user_name.
   * GET chatrooms/
   */
  async updateChatRoomStatus ({ request, response }) {
    const req = request.all()
    await ChatRoom.query().where('id', req.room_id)
    .update({status: 'done'});
    
    return response.status(200).json({message: 'Updated'});
  }

}

module.exports = ChatRoomController
