// Requires npm package 'cpf-check'
import CPF from 'cpf-check'

// Exports the validation functionality from cpf-check
export const validate = cpf => CPF.validate(cpf)

export const strip = cpf => CPF.strip(cpf)

export default {
  validate,
  strip
}
