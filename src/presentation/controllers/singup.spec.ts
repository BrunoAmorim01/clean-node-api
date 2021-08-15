import { SignUpController } from './signup'
describe('SigUp Controller', () => {
  test('Should return 400 ifno name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email@amail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
