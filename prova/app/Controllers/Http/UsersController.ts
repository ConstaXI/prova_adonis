import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class UsersControlersController {
  public async create({ request, response }: HttpContextContract) {
    const data = request.body()

    const trx = await Database.transaction()

    try {
      const user = await User.create({ ...data.user }, trx)
      await user.related('role').create({ user_type: data.user_type })

      trx.commit()

      return response.status(201).send({ user })
    } catch (err) {
      trx.rollback()
      return response.badRequest('Algo deu errado')
    }
  }
}
