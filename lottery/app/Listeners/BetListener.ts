import Mail from '@ioc:Adonis/Addons/Mail'
import { EventsList } from '@ioc:Adonis/Core/Event'

export default class BetListener {
  public async onNewBet(bet: EventsList['new:bet']) {
    await Mail.sendLater((message) => {
      message
        .to(bet.email)
        .from('davi@adonisjs.com', 'Davi Banfi')
        .subject('Nova aposta')
        .htmlView('emails/new_bet', {
          numbers: bet.numbers.toString(),
          name: bet.name,
          surname: bet.surname,
        })
    })
  }
}
