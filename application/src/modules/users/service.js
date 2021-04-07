import UserModel from './model'

export const getAllUsers = () => UserModel.find({})

export const getUser = id => UserModel.findById(id)

export const createUser = user => UserModel.create(user)

export const updateUser = (id, update) => UserModel.updateOne({ _id: id }, update)

export const deleteUser = id => UserModel.updateOne({ _id: id }, { deletedAt: new Date().toString() })

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
