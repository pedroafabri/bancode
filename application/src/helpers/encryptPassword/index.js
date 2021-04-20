// Requires npm package 'md5'
import md5 from 'md5'

// Exports md5 encryptation
export const encrypt = pass => md5(pass)

// Exports desconstructed
export default {
  encrypt
}
