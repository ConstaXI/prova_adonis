import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.findByOrFail('email', email)

    const token = await auth.attempt(email, password, {
      expires_at: DateTime.now().plus({ minutes: 30 }),
    })

    return response.status(200).send({ user, token })
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
