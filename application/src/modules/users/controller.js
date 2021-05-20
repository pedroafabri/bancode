// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpfValidator'
import CPF from 'cpf-check'
import emailCheck from '../../helpers/emailValidator'
import passwordCheck from '../../helpers/passwordValidator'
import { sendWelcomeEmail, sendPasswordRecoveryEmail } from '../../helpers/emailSender'
import { encrypt } from '../../helpers/encryptPassword'
import { BadRequestError, NotFoundError, UnauthorizedError } from 'restify-errors'

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
    return next(err)
  }
}

// Deletes an user
export const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id)
    const deletedUser = await UserService.getUserById(req.params.id)

    // Display deleted user
    res.json(UserService.displayFormat(deletedUser))
  } catch (err) {
    return next(err)
  }
}

export const recoveryPassword = async (req, res, next) => {
  const { email } = req.body
  if (!email) return next(new BadRequestError('Email field is empty.'))

  const user = await UserService.getUserByEmail(email)
  if (!user) return next(new NotFoundError('Email not registered.'))

  const token = sign({ id: user._id })
  try {
    sendPasswordRecoveryEmail(user, token)

    res('Email sent!')
  } catch (err) {
    return next(err)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { sub } = verify(token)

    const { password } = req.body
    if (!password) return next(new BadRequestError('Password field is empty.'))

    await UserService.updateUser(sub, { password })
    const updatedUser = await UserService.getUserById(sub)

    res.json(UserService.displayFormat(updatedUser))
  } catch (err) {
    return next(new UnauthorizedError('Invalid token'))
  }
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  recoveryPassword,
  changePassword
}
