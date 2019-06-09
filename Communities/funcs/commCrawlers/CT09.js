var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT09',
    _site_name: '개드립',
    _category: '정치사회판',
    _domain: 'http://www.dogdrip.net',
    _site_thumb_url: 'https://www.dogdrip.net/files/attach/images/174688197/8ec7b0c15a0f2468744a22bae1d73a47.gif',
    _list_selector: 'table.ed tbody tr:not(.notice)',
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
                    let date = new Date()
                    item['meta'] = {
                        code: meta._code,
                        site: meta._site_name,
                        site_thumb_url: meta._site_thumb_url
                    }
                    item['category'] = meta._category
                    item['title'] = $(this).find('td.title > a > span.ed.title-link').text()
                    item['link'] = `${$(this).find('td.title > a').attr('href')}`
                    item['author'] = $(this).find('td.author > a').children().remove().end().text().trim()
                    if ($(this).find('td.time').text().includes('전')) {
                        if ($(this).find('td.time').text().includes('일')) {
                        item['date'] = date.setDate(date.getDate() - parseInt($(this).find('td.time').text().split(' ')[0]))
                        } else {
                        item['date'] = new Date()
                        }
                    } else {
                        item['date'] = new Date($(this).find('td.time').text())
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
            var list = $(meta._list_selector)
            if (list != undefined) {
                list.each(function () {
                    let item = {}
                    let date = new Date()
                    item['meta'] = {
                    code: meta._code,
                    site: meta._site_name,
                    site_thumb_url: meta._site_thumb_url
                    }
                    item['category'] = meta._category
                    item['title'] = $(this).find('td.title > a > span.ed.title-link').text()
                    item['link'] = `${meta._domain}${$(this).find('td.title > a').attr('href')}`
                    item['author'] = $(this).find('td.author > a').children().remove().end().text().trim()
                    if ($(this).find('td.time').text().includes('전')) {
                    if ($(this).find('td.time').text().includes('일')) {
                        item['date'] = date.setDate(date.getDate() - parseInt($(this).find('td.time').text().split(' ')[0]))
                    } else {
                        item['date'] = new Date()
                    }
                    } else {
                    item['date'] = new Date($(this).find('td.time').text())
                    }
                    items.push(flattener(item))
                })
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
                xlWriter.writeItems(meta._code, items)
            }
        }
    },
}