const logger = require('../utils/logger');
let loginPage, accountPage, editPage

module.exports = {
  before: (browser, done) => {
    logger.info('Start Edit Profile')
    const {page} = browser
    loginPage = page.login()
    accountPage = page.account()
    editPage = page.edit()
    loginPage.navigate()
    done();
  },

  after: (browser, done) => {
    logger.info('Finished Edit Profile')
    browser.end();
    done();
  },

  'Maximize window and assert title': browser => {
    return browser.maximizeWindow()
        .assert
        .title('Sign in | Authela')
  },

  'Log in': () => {
    return loginPage.logIn()
  },

  'Assert edit page': () => {
    editPage.navigate()
    return editPage.assertAccount()
  },

  'Edit profile': () => {
    return editPage.editAccount()
  },

  'Assert edited account page': (browser) => {
    accountPage.navigate()
    browser.refresh()
    return accountPage.assertChangedAccount()
  },

  'Restore profile data': () => {
    editPage.navigate()
    return editPage.restoreAccount()
  },

  'Assert account page': (browser) => {
    accountPage.navigate()
    browser.refresh()
    return accountPage.assertAccount()
  },
}
