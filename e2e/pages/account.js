const { customer } = require('config')

const accountCommands = {
  assertAccount() {
    const firstName = customer.existing.firstName
    const lastName = customer.existing.lastName
    const email = customer.existing.email

    this.waitForElementVisible('@username')
    this.waitForElementVisible('@email')

    this.assert.containsText('@username', `${firstName} ${lastName}`)
    this.assert.containsText('@email', email)
  },

  assertChangedAccount() {
    const firstName = customer.changed.firstName
    const lastName = customer.changed.lastName

    this.waitForElementVisible('@username')

    this.assert.containsText('@username', `${firstName} ${lastName}`)
  }
}

module.exports = {
  url: 'http://localhost:3000/dashboard',
  elements: {
    username: '.header__content h3',
    email: '.header__content h4',
  },
  commands: [accountCommands]
};
