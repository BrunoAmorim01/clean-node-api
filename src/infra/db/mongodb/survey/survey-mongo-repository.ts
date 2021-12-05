import { MongoHelper } from '../helper/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository
implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = (await surveyCollection.find().toArray()) as SurveyModel[]
    return MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = (await surveyCollection.findOne({
      _id: new ObjectId(id)
    })) as SurveyModel
    return survey && MongoHelper.map(survey)
  }
}
