import test from 'japa'
import supertest from 'supertest'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Games', () => {
  test('Ensure only an admin can create a game', async () => {
    const userResponse = await supertest(BASE_URL)
      .post('/users')
      .send({
        user: {
          name: 'Davi',
          surname: 'Banfi',
          email: 'admin@email.com',
          password: '123456',
          password_confirmation: '123456',
        },
        user_type: 'player',
      })
      .expect(201)

    await Database.query()
      .from('roles')
      .where('user_id', userResponse.body.id)
      .update({ user_type: 'administrator' })

    const loginResponse = await supertest(BASE_URL)
      .post('/login')
      .send({ email: 'davi@email.com', password: '123456' })

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
})
