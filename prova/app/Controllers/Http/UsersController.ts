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

      return response.status(201).send(user)
    } catch (error) {
      return response.badRequest(error.message ? error.message : error.messages)
    }
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await Database.query().from('users').paginate(page, limit)

    return response.status(200).send(users)
  }

  public async delete({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      return response.badRequest('Você não está logado')
    }

    auth.user.delete()
  }

  public async update({ auth, request, response }: HttpContextContract) {
    try {
      if (!auth.user) {
        return response.badRequest('Você não está logado')
      }

      const data = await request.validate(UpdateUserValidator)

      await auth.user.merge(data).save()

      return response.status(200).send(auth.user)
    } catch (error) {
      return response.badRequest(error.message ? error.message : error.messages)
    }
  }
}
