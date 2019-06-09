var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT05',
    _site_name: '클리앙',
    _domain: 'http://www.clien.net',
    _site_thumb_url: 'https://img.telegram.me/u/ae13ba5e4fa/5a43830dc29877caf3f62b.jpg',
    _list_selector: ".list_item.symph_row",
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
                let item = {}
                item['meta'] = {
                  code: meta._code,
                  site: meta._site_name,
                  site_thumb_url: meta._site_thumb_url
                }
                item['category'] = $(this).find('.list_subject > .shortname').text()
                meta._category = $(this).find('.list_subject > .shortname').text()
                item['title'] = $(this).find('.list_subject > .subject_fixed').text()
                item['date'] = new Date($(this).find('.list_time .timestamp').text()).toISOString()
                item['link'] = `${meta._domain}${$(this).find('.list_subject').attr('href')}`
                item['likes'] = parseInt($(this).find('[data-role=list-like-count] span').text())
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    },
    ItemsByQuery (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector)
            list.each(function () {
                let item = {}
                item['meta'] = {
                    code: meta._code,
                    site: meta._site_name,
                    site_thumb_url: meta._site_thumb_url
                }
                item['category'] = $(this).find('.list_subject button').text()
                meta._category = $(this).find('.list_subject button').text()
                item['title'] = $(this).find('.list_subject a').text()
                item['date'] = new Date($(this).find('.time > span.timestamp').text()).toISOString()
                item['link'] = `${meta._domain}${$(this).find('.list_subject a').attr('href')}`
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    },
}