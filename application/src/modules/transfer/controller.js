// Requirements from service and npm packages
import UserService from '../users/service'
import TransferService from './service'
import { BadRequestError, NotFoundError, UnauthorizedError } from 'restify-errors'

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

  // can't transfer money to yourself
  if (user.id === receiver.id) return next(new UnauthorizedError('Cannot transfer money to your own account'))

  if (!receiver) return next(new NotFoundError('user not found.'))

  if (!receiver.verified) return next(new UnauthorizedError('the receiver is not a verified user.'))

  // creates an object using the transfer model
  const transaction = {
    to: receiver._id,
    from: user._id,
    amount: newTransfer.amount,
    date: Date.now()
  }

  // add the transaction in the transfers array and update the respective balances
  user.balance = user.balance - newTransfer.amount
  receiver.balance = receiver.balance + newTransfer.amount

  try {
    // updates the users
    await UserService.updateUser(user._id, user)
    await UserService.updateUser(receiver._id, receiver)

    await TransferService.createTransfer(transaction)

    // returns the transaction if everything is ok
    res.json(transaction)
  } catch (error) {
    return next(error)
  }
}

// Get all transfers Json
export const getAllTransfers = async (req, res) => {
  const transfers = await TransferService.getAllTransfers()

  res.json(transfers)
}

// Get specific transfer by id
export const getTransferId = async (req, res, next) => {
  try {
    const transferid = await TransferService.getTransferId(req.params.id)

    if (!transferid) return next(new Error('this transfers does not exist'))

    res.json(TransferService.displayFormat(transferid))
  } catch (err) {
    next(err)
  }
}

// Get transfers from a specific id
export const getTransfersFrom = async (req, res, next) => {
  try {
    const transfersfrom = await TransferService.getTransfersFrom(req.params.id)

    if (transfersfrom.length === 0) return next(new Error('there is no transfers from this id'))

    res.json(transfersfrom)
  } catch (err) {
    next(err)
  }
}

// Get transfers to a specific id
export const getTransfersTo = async (req, res, next) => {
  try {
    const transfersto = await TransferService.getTransfersTo(req.params.id)

    if (transfersto.length === 0) return next(new Error('there is no transfers to this id'))

    res.json((transfersto))
  } catch (err) {
    next(err)
  }
}

// Get transfers of a specific amount
export const getTransfersAmount = async (req, res, next) => {
  const { MinAmount, MaxAmount } = req.body
  try {
    const transferamount = await TransferService.getTransfersAmount(MinAmount, MaxAmount)

    if (transferamount.length === 0) return next(new Error('there is no transfers in this amount range'))

    res.json(transferamount)
  } catch (err) {
    next(err)
  }
}

// Get transfers of a specific date
export const getTransfersDate = async (req, res, next) => {
  const { date } = req.body
  try {
    const transfersdate = await TransferService.getTransfersDate(date)

    if (transfersdate.length === 0) return next(new Error('there is no transfers in this date'))

    res.json(transfersdate)
  } catch (err) {
    next(err)
  }
}

export default {
  makeTransfer,
  getAllTransfers,
  getTransferId,
  getTransfersFrom,
  getTransfersTo,
  getTransfersAmount,
  getTransfersDate
}
