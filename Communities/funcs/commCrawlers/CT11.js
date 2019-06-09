var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT11',
    _site_name: '에펨코리아',
    _category: '짤방/시사',
    _domain: 'http://www.fmkorea.com',
    _site_thumb_url: 'https://image.fmkorea.com/logos/fmkorealogo2.png',
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
                    item['category'] = meta._category
                    item['author'] = $(this).find('td.author span a').text().trim()
                    item['title'] = $(this).find('td.title a:first-child').text().trim()
                    item['link'] = `${meta._domain}${$(this).find('td.title a:first-child').attr('href')}`
                    try {
                        let url = new URL(`${meta._domain}${$(this).find('td.title a:first-child').attr('href')}`)
                        item['post_id'] = url.searchParams.get('document_srl')
                    } catch (e) {}
                    if ($(this).find('td.time').text().trim().includes('.')) {
                        item['date'] = new Date($(this).find('td.time').text().trim().replace('.', '-')).toISOString()
                    } else {
                        item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], 0)
                    }
                    if ($(this).find('td.m_no_voted').text().trim().length > 0) {
                        item['recommends'] = parseInt($(this).find('td.m_no_voted').text().trim())
                    } else {
                        item['recommends'] = 0
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
            var list = $('tbody > tr:not(.notice)')
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
                    item['category'] = meta._category
                    item['author'] = $(this).find('td.author span a').text()
                    item['title'] = $(this).find('td.title a:first-child').text().trim()
                    item['link'] = `${meta._domain}${$(this).find('td.title a:first-child').attr('href')}`
                    try {
                        let url = new URL(`${meta._domain}${$(this).find('td.title a:first-child').attr('href')}`)
                        item['post_id'] = url.searchParams.get('document_srl')
                    } catch (e) {}
                    if ($(this).find('td.time').text().trim().includes('.')) {
                        item['date'] = new Date($(this).find('td.time').text().trim().replace('.', '-')).toISOString()
                    } else {
                        item['date'] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], 0)
                    }
                    if ($(this).find('td.m_no_voted').text().trim().length > 0) {
                        item['recommends'] = parseInt($(this).find('td.m_no_voted').text().trim())
                    } else {
                        item['recommends'] = 0
                    }
                    items.push(flattener(item))
                })
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
                xlWriter.writeItems(meta._code, items)
            }
        }
    },
}