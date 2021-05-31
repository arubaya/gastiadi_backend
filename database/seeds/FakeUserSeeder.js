'use strict'

/*
|--------------------------------------------------------------------------
| FakeUserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class FakeUserSeeder {
  async run () {
    await Factory.get("fake_user").table("users").createMany(4);
  }
}

module.exports = FakeUserSeeder
