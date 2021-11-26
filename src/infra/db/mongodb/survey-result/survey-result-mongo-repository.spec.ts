import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helper/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'other_answer' }],
    date: new Date()
  })
  const id = res.insertedId as unknown as string
  const survey = await surveyCollection.findOne({ _id: id }) as SurveyModel
  return survey
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  const id = res.insertedId
  const account = await accountCollection.findOne({ _id: id }) as AccountModel
  return account
}

describe('Survey Mongo repository ', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveysResults')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a surveyResult if is new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = await makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})
