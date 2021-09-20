import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('Ensure user can be created', async (assert) => {
    const response = await supertest(BASE_URL)
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

    assert.notEqual(response.body.password, '123456')
  })
})

test.group('Sessions', () => {
  test('Ensure user can login', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' })
      .expect(200)

    assert.property(response.body.token, 'token')
  })
})
