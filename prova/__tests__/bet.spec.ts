import test from 'japa'
import { GameFactory } from 'Database/factories/GameFactory'
import { loggedUser } from 'Database/factories/UserFactory'
import request from 'Database/factories/request'
import faker from 'faker'
import execa from 'execa'

test.group('Bets', async (group) => {
  group.before(async () => {
    await execa.node('ace', ['migration:run'], {
      stdio: 'inherit',
    })
  })

  group.after(async () => {
    await execa.node('ace', ['migration:rollback'], {
      stdio: 'inherit',
    })
  })

  const game = await GameFactory.create()

  const token = await loggedUser({ user_type: 'player' })

  test('Ensure bet can be created', async (assert) => {
    const numbers = Array.from({ length: game.max_number }, () =>
      faker.datatype.number({ max: game.range, min: 1 })
    )

    const response = await request
      .post('/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_id: game.id,
        numbers: numbers,
      })
      .expect(201)

    assert.lengthOf(response.body.numbers, game.max_number)
  })

  test('Ensure bet cannot be created with repeated numbers', async () => {
    const numbers = Array.from({ length: game.max_number }, () => 1)

    await request
      .post('/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_id: game.id,
        numbers: numbers,
      })
      .expect(422)
  })

  test('Ensure bet cannot be created with less numbers than max_number', async () => {
    const numbers = Array.from({ length: game.max_number - 1 }, () =>
      faker.datatype.number({ max: game.range, min: 1 })
    )

    await request
      .post('/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_id: game.id,
        numbers: numbers,
      })
      .expect(422)
  })

  test('Ensure bet cannot be created with more numbers than max_number', async () => {
    const numbers = Array.from({ length: game.max_number + 1 }, () =>
      faker.datatype.number({ max: game.range, min: 1 })
    )

    await request
      .post('/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_id: game.id,
        numbers: numbers,
      })
      .expect(422)
  })
})
