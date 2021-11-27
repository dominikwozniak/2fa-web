const { safariEnvs } = require('config')

module.exports = class WaitAndClick {
  async command(selector) {
    await this.api.waitForElementPresent(selector)
    if (safariEnvs.some(env => process.argv.includes(env))) {
      return this.api.execute(`document.querySelector('${selector}').click()`)
    }

    return this.api.click(selector)
  }
}
