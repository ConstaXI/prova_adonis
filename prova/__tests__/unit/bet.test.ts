import test from 'japa'
import execa from 'execa'
import CreateBetService from 'App/Services/Bet/CreateBetService'
import { GameFactory } from 'Database/factories/GameFactory'
import { UserFactory } from 'Database/factories/UserFactory'

test.group('Unit Tests - Bets', (group) => {
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

  test('CreateBetService', async (assert) => {
    const game = await GameFactory.create()

    const user = await UserFactory.create()

    const bet = await CreateBetService.execute({
      game_id: game.id,
      user_id: user.id,
      numbers: Array.from({ length: game.max_number }, (_, i) => i + 1),
      price: game.price,
    })

    assert.hasAllKeys(bet.$attributes, [
      'id',
      'game_id',
      'user_id',
      'numbers',
      'price',
      'updatedAt',
      'createdAt',
    ])
    assert.lengthOf(bet.numbers, game.max_number)
  })
})
