import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

enum UserType {
  player,
  admin
}

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_type: UserType
}
