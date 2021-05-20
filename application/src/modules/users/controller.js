// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpfValidator'
import CPF from 'cpf-check'
import emailCheck from '../../helpers/emailValidator'
import passwordCheck from '../../helpers/passwordValidator'
import { sendWelcomeEmail } from '../../helpers/emailSender'
import { encrypt } from '../../helpers/encryptPassword'
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from 'restify-errors'
import { sign } from '../../../src/helpers/token'
import { UserTransfer } from './model'

// GET all users JSON
export const getAllUsers = async (req, res) => {
  const users = await UserService.getAllUsers()
  // Display all users
  res.json(users)
}

// GET user by id
export const getUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)

    // Display user
    res.json(UserService.displayFormat(user))
  } catch (err) {
    next(err)
  }
}

// Creates an user
export const createUser = async (req, res, next) => {
  const user = req.body

  // Check if user CPF is valid
  if (!cpfCheck.validate(user.cpf)) return next(new BadRequestError('Invalid CPF.'))
  user.cpf = CPF.format(user.cpf)

  // Check if user password is valid
  if (!passwordCheck.validate(user.password)) return next(new BadRequestError('Invalid password.'))
  // Encrypt user password
  user.password = encrypt(user.password)

  // Check if user e-mail is valid
  if (!emailCheck.validate(user.email)) return next(new BadRequestError('Invalid email.'))
  // Check if user e-mail already exists
  const email = await UserService.getUserByEmail(user.email)
  if (email) return next(new BadRequestError('Email is already in use.'))

  // Try send email and then create user
  try {
    await sendWelcomeEmail(user.email, user)
    const createdUser = await UserService.createUser(user)

    // Display created user
    res.json(UserService.displayFormat(createdUser))
  } catch (err) {
    return next(err)
  }
}

// Updates an user
export const updateUser = async (req, res, next) => {
  const update = req.body

  // Checks if CPF was updated and if it's valid
  if (update.cpf || update.cpf === '') {
    if (!cpfCheck.validate(update.cpf)) return next(new BadRequestError('Invalid CPF.'))
    update.cpf = CPF.format(update.cpf)
  }

  // Checks if password was updated and if it's valid
  if (update.password || update.password === '') {
    if (!passwordCheck.validate(update.password)) return next(new BadRequestError('Invalid password.'))
    update.password = encrypt(update.password)
  }

  // Checks if e-mail was updated and if it's valid
  if (update.email || update.email === '') {
    if (!emailCheck.validate(update.email)) return next(new BadRequestError('Invalid email.'))
    const email = await UserService.getUserByEmail(update.email)
    if (email) return next(new BadRequestError('Email is already in use.'))
  }

  update.updatedAt = Date.now()

  try {
    await UserService.updateUser(req.params.id, update)
    const updatedUser = await UserService.getUserById(req.params.id)

    // Display updated user
    res.json(UserService.displayFormat(updatedUser))
  } catch (err) {
    return next(err.message)
  }
}

// Deletes an user
export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await UserService.getUserById(req.params.id)

    await UserService.deleteUser(req.params.id)
    // Display deleted user
    res.json(UserService.displayFormat(deletedUser))
  } catch (err) {
    return next(err)
  }
}

export const authenticateUser = async (req, res, next) => {
  const userData = req.body
  if (!userData.email) return next(new BadRequestError('email not provided.'))
  if (!userData.password) return next(new BadRequestError('password not provided.'))

  // get the user by the email
  const user = await UserService.getUserByEmail(userData.email)

  if (!user) return next(new UnauthorizedError('invalid credentials.'))

  // checks if passwords are the same
  if (encrypt(userData.password) !== user.password) return next(new UnauthorizedError('invalid credentials.'))

  // if the  user is not verified (false) return
  if (!user.verified) return next(new ForbiddenError('user not verified'))

  // creates a jwt token that expires in an hour and display
  res.json({ token: sign(user._id) })
}

export const transfer = async (req, res, next) => {
  // receives the parameters in the body
  const userTransfer = req.body

  // body validations
  if (!userTransfer.to) return next(new BadRequestError('to parameter not provided.'))
  if (!userTransfer.amount || userTransfer.amount < 0.01) return next(new BadRequestError('transfers must be at least 0.01'))

  // get the user who is making the transference by the id provided in the token
  const user = await UserService.getUserById(req.decodedToken.sub)

  if (!user) return next(new BadRequestError('invalid token.'))

  // throws an error if balance is less then the amount transferred
  if (user.balance < userTransfer.amount) return next(new BadRequestError('not enough balance.'))

  // get the receiver by the id provided in the body
  const receiver = await UserService.getUserById(userTransfer.to)

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
    await UserService.updateUser(user._id, user)
    await UserService.updateUser(receiver._id, receiver)

    // returns the transaction if everything is ok
    res.json(userTransaction)
  } catch (error) {
    return next(error)
  }
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  authenticateUser,
  deleteUser,
  transfer
}
