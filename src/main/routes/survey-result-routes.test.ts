import { MongoHelper } from '@/infra/db/mongodb/helper/mongo-helper'
import app from '../config/app'
import request from 'supertest'

describe('Survey Result routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Put /surveys/:surveyId/results', () => {
    test('Should return 403 on Save Survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })
  })
})
