const fs = require('fs')
const colors = require('colors')

module.exports = {
    LOGLEVEL_ERROR: 'ERROR',
    LOGLEVEL_NOTICE: 'NOTICE',
    LOGLEVEL_SUCCEEDED: 'SUCCEEDED',
    LOGLEVEL_EMPTY: '',
    _timestamp: null,
    writeLog (logLevel, message) {
        let fileNameFormat = `log-${this._timestamp}.log`
        let timestamp = new Date().toISOString()
        let msgFormat = `[${timestamp}][${logLevel}] ${message}\n`
        let printFormat = `${colors.green(`[${timestamp}]`)}${colors.bgYellow(`[${logLevel}]`)} ${message}`
        let targetDir = __dirname + '/../logs/'
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir)
        }
        if (logLevel == this.LOGLEVEL_EMPTY) {
            console.log(message)
        } else {
            fs.appendFileSync(targetDir + fileNameFormat, msgFormat)
            console.log(printFormat)
        }
    },
    setTimestamp (timestamp) {
        this._timestamp = timestamp
        console.log(colors.bgCyan(`[로그 생성] Created log 'log-${this._timestamp}.log in the log directory.'`))
    }
}