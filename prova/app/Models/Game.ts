import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Bet from './Bet'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public escription: string

  @column()
  public range: number

  @column()
  public price: number

  @column()
  public max_number: number

  @column()
  public color: string

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
