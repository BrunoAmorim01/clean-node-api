import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/Account'

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

  map: (collection: any): any => {
    const { _id, ...accountWithoutId } = collection
    const model = Object.assign({}, accountWithoutId, { id: _id }) as AccountModel
    return model
  }
}
