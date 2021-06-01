import request from 'supertest'
import Server from '../../../src/server'
import { TransferRoutes } from '../../../src/modules/transfer'

const TRANSFER_ROUTE = TransferRoutes.TRANSFER_ROUTE

export default class TransferTest {
  constructor () {
    this._api = request(Server.create().server)
  }

  makeTransfer (transfer) {
      return this._api.post(`${TRANSFER_ROUTE}`).send(transfer)
  }

  getAllTransfers () {
      return this._api.get(`${TRANSFER_ROUTE}`)
  }

  getTransfersFrom (id) {
      return this._api.get(`${TRANSFER_ROUTE}/from/${id}`)
  }

  getTransfersTo (id) {
      return this._api.get(`${TRANSFER_ROUTE}/to/${id}`)
  }

  getTransfersAmount (MinAmount, MaxAmount) {
      return this._api.get(`${TRANSFER_ROUTE}/amount`).send(MinAmount, MaxAmount)
  }

  getTransfersDate (date) {
      return this._api.get(`${TRANSFER_ROUTE}/date`).send(date)
  }
}