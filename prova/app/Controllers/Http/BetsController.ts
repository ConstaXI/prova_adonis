import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import BetValidator from '../../Validators/BetValidator'

export default class BetsController {
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const data = await request.validate(BetValidator)

      const game = await Game.findOrFail(data.game_id)

      if (data.numbers.length !== game.max_number) {
        return response
          .status(403)
          .send({ error: 'A quantidade de números apostados não está correta' })
      }

      const bet = await Bet.create({ ...data, price: game.price, user_id: auth.user?.id })

      return response.status(200).send(bet)
    } catch (error) {
      return response.badRequest(error.message)
    }
  }
}
