import jwt from 'jsonwebtoken'

export const token = (id) => jwt.sign({ sub: id }, process.env.JWT_SECRET, { expiresIn: 3600 })

export default {
  token
}
