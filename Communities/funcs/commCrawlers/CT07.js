var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT07',
    _site_name: '와이고수',
    _category: '정치/토론',
    _domain: 'http://www.ygosu.com',
    _site_thumb_url: 'https://www.ygosu.com/images/logo_2014.gif',
    _list_selector: ".bd_list tbody tr:not('.notice')",
}

module.exports = {
  _timestamp: null,
  _list_selector: ".bd_list tbody tr:not('.notice')",
    _meta: meta,
    setTimestamp (timestamp) {
      this._timestamp = timestamp
  },
    AllItems (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector)
            list.each(function () {
                if ($(this).find('td').attr('colspan') !== "99") {
                    var item = {}
                    item['meta'] = {
                      code: meta._code,
                      site: meta._site_name,
                      site_thumb_url: meta._site_thumb_url
                    }
                    let today = new Date()
                    let tmpDate = $(this).find('td.date').text().split(':')
                    item['category'] = meta._category
                    item['post_id'] = parseInt($(this).find('td.no').text())
                    item['title'] = $(this).find('td.tit a').text()
                    if ($(this).find('td.tit a').attr('href').includes('javascript')) {
                      item['link'] = ''
                    } else {
                      item['link'] = `${meta._domain}${$(this).find('td.tit a').attr('href')}`
                    }
                    item['author'] = $(this).find('td.name a').text()
                    if ($(this).find('td.date').text().includes('.')) {
                      item['date'] = new Date($(this).find('td.date').text().replace('.', '-')).toISOString()
                    } else {
                      item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], tmpDate[2])
                    }
                    item['views'] = parseInt($(this).find('td.read').text())
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
                if ($(this).find('td').attr('colspan') !== "99") {
                    var item = {}
                    item['meta'] = {
                      code: meta._code,
                      site: meta._site_name,
                      site_thumb_url: meta._site_thumb_url
                    }
                    let today = new Date()
                    let tmpDate = $(this).find('td.date').text().split(':')
                    item['category'] = meta._category
                    item['post_id'] = parseInt((new URL(`${meta._domain}${$(this).find('td.tit a').attr('href')}`)).pathname.split('/')[3])
                    item['title'] = $(this).find('td.tit a').text()
                    if ($(this).find('td.tit a').attr('href').includes('javascript')) {
                      item['link'] = ''
                    } else {
                      item['link'] = `${meta._domain}${$(this).find('td.tit a').attr('href')}`
                    }
                    item['author'] = $(this).find('td.name a').text()
                    if ($(this).find('td.date').text().includes('.')) {
                      item['date'] = new Date($(this).find('td.date').text().replace('.', '-')).toISOString()
                    } else {
                      item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], tmpDate[2])
                    }
                    item['views'] = parseInt($(this).find('td.read').text())
                    if (!isNaN(item['views'])) {
                      items.push(flattener(item))
                    }
                }
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    },
} 