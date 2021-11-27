import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    // this.client = null
  },

  async getCollection (name: string): Promise <Collection> {
    // if (!this.client?.isConnected) {
    //   await this.connect(this.uri)
    // }
    return this.client.db().collection(name)
  },

  map: (data: any): any => {
    const { _id, ...accountWithoutId } = data
    const model = Object.assign({}, accountWithoutId, { id: _id }) as AccountModel
    return model
  },

  mapCollection: (collection: any[]): any[] => {
    return collection.map(c => MongoHelper.map(c))
  }
}
