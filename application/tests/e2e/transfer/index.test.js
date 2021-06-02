/* globals beforeAll afterAll describe it expect */

import { UserModel } from '../../../src/modules/users'
import { TransferModel } from '../../../src/modules/transfer'

import TransferTest from './endpoint'
import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import { encrypt } from '../../../src/helpers/encryptPassword'

require('dotenv').config()

const transfertest = new TransferTest()

let transferUser
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
            password: encrypt('invincible'),
            balance: 1000

        })
        receiverUser = await UserModel.create({
            firstName: 'João',
            lastName: 'Bosquetti',
            cpf: '05567384890',
            email: 'jcbosquetti@yopmail.com',
            verified: true,
            password: encrypt('robalo'),
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
            from: transferUser.id,
            amount: 100
        }
        const response = await transfertest.makeTransfer(transfer)

        expect(response.status).toBe(200)
    })

    it('should return error when to parameter is no provided', async () => {
        const transfer = {
            to: "",
            from: transferUser.id,
            amount: 100
        }
        const { body } = await transfertest.makeTransfer(transfer)

        expect(body).toBe('to parameter not provided.')
    })

    it("should return error when transferUser hasn't enough balance", async () => {
        const transfer = {
            to: receiverUser.id,
            from: transferUser.id,
            amount: 100000
        }
        const { body } = await transfertest.makeTransfer(transfer)

        expect(body).toBe('not enough balance.')
    })

    it('should return error when amount is not provided', async () => {
        const transfer = {
            to: receiverUser.id,
            from: transferUser.id,
            amount: ""
        }
        const { body } = await transfertest.makeTransfer(transfer)

        expect(body).toBe('transfers must be at least 0.01')
    })

    it('should return error when receiverUser is not found', async () => {
        const transfer = {
            to: receiverUser.id,
            from: "",
            amount: 10
        }
        const { body } = await transfertest.makeTransfer(transfer)

        expect(body).toBe('user not found.')
    })

    it('should return all transfers', async () => {
        const response = await transfertest.getAllTransfers()

        expect(response.status).toBe(200)
    })

    it("should return transfers from specific 'from'", async () => {
        const response = await transfertest.getTransfersFrom(transferUser.id)

        expect(response.status).toBe(200)
    })

    it('should return error if there is no transfers from this id', async () => {
        const { body } = await transfertest.getTransfersFrom(receiverUser.id)

        expect(body).toBe('there is no transfers from this id')
    })

    it("should return transfers from specific 'to'", async () => {
        const response = await transfertest.getTransfersTo(receiverUser.id)

        expect(response.status).toBe(200)
    })

    it('should return error if there is no transfers to this id', async () => {
        const { body } = await transfertest.getTransfersTo(transferUser.id)

        expect(body).toBe('there is no transfers to this id')
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

        expect(body).toBe('there is no transfers in this amount range')
    })

    it('should return transfers from specific date', async () => {
        const date = Date.now()
        const response = await transfertest.getTransfersDate(date)

        expect(response.status).toBe(200)
    })

    it('should return error if there is no transfers in this date', async () => {
        const date = 11/7/1962

        const { body } = await transfertest.getTransfersDate(date)

        expect(body).toBe('there is no transfers in this date')
    })
})

