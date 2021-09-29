import { InvalidParamError, MissingParamError } from '../../../errors'
import { badRequest } from '../../../helper/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { EmailValidator } from '../signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise((resolve) =>
        resolve(badRequest(new MissingParamError('email')))
      )
    }
    if (!httpRequest.body.password) {
      return await new Promise((resolve) =>
        resolve(badRequest(new MissingParamError('password')))
      )
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return await new Promise((resolve) =>
        resolve(badRequest(new InvalidParamError('email')))
      )
    }
  }
}
