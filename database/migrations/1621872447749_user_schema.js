'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.string('id', 20).notNullable().primary()
      table.string('name', 50).notNullable()
      table.string('email', 100).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('role_id', 10).references('id').inTable('user_roles').notNullable().defaultTo(3).unsigned()
      table.integer('cs_region_id', 10).references('id').inTable('regions').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
