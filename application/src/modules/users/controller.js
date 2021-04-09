// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpfValidator'
import emailCheck from '../../helpers/emailValidator'
import { encrypt } from '../../helpers/encryptPassword'
import error from 'restify-errors'

// GET all users JSON
export const getAllUsers = async (req, res) => {
  const users = await UserService.getAllUsers()
  res.json(users)
}

// GET user JSON by id
export const getUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)

    /**
     * BUG NO MONGOOSE QUANDO ELE TESTA UM ID COM EXATAMENTE
     * 12 CARACTERES. MESMO O ID SENDO INVALIDO A FUNCAO findOne
     * NAO RETORNA UM ERRO. POR ISSO PRECISAMOS DESSE IF.
     */
    if (!user) return next(new error.NotFoundError('User not found.'))
  } catch (err) {
    return next(new error.NotFoundError('User not found.'))
  }

  res.json(user)
}

// Creates an user
export const createUser = async (req, res, next) => {
  try {
    if (req.body === undefined) throw new Error('')
  } catch (err) {
    return next(new error.BadRequestError(err.message))
  }

  const user = req.body

  // Check if user e-mail is valid
  if (!emailCheck.validation(user.email)) return next(new error.BadRequestError('Invalid email.'))

  // Check if user CPF is valid
  if (!cpfCheck.validation(user.cpf)) return next(new error.BadRequestError('Invalid CPF.'))

  // Check if user e-mail already exists
  const email = await UserService.getUserByEmail(user.email)
  if (email) return next(new error.BadRequestError('Email is already in use.'))

  // Encrypt user password
  user.password = encrypt(user.password)

  try {
    const newUser = await UserService.createUser(user)
    // Display message once user is created
    res.json(newUser)
  } catch (err) {
    return next(new error.ServiceUnavailableError(err.message))
  }
}

// Updates an user
export const updateUser = async (req, res) => {
  // Get user by id
  const { id } = req.params
  const user = await UserService.getUserById(id)
  const update = req.body

  // Checks if e-mail was updated and if it's valid
  if (update.email) {
    const validEmail = emailCheck.validation(update.email)

    if (!validEmail) return next(new error.BadRequestError('Invalid email.'))
  }

  // Checks if CPF was updated and if it's valid
  if (update.cpf) {
    const validCpf = cpfCheck.validation(update.cpf)
    if (!validCpf) return next(new error.BadRequestError('Invalid CPF.'))
  }

  // Checks if password was updated and if it's valid
  if (update.password) update.password = encrypt(update.password)

  // Changes updated at and save
  user.updatedAt = new Date().toString()
  await user.save()
  await UserService.updateUser(id, update)
  // Display message once user is updated
  res.json(user)
}

// Deletes an user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)

    /**
     * BUG NO MONGOOSE QUANDO ELE TESTA UM ID COM EXATAMENTE
     * 12 CARACTERES. MESMO O ID SENDO INVALIDO A FUNCAO findOne
     * NAO RETORNA UM ERRO. POR ISSO PRECISAMOS DESSE IF.
     */
    if (!user) return next(new error.NotFoundError('User not found.'))
  } catch (err) {
    return next(new error.NotFoundError('User not found.'))
  }

  await UserService.deleteUser(req.params.id)
  const deletedUser = await UserService.getUserById(req.params.id)
  // Display message once user is deleted
  res.json(deletedUser)
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
