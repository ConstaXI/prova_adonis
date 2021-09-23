import Factory from '@ioc:Adonis/Lucid/Factory'
import Game from 'App/Models/Game'

export const GameFactory = Factory.define(Game, ({ faker }) => {
  return {
    type: faker.datatype.string(20),
    description: faker.lorem.paragraph(),
    range: faker.datatype.number({ max: 100, min: 25 }),
    price: faker.datatype.number({ max: 10, min: 2.5 }),
    max_number: faker.datatype.number({ max: 8, min: 6 }),
    color: '000000',
  }
}).build()
