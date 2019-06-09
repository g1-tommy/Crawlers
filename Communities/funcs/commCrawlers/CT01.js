var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT01',
    _site_name: '일간베스트',
    _category: '일베',
    _domain: 'http://www.ilbe.com',
    _site_thumb_url: 'https://ncache.ilbe.com/files/attach/new/20150731/377678/1079468924/6299613777/bfaf177313db97d71fadaaa9354b3643.PNG',
    _list_selector: '.board-body > li:not([class])',
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
                let today = new Date()
                let tmpDate = $(this).find('.date').text().split(':')
                item['meta'] = {
                    code: meta._code,
                    site: meta._site_name,
                    site_thumb_url: meta._site_thumb_url
                }
                item['title'] = $(this).find('.title > .subject').text()
                item['author'] = $(this).find(".nick a").text()
                try {
                    let url = new URL($(this).find('.title > .subject').attr('href'))
                    item['post_id'] = url.pathname.split('/')[url.pathname.split('/').length-1]
                    item['date'] = new Date($(this).find('.date').text()).toISOString()
                } catch (e) {
                    item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], tmpDate[2])
                }
                if (!isNaN(parseInt($(this).find('.recomm').text()))) {
                    item['recommends'] = parseInt($(this).find('.recomm').text())
                } else {
                    item['recommends'] = 0
                }
                item['link'] = `${meta._domain}${$(this).find('.title > .subject').attr('href')}`
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        } else {
            logger.writeLog(logger.LOGLEVEL_ERROR, `오류로 인해 ${meta._code} 데이터가 수집되지 않았습니다.\n${err}`)
        }
    },
    ItemsByQuery (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector)
            list.each(function () {
                let item = {}
                let today = new Date()
                let tmpDate = $(this).find('.date').text().split(':')
                item['meta'] = {
                    code: meta._code,
                    site: meta._site_name,
                    site_thumb_url: meta._site_thumb_url
                }
                item['category'] = meta._category
                item['title'] = $(this).find('.title > .subject').text()
                item['author'] = $(this).find(".nick a").text()
                try {
                    let url = new URL($(this).find('.title > .subject').attr('href'))
                    item['post_id'] = url.pathname.split('/')[url.pathname.split('/').length-1]
                    item['date'] = new Date($(this).find('.date').text()).toISOString()
                } catch (e) {
                    item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], tmpDate[2])
                }
                if (!isNaN(parseInt($(this).find('.recomm').text()))) {
                    item['recommends'] = parseInt($(this).find('.recomm').text())
                } else {
                    item['recommends'] = 0
                } 
                item['link'] = `${meta._domain}${$(this).find('.title > .subject').attr('href')}`
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        } else {
            logger.writeLog(logger.LOGLEVEL_ERROR, `오류로 인해 ${meta._code} 데이터가 수집되지 않았습니다.\n${err}`)
        }
    }
}