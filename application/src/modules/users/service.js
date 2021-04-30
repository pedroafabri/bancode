// Requires user model
import UserModel from './model'

// Get all users
export const getAllUsers = async () => UserModel.find({})

// Get user by id
export const getUserById = async id => UserModel.findOne({ _id: id })

// Get user by email
export const getUserByEmail = async email => UserModel.findOne({ email: email })

// Create new user
export const createUser = async user => UserModel.create(user)

// Authenticate user
export const authenticateUser = async (email, update) => UserModel.updateOne({ email: email }, update)

// Update an existing user
export const updateUser = async (id, update) => UserModel.updateOne({ _id: id }, update)

// Delete an existing user
export const deleteUser = async id => UserModel.updateOne({ _id: id }, { deletedAt: Date.now() })

export const displayFormat = user => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    cpf: user.cpf,
    balance: user.balance,
    verified: user.verified
  }
}

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  authenticateUser,
  updateUser,
  deleteUser,
  displayFormat
}
