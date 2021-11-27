const faker = require('faker')
const { generateRandomString } = require('./generateRandomString');

const generateEmail = () => {
  return generateRandomString() + faker.internet.email()
}

exports.generateEmail = generateEmail
