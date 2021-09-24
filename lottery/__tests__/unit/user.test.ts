import test from 'japa'
import CreateUserService from 'App/Services/User/CreateUserService'
import execa from 'execa'

test.group('Unit Tests - User', (group) => {
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

  test('CreateUserService', async (assert) => {
    const user = await CreateUserService.execute({
      user: {
        name: 'Davi',
        surname: 'Banfi',
        email: 'davibanfi@email.com',
        password: '123456',
      },
      user_type: 'player',
    })

    assert.hasAllKeys(user.$attributes, [
      'id',
      'name',
      'surname',
      'email',
      'password',
      'createdAt',
      'updatedAt',
      'role',
    ])
    assert.notEqual(user.password, '123456')
  })
})
