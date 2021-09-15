import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  beforeCreate,
  afterCreate,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Bet from './Bet'
import { v4 as uuidv4 } from 'uuid'
import Event from '@ioc:Adonis/Core/Event'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public surname: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Role, { foreignKey: 'user_id' })
  public role: HasOne<typeof Role>

  @hasMany(() => Bet, { foreignKey: 'user_id' })
  public bets: HasMany<typeof Bet>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async generateUuid(user: User) {
    user.id = uuidv4()
  }

  @afterCreate()
  public static async onNewUser(user: User) {
    await Event.emit('new:user', { email: user.email, name: user.name, created_at: user.createdAt })
  }
}
