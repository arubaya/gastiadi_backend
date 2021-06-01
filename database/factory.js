'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('bot_user', async (faker) => {
  return {
    id: `${faker.string({ length: 20, alpha: true, numeric: true })}`,
    name: "Gastiadi",
    email: "bot@bot.com",
    password: await Hash.make("bot_user"),
    role_id: 4,
  }
})

Factory.blueprint('fake_user', async (faker) => {
  return {
    id: faker.string({ length: 20, alpha: true, numeric: true }),
    name: faker.name(),
    email: faker.email(),
    password: await Hash.make(faker.password()),
    role_id: 3,
  }
})

Factory.blueprint('fake_customer_service', async (faker) => {
  return {
    id: faker.string({ length: 20, alpha: true, numeric: true }),
    name: faker.name(),
    email: faker.email(),
    password: await Hash.make(faker.password()),
    role_id: 2,
  }
})

Factory.blueprint('user_role', async (faker, i, data) => {
  return {
    name: data.name,
  }
})

Factory.blueprint('region', async (faker, i, data) => {
  return {
    name: data.name,
  }
})
