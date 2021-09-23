import { Kafka, Producer, Message } from 'kafkajs'
import { Exception } from '@poppinss/utils'

interface ProducerProps {
  topic: string
  messages: Message[]
}

class KafkaProduceService {
  private producer: Producer

  constructor() {
    const kafka = new Kafka({
      clientId: 'prova',
      brokers: ['localhost:9092'],
    })

    this.producer = kafka.producer()
  }

  public async execute({ topic, messages }: ProducerProps) {
    await this.producer.connect()

    if (messages.length || topic.trim().length)
      throw new Exception('The messages or the topic cannot be empty', 500)

    await this.producer.send({
      topic,
      messages,
    })

    await this.producer.disconnect()

    return true
  }
}

export default new KafkaProduceService()
