import User from 'App/Models/User'
import KafkaProduceService from 'App/Services/Kafka/KafkaProduceService'

class SendEmail {
  public async execute() {
    const admins = await User.query().preload('role', (roleQuery) => {
      roleQuery.where('user_type', 'administrator')
    })

    await Promise.all(
      admins.map(async (admin) => {
        await KafkaProduceService.execute({
          topic: 'handle email',
          messages: [{ value: admin.email }],
        })
      })
    )
  }
}

export default new SendEmail()
