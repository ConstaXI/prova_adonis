import {Kafka, Consumer} from 'kafkajs';
import sendMail from '../services/Mail';

interface IConsumer {
    groupId: string
}

interface IConsume {
    topic: string
    fromBeginning: boolean
}

export default class ConsumerService {
    private consumer: Consumer

    constructor({groupId}: IConsumer) {
        const kafka = new Kafka({
            brokers: ['localhost:9092'],
        });

        this.consumer = kafka.consumer({groupId})
    }

    public async consume({topic, fromBeginning}: IConsume) {
        await this.consumer.connect()
        await this.consumer.subscribe({topic, fromBeginning})
        await this.consumer.run({
            eachMessage: async ({message}) => {
                await sendMail(String(message.value))
            },
        })
    }
}
