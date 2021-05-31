'use strict'

/*
|--------------------------------------------------------------------------
| BotUserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class BotUserSeeder {
  async run () {
    await Factory.get("bot_user").table("users").create();
  }
}

module.exports = BotUserSeeder
