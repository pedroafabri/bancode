// Requires npm package 'cpf-check'
import CPF from 'cpf-check'

// Exports the validation functionality from cpf-check
export const validation = cpf => CPF.validate(cpf)

// Exports desconstructed
export default {
  validation
}
