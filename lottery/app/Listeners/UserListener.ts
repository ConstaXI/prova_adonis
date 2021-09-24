import { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class UserListener {
  public async onNewUser(user: EventsList['new:user']) {
    await Mail.sendLater((message) => {
      message
        .to(user.email)
        .from('prova@adonisjs.com', 'Davi Banfi')
        .subject('Criação de conta')
        .htmlView('emails/create_account', {
          email: user.email,
          name: user.name,
        })
    })
  }
}
