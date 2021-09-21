import test from 'japa'
import { GameFactory } from 'Database/factories/GameFactory'
import { loggedUser } from 'Database/factories/UserFactory'
import request from 'Database/factories/request'

test.group('Bets', async () => {
  const game = await GameFactory.create()

  const token = await loggedUser({ user_type: 'player' })

  test('Ensure Bet can be created', async (assert) => {
    const response = await request
      .post('/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_id: game.id,
        numbers: Array.from({ length: game.max_number }, () =>
          Math.floor(Math.random() * game.range)
        ),
      })

    assert.lengthOf(response.body.numbers, game.max_number)
  })
})
