import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import BetValidator from '../../Validators/BetValidator'
import Event from '@ioc:Adonis/Core/Event'

export default class BetsController {
  public async create({ auth, request, response }: HttpContextContract) {
    const gameId = request.input('game_id')

    const game = await Game.findOrFail(gameId)

    const data = await request.validate(new BetValidator(game.range, game.max_number))

    // todo: tratamento de erros dentro do controller, o certo seria levantar uma exception para ser tratada no handler
    if (data.numbers.length !== new Set(data.numbers).size)
      return response.badRequest('Existem números repetidos na sua aposta.')

    const bet = await Bet.create({ ...data, price: game.price, user_id: auth.user!.id })

    await Event.emit('new:bet', {
      name: auth.user!.name,
      surname: auth.user!.surname,
      numbers: data.numbers,
      email: auth.user!.email,
    })

    return response.status(201).send(bet)
  }

  public async index({ auth, response }: HttpContextContract) {
    const bets = await Bet.query().where('user_id', auth.user!.id)

    const formattedBets = bets.map((bet) => {
      return {
        ...bet.$attributes,
        numbers: Array.from(bet.numbers).filter(Number),
      }
    })

    return response.status(200).send(formattedBets)
  }

  public async delete({ request, response }) {
    const { id } = request.params()

    const bet = await Bet.findOrFail(id)

    await bet.delete()

    return response.status(200).send('A aposta foi deletada com sucesso.')
  }
}
