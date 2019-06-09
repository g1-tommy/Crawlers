const Excel = require('json-to-csv')
const fs = require('fs')
const logger = require('./logger')
const resolve = require('path').resolve

module.exports = {
    writeItems (code, items) {
        let targetDir = __dirname + '/../results/'
        let fileName = targetDir + code + '-' + new Date().valueOf() + '.csv'
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir)
        }
        if (items.length !== 0) {
            Excel(items, fileName).then(() => {
                logger.writeLog(logger.LOGLEVEL_NOTICE, `크롤링된 결과는 ${resolve(targetDir)} 폴더에 저장됩니다.`)
            }).catch((error) => {
                logger.writeLog(logger.LOGLEVEL_ERROR, error)
            })
        }
    }
}