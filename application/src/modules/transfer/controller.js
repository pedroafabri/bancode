// Requirements from service and npm packages
import UserService from '../users/service'
import TransferService from './service'
import { BadRequestError, NotFoundError, UnauthorizedError } from 'restify-errors'
import { TransferModel } from './model'

// make a new transfer
export const makeTransfer = async (req, res, next) => {
  // receives the parameters in the body
  const newTransfer = req.body

  // body validations
  if (!newTransfer.to) return next(new BadRequestError('to parameter not provided.'))
  if (!newTransfer.amount || newTransfer.amount < 0.01) return next(new BadRequestError('transfers must be at least 0.01'))

  // get the user who is making the transference by the id provided in the token
  const user = await UserService.getUserById(req.decodedToken.sub)

  if (!user) return next(new BadRequestError('invalid token.'))

  // throws an error if balance is less then the amount transferred
  if (user.balance < newTransfer.amount) return next(new BadRequestError('not enough balance.'))

  // get the receiver by the id provided in the body
  const receiver = await UserService.getUserById(newTransfer.to)

  if (!receiver) return next(new NotFoundError('user not found.'))

  if (!receiver.verified) return next(new UnauthorizedError('the receiver is not a verified user.'))

  // creates an object using the transfer model
  const userTransaction = new TransferModel({
    to: receiver._id,
    from: user._id,
    amount: '-' + newTransfer.amount,
    date: Date.now()
  })

  // add the transaction in the transfers array and update the respective balances
  user.transfers.push(userTransaction)
  user.balance = user.balance - newTransfer.amount
  receiver.balance = receiver.balance + newTransfer.amount

  try {
    // updates the users
    await UserService.updateUser(user._id, user)
    await UserService.updateUser(receiver._id, receiver)

    // returns the transaction if everything is ok
    res.json(userTransaction)
  } catch (error) {
    return next(error)
  }
}

// Get all transfers Json
export const getAllTransfers = async (req, res) => {

  const transfers = await TransferService.getAllTransfers

  res.json(transfers)
}

// Get transfers from a specific id
export const getTransfersFrom = async (req, res, next) => {
  try {
    const transfersfrom = await TransferService.getTransfersFrom(req.params.id)

    res.json(TransferService.displayFormat(transfersfrom))

  } catch (err) {
    next (err)
  }
}

// Get transfers to a specific id
export const getTransfersTo = async (req, res, next) => {
  try {
    const transfersto = await TransferService.getTransfersTo(req.params.id)

    res.json(TransferService.displayFormat(transfersto))

  } catch (err) {
    next (err)
  }
}

// Get transfers of a specific amount
export const getTransfersAmount = async (req, res, next) => {
  const {MinAmount, MaxAmount} = req.body
  try{
    const transferamount = await TransferService.getTransfersAmount(amount >= MinAmount && amount <= MaxAmount)

    if(!transferamount) return next(new Error('invalid amount range'))

    res.json(TransferService.displayFormat(transferamount))

  } catch (err) {
    next (err)
  }
}

// Get transfers of a specific date
export const getTransfersDate = async (req, res, next) => {
  const {date} = req.body
  try {
    const transfersdate = await TransferService.getTransfersDate(date)

    if(!transfersdate) return next(new Error('invalid Date'))

    res.json(TransferService.displayFormat(transfersdate))

  } catch (err) {
    next (err)
  }
}


export default {
  makeTransfer,
  getAllTransfers,
  getTransfersFrom,
  getTransfersTo,
  getTransfersAmount,
  getTransfersDate
}
