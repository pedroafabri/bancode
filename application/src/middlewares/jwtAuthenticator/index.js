import { verify } from 'jsonwebtoken'
import { UnauthorizedError } from 'restify-errors'
import { UserService } from '../../modules/users'

export const jwtAuthenticator = async (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '')

  try {
    const decodedToken = verify(token, process.env.JWT_SECRET)

    const user = await UserService.getUserById(decodedToken.sub)
    if (!user.verified) return next(new UnauthorizedError('Unverified user.'))
    if (user.deletedAt) return next(new UnauthorizedError('Inactive User.'))

    req.decodedToken = decodedToken

    next()
  } catch (err) {
    return next(new UnauthorizedError('Invalid token.'))
  }
}
