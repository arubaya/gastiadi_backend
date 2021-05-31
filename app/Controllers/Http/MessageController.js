'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Message = use('App/Models/Message')

/**
 * Resourceful controller for interacting with messages
 */
class MessageController {
  /**
   * Get all messages by room id
   * GET messages/room/:id
   */
  async getMessagesByRoomId ({ response, params }) {
    const id = params.id;

    const result = await Message
    .query()
    .select('messages.user_id', 'users.name', 'messages.message')
    .where('chat_room_id', id)
    .innerJoin('users', 'messages.user_id', 'users.id')
    .fetch();
    
    if(result) {
      return response.status(200).json({data: result});
    } else {
      return response.status(200).json({message: 'Room id not found'});
    }
  }

}

module.exports = MessageController
