import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Bet from './Bet'
import { v4 as uuidv4 } from 'uuid';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public surname: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Role, {foreignKey: 'user_id'})
  public role: HasOne<typeof Role>

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async geneterateUuid(role: Role) {
    role.id = uuidv4()
  }
}
