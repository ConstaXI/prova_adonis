import test from 'japa'
import supertest from 'supertest'
import { JSDOM } from 'jsdom'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('Ensure home page works', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/').expect(200)

    const { document } = new JSDOM(text).window

    const title = document.querySelector('.title')
    assert.exists(title)
    assert.equal(title!.textContent!.trim(), 'It works!')
  })
})
