const logger = require('../utils/logger');
let loginPage, accountPage, homePage

module.exports = {
  before: (browser, done) => {
    logger.info('Start Login To Account')
    const {page} = browser
    loginPage = page.login()
    accountPage = page.account()
    homePage = page.homepage()
    homePage.navigate()
    done();
  },

  after: (browser, done) => {
    logger.info('Finished Login To Account')
    browser.end();
    done();
  },

  'Maximize window and assert title': browser => {
    return browser.maximizeWindow()
      .assert
      .title('Home | Authela')
  },

  'Go to login page': async () => {
    return loginPage
      .navigate()
      .assert
      .title('Sign in | Authela')
  },

  'Log in': () => {
    return loginPage.logIn()
  },

  'Assert account page': () => {
    return accountPage.assertAccount()
  },
}
