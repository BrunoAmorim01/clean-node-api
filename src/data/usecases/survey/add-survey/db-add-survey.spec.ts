import { AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { throwError } from '@/domain/test'
import { mockAddSurveyRepository } from '@/data/test'
import MockDate from 'mockdate'

const makeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{ image: 'any_image', answer: 'any_answer' }],
  date: new Date()
})

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { addSurveyRepositoryStub, sut }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw Hasher if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(makeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
