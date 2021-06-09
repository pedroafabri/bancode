import { BadRequestError } from 'restify-errors'

export const emptyBodyValidator = (req, res, next) => {
  if (!req.body) return next(new BadRequestError('Empty body request.'))

  next()
}

export const checkBodyInformation = allowed => (req, res, next) => {
  for (const key of Object.keys(req.body)) {
    if (!allowed.includes(key)) return next(new BadRequestError(`Field '${key}' not allowed.`))
  }

  next()
}
