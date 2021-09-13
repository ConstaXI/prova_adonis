import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async create({ request, response }: HttpContextContract) {
    const data = request.body()

    const game = Game.create(data)

    return response.status(200).send(game)
  }
}
