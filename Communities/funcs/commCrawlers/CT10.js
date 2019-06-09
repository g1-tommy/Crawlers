var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT10',
    _site_name: '더쿠',
    _domain: 'http://www.theqoo.net',
    _site_thumb_url: 'https://cdn.theqoo.net/files/attach/images/24780/9b8a63ca56d4d27718caef1f6a34702d.png',
    _list_selector: 'table.theqoo_board_table > tbody > tr:not(.notice):not(.notice_expand)',
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
            if (list != undefined) {
                list.each(function() {
                    let item = {}
                    item['meta'] = {
                        code: meta._code,
                        site: meta._site_name,
                        site_thumb_url: meta._site_thumb_url
                    }
                    item['category'] = `정치토크|${$(this).find('td.cate > span').text()}`
                    meta._category = `정치토크|${$(this).find('td.cate > span').text()}`
                    item['title'] = $(this).find('td.title > a:first-child > span').text()
                    item['link'] = `${meta._domain}${$(this).find('td.title > a:first-child').attr('href')}`
                    if ($(this).find('td.time').text().trim().includes('.')) {
                        if ($(this).find('td.time').text().trim().split('.').length == 3) {
                        item['date'] = new Date(`20${$(this).find('td.time').text().trim()}`)
                        } else if ($(this).find('td.time').text().trim().split('.').length == 2) {
                        item['date'] = new Date(`${new Date().getFullYear()}.${$(this).find('td.time').text().trim()}`)
                        }
                    } else {
                        item['date'] = new Date()
                    }
                    items.push(flattener(item))
                })
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
                xlWriter.writeItems(meta._code, items)
            }
        }
    },
    ItemsByQuery (err, $, res, body) {
        if (!err) {
            // Not supported
        }
    },
}