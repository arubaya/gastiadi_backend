'use strict'

/*
|--------------------------------------------------------------------------
| UserRoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserRoleSeeder {
  async run () {
    const roles = ["Admin", "Customer Service", "User", "Bot"]

    roles.forEach((data) => {
      Factory.get("user_role").table("user_roles").create({name: data})
    })
  }
}

module.exports = UserRoleSeeder
