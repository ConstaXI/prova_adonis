import express from 'express'
import ConsumerService from './services/ConsumerService'

const app = express();

app.use(express.json());

const consumer = new ConsumerService({ groupId: 'email-group' });

consumer.consume({ topic: 'email-handler', fromBeginning: true }).then(() => console.log('Consumer ready.'))

export default app
