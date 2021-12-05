import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { mockAccountModel, throwError } from '@/domain/test'
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountbyTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountbyTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountbyTokenRepositoryStub
  )
  return {
    sut,
    decrypterStub,
    loadAccountbyTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockResolvedValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountbyTokenRepository with correct values', async () => {
    const { sut, loadAccountbyTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(
      loadAccountbyTokenRepositoryStub,
      'loadByToken'
    )
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountbyTokenRepository returns null', async () => {
    const { sut, loadAccountbyTokenRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountbyTokenRepositoryStub, 'loadByToken')
      .mockResolvedValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountbyTokenRepository throws', async () => {
    const { sut, loadAccountbyTokenRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountbyTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
