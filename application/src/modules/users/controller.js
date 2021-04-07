import UserService from './service'

export const getAllUsers = async (req, res) => {
  const users = await UserService.getAllUsers()

  res.json(users)
}

export const getUser = async (req, res) => {
  const { id } = req.params
  const user = await UserService.getUser(id)

  if (!user) return res.send(404, 'User not found!')

  res.json(user)
}

export const createUser = async (req, res) => {
  const user = req.body

  const emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
  const validEmail = emailRegex.test(user.email)

  if (!validEmail) return res.send(400, 'Invalid email!')

  await UserService.createUser(user)
  res.send('User created successfully!')
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const user = await UserService.getUser(id)
  const update = req.body

  if (update.email) {
    const emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
    const validEmail = emailRegex.test(update.email)

    if (!validEmail) return res.send(400, 'Invalid email!')
  }

  user.updatedAt = new Date().toString()
  await user.save()

  await UserService.updateUser(id, update)
  res.send('User updated successfully!')
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await UserService.getUser(id)

  if (!user) return res.send(404, 'User not found!')

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
