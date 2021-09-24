import { BaseTask } from 'adonis5-scheduler/build'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RememberToBet extends BaseTask {
  public static get schedule() {
    return '0 0 * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    const usersToBet = await Database.rawQuery(`
      select U.*, min(B.created_at) as last_bet
      from users U
      join bets B
      on B.user_id = U.id and (B.created_at <= NOW() - interval '1 day' * 7)
      group by U.id;
    `)

    const usersNeverBet = await Database.rawQuery(`
      select U.*
      from users U
      left join bets B
      on B.user_id = U.id
      where B.id is null
      group by U.id;
    `)

    Array.prototype.forEach.call(usersToBet.rows, async (user) => {
      await Mail.sendLater((message) => {
        message
          .to(user.email)
          .from('davi@adonisjs.com', 'Davi Banfi')
          .subject('Está na hora de apostar!')
          .htmlView('emails/time_to_bet', {
            name: user.name,
            surname: user.surname,
          })
      })
    })

    Array.prototype.forEach.call(usersNeverBet.rows, async (user) => {
      await Mail.sendLater((message) => {
        message
          .to(user.email)
          .from('davi@adonisjs.com', 'Davi Banfi')
          .subject('Está na hora de apostar!')
          .htmlView('emails/time_to_bet', {
            name: user.name,
            surname: user.surname,
          })
      })
    })
  }
}
