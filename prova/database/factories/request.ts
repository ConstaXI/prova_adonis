import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

const request = supertest(BASE_URL)

export default request
