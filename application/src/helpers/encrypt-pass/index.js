import md5 from 'md5'

export const encrypt = pass => md5(pass)

export default {
  encrypt
}
