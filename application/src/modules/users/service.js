// Requires user model
import UserModel from './model'

// Get all users
export const getAllUsers = () => UserModel.find({})

// Get user by id
export const getUser = id => UserModel.findById(id)

// Create new user
export const createUser = user => UserModel.create(user)

// Update an existing user
export const updateUser = (id, update) => UserModel.updateOne({ _id: id }, update)

// Delete an existing user
export const deleteUser = id => UserModel.updateOne({ _id: id }, { deletedAt: new Date().toString() })

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
