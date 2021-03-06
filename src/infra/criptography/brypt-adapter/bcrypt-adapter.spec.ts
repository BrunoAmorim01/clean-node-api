import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise<string>((resolve) => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return await new Promise((resolve) => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt adapter', () => {
  describe('hash', () => {
    test('should call hash with the correct values', async () => {
      const sut = makeSut()
      const hasSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hasSpy).toBeCalledWith('any_value', salt)
    })

    test('should return a valid hash on hash sucess', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('Bcrypt adapter', () => {
    test('should call compare with the correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toBeCalledWith('any_value', 'any_hash')
    })

    test('should return true when compare sucess', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('should return false when compare fails', async () => {
      const sut = makeSut()
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(async () => await Promise.resolve(false))

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(false)
    })

    test('should throw if compare throws', async () => {
      const sut = makeSut()
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(async () => await Promise.reject(new Error()))
      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
