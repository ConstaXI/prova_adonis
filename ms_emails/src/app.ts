import express from 'express'
import ConsumerService from './services/ConsumerService'

const app = express();

app.use(express.json());

const consumer = new ConsumerService({ groupId: 'mail-group' });

consumer.consume({ topic: 'new-bet-handler', fromBeginning: true }).then(() => console.log('Consumer ready.'))

export default app
