import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersControlersController {
  public async create({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UserValidator)

      const user = await User.create(data.user)
      await user.related('role').create({ user_type: data.user_type })

      return response.status(201).send({ user })
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await Database.query().from('users').paginate(page, limit)

    return response.status(200).send(users)
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findOrFail(id)

    await user.delete()

    return response.status(200).send('User deleted')
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const data = request.body()

    const user = await User.findOrFail(id)

    await user.merge(data).save()

    return response.status(200).send(user)
  }
}
