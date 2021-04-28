// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpfValidator'
import CPF from 'cpf-check'
import emailCheck from '../../helpers/emailValidator'
import passwordCheck from '../../helpers/passwordValidator'
import { sendWelcomeEmail } from '../../helpers/emailSender'
import { encrypt } from '../../helpers/encryptPassword'
import { BadRequestError, UnauthorizedError } from 'restify-errors'
import createToken from '../../../src/helpers/tokenGenerator'

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
  if (!userData.password) return next(new BadRequestError('password field not filled.'))

  // get the user by the email
  const user = await UserService.getUserByEmail(userData.email)
  if (!user) return next(new UnauthorizedError('invalid credentials.'))

  // checks if passwords are the same
  if (encrypt(userData.password) !== user.password) return next(new UnauthorizedError('invalid credentials.'))

  // if the  user is not verified (false) return
  if (!user.verified) return next(new BadRequestError('user not verified'))

  // creates a jwt token that expires in an hour
  const token = createToken.token(user._id)

  // display the token
  res.json({ token })
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  authenticateUser,
  deleteUser
}
