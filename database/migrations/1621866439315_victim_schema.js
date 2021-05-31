'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VictimSchema extends Schema {
  up () {
    this.create('victims', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('victims')
  }
}

module.exports = VictimSchema
