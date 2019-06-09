var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
var items = new Array()
var meta = {
    _code: 'CT03',
    _site_name: '오늘의유머',
    _category: '사회',
    _domain: 'http://www.todayhumor.co.kr',
    _site_thumb_url: 'http://m.todayhumor.co.kr/images/toplogo/toplogo_m.gif',
    _list_selector: ".table_list > tbody > tr.view",
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
                item['category'] = meta._category
                item['post_id'] = $(this).find('.no > a').text()
                item['title'] = $(this).find('.subject > a').text()
                item['link'] = `${meta._domain}${$(this).find('.subject > a').attr('href')}`
                item['author'] = $(this).find('.name > a').text()
                item['views'] = $(this).find('.hits').text()
                item['recommends'] = $(this).find('.oknok').text()
                item['date'] = new Date(`20${$(this).find('.date').text()}`.replace(/\//gi, '-')).toISOString()
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
                item['category'] = meta._category
                item['post_id'] = $(this).find('.no > a').text()
                item['title'] = $(this).find('.subject > a').text()
                item['link'] = `${meta._domain}${$(this).find('.subject > a').attr('href')}`
                item['author'] = $(this).find('.name > a').text()
                item['views'] = $(this).find('.hits').text()
                item['recommends'] = $(this).find('.oknok').text()
                item['date'] = new Date(`20${$(this).find('.date').text().replace('/', '-')}`).toISOString()
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    }
}