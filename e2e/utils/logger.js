const logger = require('pino')
const dayjs = require('dayjs')

module.exports = log = logger({
  prettyPrint: true,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
})
