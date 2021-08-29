import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import app from '../config/app'

describe('Signup routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('Should return an account on success', async () => {
    await request(app).post('/api/signup')
      .send({ name: 'Bruno', email: 'bruno@gmail.com', password: 'password', passwordConfirmation: 'password' })
      .expect(200)
  })
})
