import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import Event from '@ioc:Adonis/Core/Event'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(CreateUserValidator)

      const user = await User.create(data.user)
      await user.related('role').create({ user_type: data.user_type })

      await Event.emit('new:user', {
        email: user.email,
        name: user.name,
        created_at: user.createdAt,
      })

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

    return response.status(200).send('UserListener deleted')
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params()
      const data = await request.validate(UpdateUserValidator)

      const user = await User.findOrFail(id)

      await user.merge(data).save()

      return response.status(200).send(user)
    } catch (error) {
      return response.badRequest(error.message)
    }
  }
}
