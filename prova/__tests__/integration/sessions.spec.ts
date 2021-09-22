import test from 'japa'
import { loggedUser } from 'Database/factories/UserFactory'
import request from 'Database/factories/request'
import execa from 'execa'

test.group('Integration Tests - Authentication', (group) => {
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

  test('Ensure invalid token cannot access private routes', async () => {
    await request.get('/users').set('Authorization', `Bearer ThisIsAnInvalidToken`).expect(401)
  })
})
