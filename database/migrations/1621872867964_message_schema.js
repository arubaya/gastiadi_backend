'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.increments()
      table.string('chat_room_id').references('id').inTable('chat_rooms').notNullable().onDelete('cascade')
      table.string('user_id').references('id').inTable('users').notNullable()
      table.string('message', 500).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessageSchema
