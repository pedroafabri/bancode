// Requires npm package 'email-validator'
import EMAIL from 'email-validator'

// Exports the 'validate' functionality from cpf-check
export const validation = email => EMAIL.validate(email)

// Exports desconstructed
export default {
  validation
}
