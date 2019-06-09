var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT13',
    _site_name: '루리웹',
    _domain: 'http://www.ruliweb.com',
    _site_thumb_url: 'https://img.ruliweb.com/img/2016/ruli_400x210.png',
    _list_selector: 'tbody > tr:not(.notice)',
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
                list.each(function () {
                    let item = {}
                    let today = new Date()
                    let tmpDate = $(this).find('td.time').text().trim().split(':')
                    item['meta'] = {
                        code: meta._code,
                        site: meta._site_name,
                        site_thumb_url: meta._site_thumb_url
                    }
                    item['category'] = `정치/${$(this).find('.divsn a').text()}`
                    meta._category = `정치/${$(this).find('.divsn a').text()}`
                    item['author'] = $(this).find('td.writer a').text()
                    item['title'] = $(this).find('a.deco').text().trim()
                    item['link'] = $(this).find('a.deco').attr('href')
                    item['post_id'] = $(this).find('#id').text().trim()
                    if ($(this).find('td.time').text().trim().includes('.')) {
                        item['date'] = new Date($(this).find('td.time').text().trim().replace('.', '-')).toISOString()
                    } else {
                        item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], 0)
                    }
                    item['recommends'] = $(this).find('.hit').text().trim()
                    items.push(flattener(item))
                })
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
                xlWriter.writeItems(meta._code, items)
            }
        }
    },
    ItemsByQuery (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector)
            if (list != undefined) {
                list.each(function () {
                    let item = {}
                    let today = new Date()
                    let tmpDate = $(this).find('td.time').text().trim().split(':')
                    item['meta'] = {
                        code: meta._code,
                        site: meta._site_name,
                        site_thumb_url: meta._site_thumb_url
                    }
                    item['category'] = `정치/${$(this).find('.divsn a').text()}`
                    meta._category = `정치/${$(this).find('.divsn a').text()}`
                    item['author'] = $(this).find('td.writer a').text()
                    item['title'] = $(this).find('a.deco').text().trim()
                    item['link'] = $(this).find('a.deco').attr('href')
                    item['post_id'] = $(this).find('#id').text().trim()
                    if ($(this).find('td.time').text().trim().includes('.')) {
                        item['date'] = new Date($(this).find('td.time').text().trim().replace('.', '-')).toISOString()
                    } else {
                        item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], 0)
                    }
                    item['recommends'] = $(this).find('.hit').text().trim()
                    items.push(flattener(item))
                })
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
                xlWriter.writeItems(meta._code, items)
            }
        }
    },
}