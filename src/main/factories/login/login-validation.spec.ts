import { CompareFieldsValidation } from '../../../presentation/helper/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helper/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helper/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
