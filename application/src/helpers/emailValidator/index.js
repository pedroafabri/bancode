// Requires npm package 'email-validator'
import EMAIL from 'email-validator'

// Exports the 'validate' functionality from email-validator
export const validate = email => EMAIL.validate(email)

// Exports desconstructed
export default {
  validate
}
