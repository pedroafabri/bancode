// Requires user model
import UserModel from './model'

// Get all users
export const getAllUsers = async () => await UserModel.find({})

// Get user by id
export const getUserById = async id => await UserModel.findOne({ _id: id })

// Get user by email
export const getUserByEmail = async email => await UserModel.findOne({ email: email })

// Create new user
export const createUser = async user => await UserModel.create(user)

// Validate user
export const validateUser = async (email, update) => UserModel.updateOne({ email: email }, update)

// Update an existing user
export const updateUser = async (id, update) => await UserModel.updateOne({ _id: id }, update)

// Delete an existing user
export const deleteUser = async id => await UserModel.updateOne({ _id: id }, { deletedAt: Date.now() })

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
  validateUser,
  updateUser,
  deleteUser,
  displayFormat
}
