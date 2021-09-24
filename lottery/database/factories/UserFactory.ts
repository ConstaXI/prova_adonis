import Factory from '@ioc:Adonis/Lucid/Factory'
import request from 'Database/factories/request'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import faker from 'faker'

interface Props {
  name?: string
  surname?: string
  email?: string
  user_type: 'administrator' | 'player'
}

const RoleFactory = Factory.define(Role, () => {
  return {
    user_type: 'player',
  }
})
  .state('administrator', (role) => (role.user_type = 'administrator'))
  .state('player', (role) => (role.user_type = 'player'))
  .build()

export const UserFactory = Factory.define(User, () => {
  return {
    name: faker.name.findName(),
    surname: faker.name.findName(),
    email: faker.internet.email(),
    password: '123456',
  }
})
  .relation('role', () => RoleFactory)
  .build()

export const loggedUser = async ({ name, surname, email, user_type }: Props) => {
  const user = await UserFactory.merge({
    name: name || faker.name.findName(),
    surname: surname || faker.name.findName(),
    email: email || faker.internet.email(),
  })
    .with('role', 1, (role) => role.apply(user_type))
    .create()

  const { body: loginResponse } = await request
    .post('/login')
    .send({ email: user.email, password: '123456' })

  return loginResponse.token.token
}
