import { MongoHelper } from '@/infra/db/mongodb/helper/mongo-helper'
import app from '../config/app'
import env from '../config/env'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  accountCollection = await MongoHelper.getCollection('accounts')
  const account = await accountCollection.insertOne({
    name: 'Bruno',
    email: 'bruno@gmail.com',
    password: '123'
  })
  const id = account.insertedId

  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken
      }
    }
  )

  return accessToken
}

describe('Survey Result routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    surveyCollection = await MongoHelper.getCollection('surveys')
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

    test('Should return 200 on Save Survey result with token', async () => {
      const accessToken = await makeAccessToken()
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          { image: 'any_image', answer: 'any_answer' },
          { answer: 'other_answer' }
        ],
        date: new Date()
      })
      const id = res.insertedId as unknown as string
      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'any_answer' })
        .expect(200)
    })
  })
})
