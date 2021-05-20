import jwt from 'jsonwebtoken'

export const sign = ({ id, expiresIn = 3600 }) => jwt.sign({ sub: id }, process.env.JWT_SECRET, { expiresIn })

export const verify = token => jwt.verify(token, process.env.JWT_SECRET)

export default {
  sign,
  verify
}
