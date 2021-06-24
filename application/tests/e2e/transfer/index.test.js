/* globals beforeAll afterAll describe it expect */

import { UserModel } from '../../../src/modules/users'
import { TransferModel } from '../../../src/modules/transfer'

import TransferTest from './endpoint'
import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import { encrypt } from '../../../src/helpers/encryptPassword'
import { sign } from '../../../src/helpers/token'

require('dotenv').config()

const transfertest = new TransferTest()

let transferUser
let token
let receiverUser
let transferExample

describe('emailValidation tests', () => {
  beforeAll(async () => {
    await connectTestDatabase()
    transferUser = await UserModel.create({
      firstName: 'Lucas',
      lastName: 'Melo',
      email: 'lukjedi@yopmail.com',
      cpf: '50320469816',
      verified: true,
      password: encrypt('Invincible@1'),
      balance: 1000
    })

    token = sign({ id: transferUser._id })

    receiverUser = await UserModel.create({
      firstName: 'João',
      lastName: 'Bosquetti',
      cpf: '05567384890',
      email: 'jcbosquetti@yopmail.com',
      verified: true,
      password: encrypt('Robalo@1'),
      balance: 100
    })

    transferExample = await TransferModel.create({
      to: receiverUser.id,
      from: transferUser.id,
      amount: 10,
      date: Date.now()
    })
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('should make a transfer when everything is ok', async () => {
    const transfer = {
      to: receiverUser.id,
      amount: 100
    }
    const response = await transfertest.makeTransfer(transfer, token)

    expect(response.status).toBe(200)
  })

  it('should return error when to parameter is no provided', async () => {
    const transfer = {
      to: '',
      amount: 100
    }
    const { body } = await transfertest.makeTransfer(transfer, token)

    expect(body.message).toBe('to parameter not provided.')
  })

  it("should return error when transferUser hasn't enough balance", async () => {
    const transfer = {
      to: receiverUser.id,
      amount: 100000
    }
    const { body } = await transfertest.makeTransfer(transfer, token)

    expect(body.message).toBe('not enough balance.')
  })

  it('should return error when amount is not provided', async () => {
    const transfer = {
      to: receiverUser.id,
      amount: ''
    }
    const { body } = await transfertest.makeTransfer(transfer, token)

    expect(body.message).toBe('transfers must be at least 0.01')
  })

  it('should return error when token is not valid', async () => {
    const transfer = {
      to: receiverUser.id,
      amount: 10
    }
    const { body } = await transfertest.makeTransfer(transfer)

    expect(body.message).toBe('Invalid token.')
  })

  it('should return all transfers', async () => {
    const response = await transfertest.getAllTransfers()

    expect(response.status).toBe(200)
  })

  it('should return a specific transfer when it id is provided', async () => {
    const response = await transfertest.getTransferId(transferExample.id)

    expect(response.status).toBe(200)
  })

  it('should return error when there is no transfers with this id', async () => {
    const { body } = await transfertest.getTransferId(transferUser.id)

    expect(body.message).toBe('Error: this transfers does not exist')
  })

  it("should return transfers from specific 'from'", async () => {
    const response = await transfertest.getTransfersFrom(transferUser.id)

    expect(response.status).toBe(200)
  })

  it('should return error if there is no transfers from this id', async () => {
    const { body } = await transfertest.getTransfersFrom(receiverUser.id)

    expect(body.message).toBe('Error: there is no transfers from this id')
  })

  it("should return transfers from specific 'to'", async () => {
    const response = await transfertest.getTransfersTo(receiverUser.id)

    expect(response.status).toBe(200)
  })

  it('should return error if there is no transfers to this id', async () => {
    const { body } = await transfertest.getTransfersTo(transferUser.id)

    expect(body.message).toBe('Error: there is no transfers to this id')
  })

  it('should return transfers from specific amount', async () => {
    const amount = {
      MinAmount: 5,
      MaxAmount: 15
    }
    const response = await transfertest.getTransfersAmount(amount)

    expect(response.status).toBe(200)
  })

  it('should return error if there is no transfers in this amount range', async () => {
    const amount = {
      MinAmount: 2,
      MaxAmount: 4
    }
    const { body } = await transfertest.getTransfersAmount(amount)

    expect(body.message).toBe('Error: there is no transfers in this amount range')
  })

  it('should return transfers from specific date', async () => {
    const datetest = { date: transferExample.date }
    const response = await transfertest.getTransfersDate(datetest)

    expect(response.status).toBe(200)
  })

  it('should return error if there is no transfers in this date', async () => {
    const date = '1962-07-11'

    const { body } = await transfertest.getTransfersDate(date)

    expect(body.message).toBe('Error: there is no transfers in this date')
  })
})
