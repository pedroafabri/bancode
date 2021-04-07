import CPF from 'cpf-check'

export const validation = cpf => CPF.validate(cpf)

export default {
  validation
}
