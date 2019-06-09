var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT15',
    _site_name: '보배드림',
    _domain: 'http://www.bobaedream.com',
    _site_thumb_url: 'http://image.bobaedream.co.kr/renew2017/assets/images/layout/header_logo_v3.png',
    _list_selector: ".clistTable02 tbody tr[itemscope]",
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
                var item = new Object()
                let today = new Date()
                let tmpDate = $(this).find("td.date").text().split(":")
                item['meta'] = {
                    site: meta._site_name,
                    site_thumb_url: meta._site_thumb_url,
                    code: meta._code
                }
                item["post_id"] = parseInt($(this).find("td.num01").text())
                item["title"] = $(this).find("a.bsubject").text()
                item["link"] = `${meta._domain}${$(this).find("a.bsubject").attr("href")}`
                item["author"] = $(this).find("span.author").attr("title")
                item["date"] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], 0)
                item["recommends"] = parseInt($(this).find("td.recomm > font:first-child").text())
                item["views"] = parseInt($(this).find("td.count").text())
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
                var item = new Object()
                let today = new Date()
                let tmpDate = $(this).find("td.date").text().split(":")
                item['meta'] = {
                    site: meta._site_name,
                    site_thumb_url: meta._site_thumb_url,
                    code: meta._code
                }
                item["post_id"] = parseInt($(this).find("td.num01").text())
                item["title"] = $(this).find("a.bsubject").text()
                item["link"] = `${meta._domain}${$(this).find("a.bsubject").attr("href")}`
                item["author"] = $(this).find("span.author").attr("title")
                item["date"] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], 0)
                item["recommends"] = parseInt($(this).find("td.recomm > font:first-child").text())
                item["views"] = parseInt($(this).find("td.count").text())
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    }
}