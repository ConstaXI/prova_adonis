import User from 'App/Models/User'

interface CreateUserDTO {
  user: {
    name: string
    surname: string
    email: string
    password: string
  }
  user_type: string
}

class UserService {
  public async execute(data: CreateUserDTO): Promise<User> {
    const user = await User.create(data.user)
    await user.related('role').create({ user_type: data.user_type })
    await user.load('role')

    return user
  }
}

export default new UserService()
