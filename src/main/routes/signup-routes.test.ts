import request from 'supertest'
import app from '../config/app'

describe('Signup routes', () => {
  test('Should return an account on success', async () => {
    await request(app).post('/api/signup')
      .send({ name: 'Bruno', email: 'bruno@gmail.com', password: 'password', passwordConfirmation: 'password' })
      .expect(200)
  })
})
