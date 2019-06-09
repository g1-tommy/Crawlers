var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT06',
    _site_name: 'MLB파크',
    _domain: 'http://mlbpark.donga.com',
    _site_thumb_url: 'http://image.donga.com/challenge/mlbpark/images/img_logo.gif',
    _list_selector: ".tbl_type01 > tbody > tr",
}

module.exports = {
    _timestamp: null,
    _meta: meta,
    setTimestamp (timestamp) {
        this._timestamp = timestamp
    },
    AllItems (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector)
            list.each(function () {
                if ($(this).find('.bullpen').children().remove().end().text() !== '') {
                    var item = {}
                    item['meta'] = {
                      code: meta._code,
                      site: meta._site_name,
                      site_thumb_url: meta._site_thumb_url
                    }
                    let today = new Date()
                    item['category'] = $(this).find('span.word_bullpen').text()
                    meta._category = $(this).find('span.word_bullpen').text()
                    item['title'] = $(this).find('.bullpen').children().remove().end().text()
                    item['link'] = $(this).find('a.bullpenbox').attr('href')
                    item['author'] = $(this).find('span.nick').text()
                    if ($(this).find('span.date').text().includes(':')) {
                      let tmpDate = $(this).find('span.date').text().split(':')
                      item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], tmpDate[2])
                    } else {
                      item['date'] = new Date($(this).find('span.date').text())
                    }
                    item['views'] = parseInt($(this).find('span.viewV').text())
                    items.push(flattener(item))
                }
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    },
    ItemsByQuery (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector)
            list.each(function () {
                var item = {}
                item['meta'] = {
                    code: meta._code,
                    site: meta._site_name,
                    site_thumb_url: meta._site_thumb_url
                }
                let today = new Date()
                item['category'] = $(this).find('span.word_bullpen').text()
                meta._category = $(this).find('span.word_bullpen').text()
                item['title'] = $(this).find('span.bullpen').children().remove().end().text()
                item['link'] = $(this).find('a.bullpenbox').attr('href')
                item['author'] = $(this).find('span.nick').text()
                if ($(this).find('span.date').text().includes(':')) {
                    let tmpDate = $(this).find('span.date').text().split(':')
                    item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], tmpDate[2])
                } else {
                    item['date'] = new Date($(this).find('span.date').text())
                }
                item['views'] = parseInt($(this).find('span.viewV').text())
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    },
} 