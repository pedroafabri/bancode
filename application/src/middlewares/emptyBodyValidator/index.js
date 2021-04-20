import { BadRequestError } from "restify-errors"

export const emptyBodyValidator = (req, res, next) => {
  if(!req.body) return next(new BadRequestError('Empty body request.'))

  next()
}
