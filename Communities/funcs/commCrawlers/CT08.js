var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT08',
    _site_name: '워마드',
    _domain: 'https://www.womad.life',
    _site_thumb_url: 'https://womad.life/assets/wm_logo_1-143848808c6f595a02265a86eb293aed2ab0ca44b50a95d940f6fc1ddcd8ccae.png',
    _list_selector: '.basic > tbody > tr',
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
                    item['post_id'] = parseInt($(this).find('td.number').text())
                    if ($(this).find('td.title a span.category-text').text().length == 0) {
                        item['category'] = $(this).find('td:nth-child(2)').text()
                        meta._category = $(this).find('td:nth-child(2)').text()
                        item['title'] = $(this).find('td.title a').text().split('\n')[1].trim()
                    } else {
                        item['category'] = $(this).find('td.title a span.category-text').text()
                        item['title'] = $(this).find('td.title a').children().remove().end().text().trim()
                    }
                    item['link'] = `${meta._domain}${$(this).find('td:nth-child(3) a').attr('href')}`
                    item['author'] = $(this).find('td:nth-child(4)').text()
                    let today = new Date()
                    let date = $(this).find('td:nth-child(5)').text()
                    if (date.includes(':')) {
                        item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(date[0]) + UTCSeoul, date[1])
                    } else if (date.includes('.')) {
                        item['date'] = new Date(`${date.split('.')[1]} ${date.split('.')[2]} 20${date.split('.')[0]}`)
                    }
                    item['views'] = parseInt($(this).find('td:nth-child(6)').text().replace(',', ''))
                    item['recommends'] = parseInt($(this).find('td:nth-child(7)').text().replace(',', ''))
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
                    item['meta'] = {
                        code: meta._code,
                        site: meta._site_name,
                        site_thumb_url: meta._site_thumb_url
                    }
                    item['post_id'] = parseInt($(this).find('td:first-child').text())
                    item['category'] = $(this).find('td:nth-child(2)').text()
                    meta._category = $(this).find('td:nth-child(2)').text()
                    item['title'] = $(this).find('td:nth-child(3) a').text().split('\n')[1].trim()
                    item['link'] = `${meta._domain}${$(this).find('td:nth-child(3) a').attr('href')}`
                    item['author'] = $(this).find('td:nth-child(4)').text()
                    let today = new Date()
                    let date = $(this).find('td:nth-child(5)').text()
                    if (date.includes(':')) {
                        item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(date[0]) + UTCSeoul, date[1])
                    } else if (date.includes('.')) {
                        item['date'] = new Date(`${date.split('.')[1]} ${date.split('.')[2]} 20${date.split('.')[0]}`)
                    }
                    item['views'] = parseInt($(this).find('td:nth-child(6)').text().replace(',', ''))
                    item['recommends'] = parseInt($(this).find('td:nth-child(7)').text().replace(',', ''))
                    items.push(flattener(item))
                })
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
                xlWriter.writeItems(meta._code, items)
            }
        }
    },
}