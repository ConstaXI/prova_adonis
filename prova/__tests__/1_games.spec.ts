import test from 'japa'
import supertest from 'supertest'
import Database from '@ioc:Adonis/Lucid/Database'
import Game from 'App/Models/Game'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Games', () => {
  test('Ensure only an admin can create a game', async () => {
    const user = await User.firstOrFail()

    await Database.query()
      .from('roles')
      .where('user_id', user.id)
      .update({ user_type: 'administrator' })

    const loginResponse = await supertest(BASE_URL)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' })

    await supertest(BASE_URL)
      .post('/games')
      .set('Authorization', `Bearer ${loginResponse.body.token.token}`)
      .send({
        type: 'Mega Sena',
        description:
          'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
        range: 60,
        price: 2.5,
        max_number: 6,
        color: '01AC66',
      })
      .expect(201)
  })

  test('Ensure games can be updated', async (assert) => {
    const loginResponse = await supertest(BASE_URL)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' })

    const game = await Game.firstOrFail()

    const response = await supertest(BASE_URL)
      .put(`/games/${game.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token.token}`)
      .send({
        type: 'Mega Sena Modificado',
      })
      .expect(200)

    assert.equal(response.body.type, 'Mega Sena Modificado')
  })

  test('Ensure admin can list games', async (assert) => {
    const loginResponse = await supertest(BASE_URL)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' })

    const response = await supertest(BASE_URL)
      .get('/games')
      .set('Authorization', `Bearer ${loginResponse.body.token.token}`)

    assert.isAbove(response.body.data.length, 0)
  })

  test('Ensure admin can delete a game', async () => {
    const loginResponse = await supertest(BASE_URL)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' })

    const game = await Game.firstOrFail()

    await supertest(BASE_URL)
      .delete(`/games/${game.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token.token}`)
      .expect(200)
  })
})
