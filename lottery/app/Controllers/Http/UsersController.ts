import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import Event from '@ioc:Adonis/Core/Event'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import CreateUserService from 'App/Services/User/CreateUserService'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)

    const user = await CreateUserService.execute(data)

    await Event.emit('new:user', {
      email: user.email,
      name: user.name,
      created_at: user.createdAt,
    })

    return response.status(201).send(user)
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await Database.query().from('users').paginate(page, limit)

    return response.status(200).send(users)
  }

  public async delete({ auth, response }: HttpContextContract) {
    await auth.authenticate()

    await auth.user!.delete()

    return response.status(200).send('Conta deletada.')
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.authenticate()

    const data = await request.validate(UpdateUserValidator)

    await auth.user!.merge(data).save()

    return response.status(200).send(auth.user)
  }
}
