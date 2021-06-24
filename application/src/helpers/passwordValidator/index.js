export const validate = pass => {
  if (pass === '' || pass === undefined) return false

  if (pass.length < 8 || pass.length > 32) return false

  const splitedPass = pass.split('')
  const required = {}
  for (const char of splitedPass) {
    if (char === ' ') return false

    if (char === char.toLowerCase() && char !== char.toUpperCase()) {
      required.lowerCaseLetter = true
      continue
    }

    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      required.upperCaseLetter = true
      continue
    }

    if (Number.isInteger(Number(char))) {
      required.number = true
      continue
    }

    if (char === '!' || char === '@' || char === '#' || char === '$' || char === '%') {
      required.specialChar = true
      continue
    }

    return false
  }

  if (!required.lowerCaseLetter || !required.upperCaseLetter || !required.number || !required.specialChar) return false

  return true
}

export default {
  validate
}
