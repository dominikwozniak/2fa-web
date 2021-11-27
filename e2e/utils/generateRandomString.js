const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 7)
}

exports.generateRandomString = generateRandomString
