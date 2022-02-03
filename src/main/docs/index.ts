import { loginPath, signUpPath, surveyPath } from './paths'
import { loginParamsSchema, errorSchema, accountSchema, surveysSchema, surveyAnswerSchema, surveySchema, apiKeyAuthSchema, signUpParamsSchema } from './schemas'
import { badRequest, serverError, unauthorized, notFound, forbidden } from './components'
export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean-Node_Api',
    description: 'Api do curso do mango para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'

  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Login'
    },
    {
      name: 'Enquete'
    }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden
  }

}
