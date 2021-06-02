/* globals describe it expect */

import { validate } from '../../src/helpers/passwordValidator'

describe('asswordValidator helper tests', () => {
  it('Must return true provindig a valid password', () => {
    expect(validate('#Password0')).toBeTruthy()
  })

  it('Must return false providing a password without upper case letter', () => {
    expect(validate('#password1')).toBeFalsy()
  })

  it('Must return false providing a password without lower case letter', () => {
    expect(validate('#PASSWORD2')).toBeFalsy()
  })

  it('Must return false providing a password without number', () => {
    expect(validate('#Password')).toBeFalsy()
  })

  it('Must return false providing a password without special character', () => {
    expect(validate('Password4')).toBeFalsy()
  })

  it('Must return false providing a password lower than 8 characters', () => {
    expect(validate('#Pass5')).toBeFalsy()
  })

  it('Must return false providing a password higher than 32 characters', () => {
    expect(validate('!@$%#InsaneLongestPassword6000000000000')).toBeFalsy()
  })

  it('Must return false providing a password with invalid character', () => {
    expect(validate('#Pass-word7')).toBeFalsy()
  })

  it('Must return false providing a password with space', () => {
    expect(validate('#Pass word7')).toBeFalsy()
  })
})
