import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import BetValidator from '../../Validators/BetValidator'

export default class BetsController {
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const data = await request.validate(BetValidator)

      const game = await Game.findOrFail(data.game_id)

      data.numbers.forEach((number) => {
        if (number > game.range) return response.status(400).send('Error message')
      })

      if (data.numbers.length !== new Set(data.numbers).size) {
        return response.status(403).send({ error: 'Existem números repetidos na sua aposta.' })
      }

      if (data.numbers.length !== game.max_number) {
        return response
          .status(403)
          .send({ error: 'A quantidade de números apostados não está correta' })
      }

      const bet = await Bet.create({ ...data, price: game.price, user_id: auth.user?.id })

      await Mail.sendLater((message) => {
        message
          .to(auth.user!.email)
          .from('davi@adonisjs.com', 'Davi Banfi')
          .subject('Nova aposta')
          .htmlView('emails/new_bet', {
            numbers: bet.numbers.toString(),
            name: auth.user!.name,
            surname: auth.user!.surname,
            link: 'https://www.google.com.br',
          })
      })

      return response.status(200).send(bet)
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async index({ auth, response }: HttpContextContract) {
    try {
      const bets = await Bet.query().where('user_id', auth.user!.id)

      const formattedBets = bets.map((bet) => {
        return {
          ...bet.$attributes,
          numbers: (bet.numbers = Array.from(bet.numbers).filter(Number)),
        }
      })

      return response.status(200).send(formattedBets)
    } catch (error) {
      return response.badRequest(error.message)
    }
  }
}
