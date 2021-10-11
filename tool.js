const chalk = require('chalk')

class Print {
  success(msg) {
    console.log(
      chalk.green(
        msg
      )
    )
  }
  error(msg) {
    console.error(
      chalk.red(
        msg
      )
    )
  }
  info(msg) {
    console.info(
      chalk.blue(
        msg
      )
    )
  }
}

module.exports = {
  Print
}
