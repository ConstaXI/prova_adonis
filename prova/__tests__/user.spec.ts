import test from 'japa'
import User from 'App/Models/User'

test.group('Welcome', () => {
  test('ensure user password gets hashed during save', async (assert) => {
    const user = new User()
    user.name = 'Davi'
    user.surname = 'Banfi'
    user.email = 'davi@email.com'
    user.password = '123456'
    await user.save()

    assert.notEqual(user.password, '123456')
  })
})
