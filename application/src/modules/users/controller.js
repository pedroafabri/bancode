// Requirements from service and npm packages
import UserService from './service'
import cpfCheck from '../../helpers/cpf-validator'
import emailCheck from '../../helpers/email-validator'
import { encrypt } from '../../helpers/encrypt-password'

// GET all users JSON
export const getAllUsers = async (req, res) => {
  const users = await UserService.getAllUsers()

  res.json(users)
}

// GET user JSON by id
export const getUser = async (req, res) => {
  const { id } = req.params
  const user = await UserService.getUserById(id)

  if (!user) return res.send(404, 'User not found.')

  res.json(user)
}

// Creates an user
export const createUser = async (req, res) => {
  const user = req.body

  // Check if user e-mail is valid
  const validEmail = emailCheck.validation(user.email)

  if (!validEmail) return res.send(400, 'Invalid email.')

  // Check if user e-mail already exists
  const email = await UserService.getUserByEmail(user.email)

  if (email) return res.send(400, 'Email is already in use.')

  // Check if user CPF is valid
  const validCpf = cpfCheck.validation(user.cpf)

  if (!validCpf) return res.send(400, 'Invalid CPF.')

  // Encrypt user password
  user.password = encrypt(user.password)

  // Display message once user is created
  await UserService.createUser(user)
  res.send('User created successfully!')
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

    if (!validEmail) return res.send(400, 'Invalid email.')
  }

  // Checks if CPF was updated and if it's valid
  if (update.cpf) {
    const validCpf = cpfCheck.validation(update.cpf)
    if (!validCpf) return res.send(400, 'Invalid CPF.')
  }

  // Checks if password was updated and if it's valid
  if (update.password) update.password = encrypt(update.password)

  // Changes updated at and save
  user.updatedAt = new Date().toString()
  await user.save()
  await UserService.updateUser(id, update)
  // Display message once user is updated
  res.send('User updated successfully!')
}

// Deletes an user
export const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await UserService.getUserById(id)

  if (!user) return res.send(404, 'User not found!')
  // Display message once user is deleted
  await UserService.deleteUser(id)
  res.send('User deleted successfully!')
}

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
