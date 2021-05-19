import jwt from 'jsonwebtoken'

export const sign = (id) => jwt.sign(
  { sub: id }, process.env.JWT_SECRET,
  { expiresIn: Math.floor(Date.now() / 1000) + 3600 }
)

export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET)

export default {
  sign,
  verify
}
