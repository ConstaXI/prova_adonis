import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class ForgotPasswordsController {
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      const token = await auth.login(user, {
        expires_at: DateTime.now().plus({ minutes: 30 }),
      })

      user.rememberMeToken = token.tokenHash

      await user.save()

      await Mail.sendLater((message) => {
        message
          .to(user.email)
          .from('davi@adonisjs.com', 'Davi Banfi')
          .subject('Recuperação de senha')
          .htmlView('emails/forgot_password', {
            name: user.name,
            surname: user.surname,
            link: 'https://www.google.com.br',
          })
      })
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const { password } = request.all()
      const { token } = request.params()

      const user = await User.findByOrFail('remember_me_token', token)

      const tokenModel = await Database.query()
        .select('expires_at')
        .from('api_tokens')
        .where('token', token)

      const expiresAt = DateTime.fromSQL(tokenModel[0].expires_at)

      const isExpired = DateTime.now() > expiresAt.plus({ minutes: 30 })

      if (isExpired) {
        return response.status(401).send({ error: 'Token expirado' })
      }

      user.rememberMeToken = null
      user.password = password

      await auth.logout()

      await user.save()
    } catch (error) {
      return response.badRequest(error.message)
    }
  }
}
