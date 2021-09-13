import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';

enum UserType {
  player,
  admin
}

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_type: UserType

  @beforeCreate()
  public static async geneterateUuid(role: Role) {
    role.id = uuidv4()
  }
}