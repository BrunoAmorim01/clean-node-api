import { CompareFieldsValidation } from '../../../presentation/helper/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helper/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../presentation/helper/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
