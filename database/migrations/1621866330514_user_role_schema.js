'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserRoleSchema extends Schema {
  up () {
    this.create('user_roles', (table) => {
      table.increments()
      table.string('name', 25).unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_roles')
  }
}

module.exports = UserRoleSchema
