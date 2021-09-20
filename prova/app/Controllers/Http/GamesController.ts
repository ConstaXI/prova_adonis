import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Game from 'App/Models/Game'
import CreateGameValidator from 'App/Validators/CreateGameValidator'
import UpdateGameValidator from 'App/Validators/UpdateGameValidator'

export default class GamesController {
  public async create({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateGameValidator)

    const game = await Game.create(data)

    return response.status(201).send(game)
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const games = await Database.query().from('games').paginate(page, limit)

    return response.status(200).send(games)
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const game = await Game.findOrFail(id)

    await game.delete()

    return response.status(200).send('Game deleted')
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const data = await request.validate(UpdateGameValidator)

    const game = await Game.findOrFail(id)

    await game.merge(data).save()

    return response.status(200).send(game)
  }
}
