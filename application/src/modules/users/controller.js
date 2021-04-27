// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpfValidator'
import CPF from 'cpf-check'
import emailCheck from '../../helpers/emailValidator'
import passwordCheck from '../../helpers/passwordValidator'
import { sendWelcomeEmail } from '../../helpers/emailSender'
import { encrypt } from '../../helpers/encryptPassword'
import { BadRequestError, UnauthorizedError } from 'restify-errors'
import jwt from 'jsonwebtoken'

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
  if (!userData.email && !userData.password) return next(new BadRequestError('fields not filled.'))
  if (!userData.email) return next(new BadRequestError('email field not filled.'))
  if (!userData.password) return next(new BadRequestError('password field not filled.'))

  try {
    // get the user by the email
    const user = await UserService.getUserByEmail(req.body.email)
    if (!user) return next(new UnauthorizedError('invalid credentials.'))

    // checks if passwords are the same
    if (encrypt(userData.password) !== user.password) return next(new UnauthorizedError('invalid credentials.'))

    // create a  jwt token if the user exists in the database
    const token = await jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 })

    // in the event that the information matches we check the user and update him
    if (!user.verified) return next(new BadRequestError('user not verified'))

    // display the token
    res.json({ token: token })
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
  deleteUser
}
