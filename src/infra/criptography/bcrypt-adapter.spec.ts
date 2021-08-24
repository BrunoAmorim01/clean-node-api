import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt adapter', () => {
  test('should call Bcrypt with the correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hasSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hasSpy).toBeCalledWith('any_value', salt)
  })
})
