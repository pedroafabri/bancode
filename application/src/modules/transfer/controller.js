// Requirements from service and npm packages
import TransferService from './service'
import { BadRequestError, NotFoundError, UnauthorizedError } from 'restify-errors'
import { UserTransfer } from './model'

export const transfer = async (req, res, next) => {
    // receives the parameters in the body
    const userTransfer = req.body
  
    // body validations
    if (!userTransfer.to) return next(new BadRequestError('to parameter not provided.'))
    if (!userTransfer.amount || userTransfer.amount < 0.01) return next(new BadRequestError('transfers must be at least 0.01'))
  
    // get the user who is making the transference by the id provided in the token
    const user = await TransferService.getUserById(req.decodedToken.sub)
  
    if (!user) return next(new BadRequestError('invalid token.'))
  
    // throws an error if balance is less then the amount transferred
    if (user.balance < userTransfer.amount) return next(new BadRequestError('not enough balance.'))
  
    // get the receiver by the id provided in the body
    const receiver = await TransferService.getUserById(userTransfer.to)
  
    if (!receiver) return next(new NotFoundError('user not found.'))
  
    if (!receiver.verified) return next(new UnauthorizedError('the receiver is not a verified user.'))
  
    // creates an object using the transfer model
    const userTransaction = new UserTransfer({
      to: receiver._id,
      from: user._id,
      amount: '-' + userTransfer.amount,
      date: Date.now()
    })
    const receiverTransaction = new UserTransfer({
      to: receiver._id,
      from: user._id,
      amount: '+' + userTransfer.amount,
      date: Date.now()
    })
  
    // add the transaction in the transfers array and update the respective balances
    user.transfers.push(userTransaction)
    receiver.transfers.push(receiverTransaction)
    user.balance = user.balance - userTransfer.amount
    receiver.balance = receiver.balance + userTransfer.amount
  
    try {
      // updates the users
      await TransferService.updateUser(user._id, user)
      await TransferService.updateUser(receiver._id, receiver)
  
      // returns the transaction if everything is ok
      res.json(userTransaction)
    } catch (error) {
      return next(error)
    }
  }

export default {
    transfer
}
