import ProducerService from 'App/Services/Kafka/ProducerService'
import User from 'App/Models/User'

class SendMail {
  public async execute() {
    // todo: I need to query only admins
    const admins = await User.query().preload('role', (subQuery) => {
      subQuery.where('user_type', 'administrator')
    })

    console.log(admins)

    await Promise.all(
      admins.map(async (admin) => {
        await ProducerService.execute('new-bet-handler', [{ value: admin.email }])
      })
    )
  }
}

export default new SendMail()
