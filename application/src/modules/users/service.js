// Requires user model
import UserModel from './model'

// Get all users
export const getAllUsers = () => UserModel.find({})

// Get user by id
export const getUserById = id => UserModel.findOne({ _id: id })

// Get user by email
export const getUserByEmail = email => UserModel.findOne({ email: email })

// Create new user
export const createUser = user => UserModel.create(user)

// Update an existing user
export const updateUser = (id, update) => UserModel.updateOne({ _id: id }, update)

// Delete an existing user
export const deleteUser = id => UserModel.updateOne({ _id: id }, { deletedAt: new Date().toString() })

export const displayFormat = user => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    cpf: user.cpf,
    balance: user.balance,
    verified: user.verified,
    id: user._id
  }
}

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  displayFormat
}
