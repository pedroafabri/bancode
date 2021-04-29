import jwt from 'jsonwebtoken'

export const sign = (id) => jwt.sign({ sub: id }, process.env.JWT_SECRET, { expiresIn: 3600 })

export default {
  sign
}
