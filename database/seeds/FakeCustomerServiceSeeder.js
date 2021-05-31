'use strict'

/*
|--------------------------------------------------------------------------
| FakeCustomerServiceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class FakeCustomerServiceSeeder {
  async run () {
    await Factory.get("fake_customer_service").table("users").createMany(3);
  }
}

module.exports = FakeCustomerServiceSeeder
