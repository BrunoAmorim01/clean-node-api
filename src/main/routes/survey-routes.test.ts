import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on Add Survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{ answer: 'Answer 1', image: 'http://image-name.com' }, { answer: 'Answer 2' }]
        })
        .expect(403)
    })

    test('Should return 204 on Add Survey with valid token', async () => {
      const account = await accountCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = account.insertedId

      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{ answer: 'Answer 1', image: 'http://image-name.com' }, { answer: 'Answer 2' }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on Load Surveys without access token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
  })
})
