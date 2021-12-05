import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey/survey-result/save-survey-result/save-survey-result-controller-factory'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { auth } from '@/main/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    auth,
    adaptRoute(makeSaveSurveyResultController())
  )
}
