import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise<string>(resolve => resolve('hash'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt adapter', () => {
  test('should call Bcrypt with the correct values', async () => {
    const sut = makeSut()
    const hasSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hasSpy).toBeCalledWith('any_value', salt)
  })

  test('should return a hash on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
