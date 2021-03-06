import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsAdmin {
  public async handle({ request, response, auth }: HttpContextContract, next: () => Promise<void>) {
    const userType = request.input('user_type')

    if (userType === 'administrator') {
      if (await auth.use().check()) {
        await auth.user?.load('role')

        if (auth.user?.role.user_type === 'administrator') {
          await next()
          return
        }

        return response.badRequest('Você não é administrador >:(')
      }

      return response.badRequest('Você não está logado.')
    }

    await next()
  }
}
