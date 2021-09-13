import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Roles extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.enum('user_type', ['player', 'admin']).notNullable()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique().notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
