import Bet from 'App/Models/Bet'
import SendMailService from "App/Services/Kafka/SendMailService";

interface CreateBetDTO {
  numbers: number[]
  game_id: string
  user_id: string
  price: number
}

class CreateBetService {
  public async execute(data: CreateBetDTO): Promise<Bet> {
    await SendMailService.execute()

    return Bet.create(data)
  }
}

export default new CreateBetService()
