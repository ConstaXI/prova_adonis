import Factory from '@ioc:Adonis/Lucid/Factory'
import Game from 'App/Models/Game'

export const GameFactory = Factory.define(Game, ({ faker }) => {
  return {
    type: faker.internet.domainWord(),
    description: faker.lorem.paragraph(),
    range: faker.datatype.number(),
    price: faker.datatype.number(),
    max_number: faker.datatype.number(),
    color: '000000',
  }
}).build()
