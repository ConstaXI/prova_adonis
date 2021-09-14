import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Game from './Game'
import User from './User'

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public numbers: number[]

  @column()
  public price: number

  @column()
  public game_id: string

  @column()
  public user_id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Game)
  game: HasOne<typeof Game>

  @hasOne(() => User)
  user: HasOne<typeof User>

  @beforeCreate()
  public static async geneterateUuid(bet: Bet) {
    bet.id = uuidv4()
  }
}
