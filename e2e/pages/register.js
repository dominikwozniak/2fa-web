const {generateEmail} = require("../utils/generateEmail");
const {generateName} = require("../utils/generateName");
const {generatePassword} = require("../utils/generatePassword");
const registerPageCommands = {
  /**
   * register with given email
   *
   * @param {string} email
   * @return {function} waits for the register action
   */
  async registerAccount (email = '') {
    const { registerButton } = this.elements
    const userEmail = email || generateEmail()
    const firstName = generateName()
    const lastName = generateName()
    const password = generatePassword()

    this.waitForElementVisible('@registerContainer')

    this.setValue('@firstNameInput', firstName)
    this.setValue('@lastNameInput', lastName)
    this.setValue('@emailInput', userEmail)
    this.setValue('@passwordInput', password)

    this.waitAndClick(registerButton.selector)
    this.waitForElementVisible('@loader')
    return this.waitForElementNotPresent('@emailInput')
  }
}

module.exports = {
  url: 'http://localhost:3000/signup',
  elements: {
    registerContainer: '.signup',
    emailInput: '.signup__form .column:nth-child(1) input',
    firstNameInput: '.signup__form .column:nth-child(2) .half-column:nth-child(1) input',
    lastNameInput: '.signup__form .column:nth-child(2) .half-column:nth-child(2) input',
    passwordInput: '.signup__form .column:nth-child(3) input',
    registerButton: '.signup button',
    loader: '.signup button.is-loading'
  },
  commands: [registerPageCommands]
};
