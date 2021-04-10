// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpfValidator'
import emailCheck from '../../helpers/emailValidator'
import passwordCheck from '../../helpers/passwordValidator'
import { encrypt } from '../../helpers/encryptPassword'
import error from 'restify-errors'

// GET all users JSON
export const getAllUsers = async (req, res) => {
  const users = await UserService.getAllUsers()
  // Display all users
  res.json(users)
}

// GET user JSON by id
export const getUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)

    if (!user) throw new Error()

    // Display user
    res.json(user)
  } catch (err) {
    return next(new error.NotFoundError('User not found.'))
  }
}

// Creates an user
export const createUser = async (req, res, next) => {
  try {
    if (req.body === undefined) throw new Error()
  } catch (err) {
    return next(new error.BadRequestError('Expected JSON on body.'))
  }

  const user = req.body

  // Check if user e-mail is valid
  if (!emailCheck.validation(user.email)) return next(new error.BadRequestError('Invalid email.'))

  // Check if user CPF is valid
  if (!cpfCheck.validation(user.cpf)) return next(new error.BadRequestError('Invalid CPF.'))

  // Check if user e-mail already exists
  const email = await UserService.getUserByEmail(user.email)
  if (email) return next(new error.BadRequestError('Email is already in use.'))

  // Check if user password is valid
  const validPassword = passwordCheck.validation(user.password)
  if (!validPassword) return next(new error.BadRequestError('Invalid password.'))
  // Encrypt user password
  user.password = encrypt(user.password)

  try {
    const newUser = await UserService.createUser(user)
    // Display created user
    res.json(newUser)
  } catch (err) {
    return next(new error.ServiceUnavailableError(err.message))
  }
}

// Updates an user
export const updateUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)

    if (!user) throw new Error()
  } catch (err) {
    return next(new error.NotFoundError('User not found.'))
  }

  try {
    if (req.body === undefined) throw new Error()
  } catch (err) {
    return next(new error.BadRequestError('Expected JSON on body.'))
  }

  const update = req.body

  // Checks if e-mail was updated and if it's valid
  if (update.email || update.email === '') {
    const validEmail = emailCheck.validation(update.email)
    if (!validEmail) return next(new error.BadRequestError('Invalid email.'))
  }

  // Checks if CPF was updated and if it's valid
  if (update.cpf || update.cpf === '') {
    const validCpf = cpfCheck.validation(update.cpf)
    if (!validCpf) return next(new error.BadRequestError('Invalid CPF.'))
  }

  // Checks if password was updated and if it's valid
  if (update.password || update.password === '') {
    const validPassword = passwordCheck.validation(update.password)
    if (!validPassword) return next(new error.BadRequestError('Invalid password.'))
    update.password = encrypt(update.password)
  }

  update.updatedAt = new Date().toString()

  await UserService.updateUser(req.params.id, update)
  const updatedUser = await UserService.getUserById(req.params.id)

  // Displayupdated user
  res.json(updatedUser)
}

// Deletes an user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)

    if (!user) throw new Error()
  } catch (err) {
    return next(new error.NotFoundError('User not found.'))
  }

  await UserService.deleteUser(req.params.id)
  const deletedUser = await UserService.getUserById(req.params.id)

  // Display deleted user
  res.json(deletedUser)
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
