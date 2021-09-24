declare module '@ioc:Adonis/Core/HttpContext' {
  import { Producer } from 'kafkajs'

  interface HttpContextContract {
    producer: Producer
  }
}
