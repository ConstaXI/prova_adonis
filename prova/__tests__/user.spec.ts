import test from 'japa'
import request from 'Database/factories/request'

test.group('User', () => {
  test('Ensure password will be hashed', async (assert) => {
    const response = await request
      .post('/users')
      .send({
        user: {
          name: 'Davi',
          surname: 'Banfi',
          email: 'davi@email.com',
          password: '123456',
          password_confirmation: '123456',
        },
        user_type: 'player',
      })
      .expect(201)

    assert.notEqual(response.body.password, '123456')
  })

  test('Ensure user cannot be created without password_confirmation', async () => {
    await request
      .post('/users')
      .send({
        user: {
          name: 'Davi',
          surname: 'Banfi',
          email: 'davi@email.com',
          password: '123456',
          password_confirmation: '',
        },
        user_type: 'player',
      })
      .expect(422)
  })
})
