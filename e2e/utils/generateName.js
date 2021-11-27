const faker = require('faker')

const generateName = () => {
  return faker.name.firstName()
}

exports.generateName = generateName
