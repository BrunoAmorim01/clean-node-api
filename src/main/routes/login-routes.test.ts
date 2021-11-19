import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Bruno',
          email: 'bruno@gmail.com',
          password: 'password',
          passwordConfirmation: 'password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('password', 12)
      await accountCollection.insertOne({
        name: 'Bruno',
        email: 'bruno@gmail.com',
        password: password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@gmail.com',
          password: 'password'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'bruno@gmail.com',
          password: 'password'
        })
        .expect(401)
    })
  })
})
