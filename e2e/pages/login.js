const { customer } = require('config')

const loginCommands = {
  /**
   * log in with given email from config
   *
   * @return {function} waits for the login action
   */
  async logIn() {
    const { loginButton } = this.elements
    const userEmail = customer.existing.email
    const password = customer.existing.password

    this.setValue('@emailInput', userEmail)
    this.setValue('@passwordInput', password)

    this.waitAndClick(loginButton.selector)
    return this.waitForElementNotPresent('@emailInput')
  }
}

module.exports = {
  url: 'http://localhost:3000/signin',
  elements: {
    loginContainer: '.signin',
    emailInput: '.signin input[type="email"]',
    passwordInput: '.signin input[type="password"]',
    loginButton: '.signin button',
  },
  commands: [loginCommands]
};
