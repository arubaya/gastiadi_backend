'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChatRoomSchema extends Schema {
  up () {
    this.create('chat_rooms', (table) => {
      table.string('id', 25).notNullable().primary().unique()
      table.string('description', 255)
      table.string('status', 15)
      table.string('cs_id').references('id').inTable('users')
      table.string('user_id').references('id').inTable('users').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('chat_rooms')
  }
}

module.exports = ChatRoomSchema
