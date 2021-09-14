import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import GameValidator from '../../Validators/GameValidator';

export default class GamesController {
  public async create({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(GameValidator)

      const game = Game.create(data)

      return response.status(200).send(game)
    } catch (error) {
      return response.badRequest(error.message)
    }
  }
}
