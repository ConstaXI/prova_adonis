import test from 'japa'
import { loggedUser } from 'Database/factories/UserFactory'
import request from 'Database/factories/request'
import { GameFactory } from 'Database/factories/GameFactory'

test.group('Games', async () => {
  const token = await loggedUser({ user_type: 'administrator' })

  test('Ensure game cannot be created by player', async () => {
    request
      .post('/games')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'Mega Sena',
        description:
          'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
        range: 60,
        price: 2.5,
        max_number: 6,
        color: '01AC66',
      })
      .expect(403)
  })

  test('Ensure game can be created by an admin', async () => {
    request
      .post('/games')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'Lotomania',
        description:
          'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
        range: 100,
        price: 2.5,
        max_number: 6,
        color: '01AC66',
      })
      .expect(403)
  })

  test('Ensure game can be edited by an admin', async (assert) => {
    const game = await GameFactory.create()

    const response = await request
      .put(`/games/${game.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'Modificado',
      })
      .expect(200)

    assert.equal(response.body.type, 'Modificado')
  })

  test('Ensure game can be deleted by an admin', async () => {
    const game = await GameFactory.create()

    await request.delete(`/games/${game.id}`).set('Authorization', `Bearer ${token}`).expect(200)
  })
})