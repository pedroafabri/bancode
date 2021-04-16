// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpfValidator'
import CPF from 'cpf-check'
import emailCheck from '../../helpers/emailValidator'
import passwordCheck from '../../helpers/passwordValidator'
import { sendWelcomeEmail } from '../../helpers/emailSender'
import { encrypt } from '../../helpers/encryptPassword'
import { BadRequestError } from 'restify-errors'

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

  // Check if user e-mail is valid
  if (!emailCheck.validate(user.email)) return next(new BadRequestError('Invalid email.'))

  // Check if user e-mail already exists
  const email = await UserService.getUserByEmail(user.email)
  if (email) return next(BadRequestError('Email is already in use.'))

  // Check if user CPF is valid
  if (!cpfCheck.validate(user.cpf)) return next(new BadRequestError('Invalid CPF.'))
  user.cpf = CPF.format(user.cpf)

  // Check if user password is valid
  const validPassword = passwordCheck.validate(user.password)
  if (!validPassword) return next(new BadRequestError('Invalid password.'))
  // Encrypt user password
  user.password = encrypt(user.password)

  // Try create user and send
  try {
    const createdUser = await UserService.createUser(user)
    await sendWelcomeEmail(createdUser.email, createdUser)

    // Display created user
    res.json(UserService.displayFormat(createdUser))
  } catch (err) {
    return next(err)
  }
}

// Updates an user
export const updateUser = async (req, res, next) => {
  await UserService.getUserById(req.params.id)

  const update = req.body

  // Checks if e-mail was updated and if it's valid
  if (update.email || update.email === '') {
    const validEmail = emailCheck.validation(update.email)
    if (!validEmail) return next(new BadRequestError('Invalid email.'))
  }

  // Checks if CPF was updated and if it's valid
  if (update.cpf || update.cpf === '') {
    const validCpf = cpfCheck.validate(update.cpf)
    if (!validCpf) return next(new BadRequestError('Invalid CPF.'))
    update.cpf = CPF.format(update.cpf)
  }

  // Checks if password was updated and if it's valid
  passwordCheck.validate(update.password)
  update.password = encrypt(update.password)

  update.updatedAt = new Date().toString()
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
    const user = await UserService.getUserById(req.params.id)

    if (!user) throw new Error('User not found.')

    const update = {
      deletedAt: new Date().toString(),
      email: `--${user.email}--`,
      cpf: `--${user.cpf}--`
    }
    await UserService.deleteUser(req.params.id, update)
  } catch (err) {
    return next(new error.NotFoundError(err.message))
  }

  const deletedUser = await UserService.getUserById(req.params.id)

  // Display deleted user
  res.json(UserService.displayFormat(deletedUser))
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
