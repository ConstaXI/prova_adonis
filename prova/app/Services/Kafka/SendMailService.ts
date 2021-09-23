import User from 'App/Models/User'
import ProducerService from 'App/Services/Kafka/ProducerService'

class SendMail {
  public async execute() {
    const admins = await User.query().preload('role', (subQuery) => {
      subQuery.where('user_type', 'administrator')
    })

    await Promise.all(
      admins.map(async (admin) => {
        await ProducerService.produce('email-handler', [{ value: admin.email }])
      })
    )
  }
}

export default new SendMail()
