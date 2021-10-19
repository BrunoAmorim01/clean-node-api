import { Collection } from 'mongodb'
import { MongoHelper } from '../helper/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo repository', () => {
  let errorCollection: Collection

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create a error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})