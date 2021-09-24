import { Kafka, Message, Producer } from 'kafkajs'

class ProducerService {
  private producer: Producer

  constructor() {
    const kafka = new Kafka({
      brokers: ['localhost:9092'],
    })

    this.producer = kafka.producer()
  }

  public async execute(topic: string, messages: Message[]) {
    await this.producer.connect()
    await this.producer.send({
      topic,
      messages,
    })
    await this.producer.disconnect()
  }
}

export default new ProducerService()
