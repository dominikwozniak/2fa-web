const { customer } = require('config')

const accountCommands = {
  assertAccount() {
    this.waitForElementVisible('@editProfileContainer')

    this.waitForElementVisible('@firstName')
    this.waitForElementVisible('@lastName')
    this.waitForElementVisible('@saveButton')
  },

  editAccount() {
    const { saveButton } = this.elements
    const firstName = customer.changed.firstName
    const lastName = customer.changed.lastName

    this.clearValue('@firstName')
    this.clearValue('@lastName')

    this.setValue('@firstName', firstName)
    this.setValue('@lastName', lastName)

    this.waitAndClick(saveButton.selector)
    this.waitForElementVisible('@popup')
  },

  restoreAccount() {
    const { saveButton } = this.elements
    const firstName = customer.existing.firstName
    const lastName = customer.existing.lastName

    this.clearValue('@firstName')
    this.clearValue('@lastName')

    this.setValue('@firstName', firstName)
    this.setValue('@lastName', lastName)

    this.waitAndClick(saveButton.selector)
    this.waitForElementVisible('@popup')
  }
}

module.exports = {
  url: 'http://localhost:3000/edit-profile',
  elements: {
    editProfileContainer: '.edit-profile',
    firstName: '.edit-profile input[name="firstName"]',
    lastName: '.edit-profile input[name="lastName"]',
    saveButton: '.edit-profile__input button[type="submit"]',
    popup: '.Toastify__toast-body'
  },
  commands: [accountCommands]
};
