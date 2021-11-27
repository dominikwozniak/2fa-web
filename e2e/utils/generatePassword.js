const faker = require('faker')
const { generateRandomString } = require('./generateRandomString');

const generatePassword = () => {
  return generateRandomString() + '_!@' + faker.internet.password()
}

exports.generatePassword = generatePassword
