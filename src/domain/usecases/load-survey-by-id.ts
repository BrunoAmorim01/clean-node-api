import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyById{
  loadByid: (id: string) => Promise<SurveyModel>
}
