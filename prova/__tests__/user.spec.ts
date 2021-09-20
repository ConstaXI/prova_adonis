import test from 'japa'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Sessions', () => {
  test('Ensure user login', async (assert) => {
    const user = await User.create({
      name: 'Davi',
      surname: 'Banfi',
      email: 'davi@email.com',
      password: '123456',
    })

    assert.notEqual(user.password, '123456')

    await supertest(BASE_URL)
      .post('/login')
      .send({ email: user.email, password: '123456' })
      .expect(200)
  })
})
