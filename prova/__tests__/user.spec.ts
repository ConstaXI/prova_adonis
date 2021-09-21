import test from 'japa'
import { loggedUser } from 'Database/factories/UserFactory'
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

  test('Ensure admin cannot be created by player', async () => {
    const token = await loggedUser({ user_type: 'player' })

    await request
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user: {
          name: 'Davi',
          surname: 'Banfi',
          email: 'ICannotBeCreated@email.com',
          password: '123456',
          password_confirmation: '123456',
        },
        user_type: 'administrator',
      })
      .expect(403)
  })

  test('Ensure admin can be created by admin', async () => {
    const token = await loggedUser({ user_type: 'administrator' })

    await request
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user: {
          name: 'Davi',
          surname: 'Banfi',
          email: 'IShouldBeCreated@email.com',
          password: '123456',
          password_confirmation: '123456',
        },
        user_type: 'administrator',
      })
      .expect(201)
  })
})
