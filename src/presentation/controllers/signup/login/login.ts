import { InvalidParamError, MissingParamError } from '../../../errors'
import { badRequest, serverError } from '../../../helper/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { EmailValidator } from '../signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return await new Promise((resolve) =>
          resolve(badRequest(new MissingParamError('email')))
        )
      }
      if (!password) {
        return await new Promise((resolve) =>
          resolve(badRequest(new MissingParamError('password')))
        )
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await new Promise((resolve) =>
          resolve(badRequest(new InvalidParamError('email')))
        )
      }
    } catch (error) {
      return serverError(error)
    }
  }
}