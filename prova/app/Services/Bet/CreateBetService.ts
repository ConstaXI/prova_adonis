import Bet from 'App/Models/Bet'

interface CreateBetDTO {
  numbers: number[]
  game_id: string
  user_id: string
  price: number
}

class CreateBetService {
  public async execute(data: CreateBetDTO): Promise<Bet> {
    return Bet.create(data)
  }
}

export default new CreateBetService()
