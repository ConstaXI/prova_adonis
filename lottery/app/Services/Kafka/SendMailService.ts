import ProducerService from 'App/Services/Kafka/ProducerService'
import Database from '@ioc:Adonis/Lucid/Database'

class SendMail {
  public async execute() {
    // todo: I need to query only admins
    const admins = await Database.rawQuery(
      `select users.*, roles.user_type from users, roles where users.id = roles.user_id and roles.user_type = 'administrator';`
    )

    await Promise.all(
      admins.rows.map(async (admin) => {
        await ProducerService.execute('new-bet-handler', [{ value: admin.email }])
      })
    )
  }
}

export default new SendMail()
