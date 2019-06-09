var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT12',
    _site_name: '뽐뿌',
    _category: '이슈/정치/토론',
    _domain: 'http://www.ppomppu.co.kr',
    _site_thumb_url: 'http://img.ppomppu.co.kr/images/main/201111/logo_small.gif',
    _list_selector: 'table.title_bg tbody tr[class^=list]:not(.list_notice)',
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
                    item['meta'] = {
                        code: meta._code,
                        site: meta._site_name,
                        site_thumb_url: meta._site_thumb_url
                    }
                    item['category'] = meta._category
                    item['author'] = $(this).find('td:nth-child(2) span.list_name').text().trim()
                    item['post_id'] = parseInt($(this).find('td:first-child').text())
                    item['title'] = $(this).find('font.list_title').text()
                    item['link'] = `${meta._domain}/zboard/${$(this).find('td:nth-child(3) a').attr('href')}`
                    item['date'] = new Date(`20${$(this).find('td:nth-child(4)').attr('title').replace(/\./gi, '-')}`).toISOString()
                    item['recommends'] = $(this).find('td:nth-child(5)').text().replace(' ', '').split('-')[0]
                    item['views'] = $(this).find('td:last-child').text()
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
                    item['category'] = meta._category
                    item['author'] = $(this).find('td:nth-child(2) span.list_name').text().trim()
                    item['post_id'] = parseInt($(this).find('td:first-child').text())
                    item['title'] = $(this).find('font.list_title').text()
                    item['link'] = `${meta._domain}/zboard/${$(this).find('td:nth-child(3) a').attr('href')}`
                    item['date'] = new Date(`20${$(this).find('td:nth-child(4)').attr('title').replace(/\./gi, '-')}`).toISOString()
                    item['recommends'] = $(this).find('td:nth-child(5)').text().replace(' ', '').split('-')[0]
                    item['views'] = $(this).find('td:last-child').text()
                    items.push(flattener(item))
                })
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
                xlWriter.writeItems(meta._code, items)
            }
        }
    },
}