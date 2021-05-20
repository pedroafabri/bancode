import { verify } from '../../helpers/token'
import { UnauthorizedError } from 'restify-errors'
import { UserService } from '../../modules/users'

export const jwtAuthenticator = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '')
    const decodedToken = verify(token)

    const user = await UserService.getUserById(decodedToken.sub)
    if (user.deletedAt) return next(new UnauthorizedError('Inactive user.'))
    if (!user.verified) return next(new UnauthorizedError('Unverified user.'))

    req.decodedToken = decodedToken

    next()
  } catch (err) {
    return next(new UnauthorizedError('Invalid token.'))
  }
}
