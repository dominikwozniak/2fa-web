const logger = require('../utils/logger');
let homePage, registerPage, loginPage

module.exports = {
  before: (browser, done) => {
    logger.info('Start Create Account')
    const { page } = browser
    homePage = page.homepage()
    registerPage = page.register()
    loginPage = page.login()
    homePage.navigate();
    done();
  },

  after: (browser, done) => {
    logger.info('Finished Create Account')
    browser.end();
    done();
  },

  'Maximize window and assert title': browser => {
    return browser.maximizeWindow()
      .assert
      .title('Home | Authela')
  },

  'Go to register page': async () => {
    return registerPage
      .navigate()
      .assert
      .title('Sign up | Authela')
  },

  'Register with random email': async () => {
    return registerPage.registerAccount()
  },
}