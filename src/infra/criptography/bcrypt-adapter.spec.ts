import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise<string>(resolve => resolve('hash'))
  }
}))

describe('Bcrypt adapter', () => {
  test('should call Bcrypt with the correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hasSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hasSpy).toBeCalledWith('any_value', salt)
  })

  test('should return a hash on sucess', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
