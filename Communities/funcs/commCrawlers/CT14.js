var xlWriter = require('../writeExcel')
const logger = require('../logger')
const flattener = require('../nestedJSONFlattener')
const colors = require('colors')
const UTCSeoul = 9
var items = new Array()
var meta = {
    _code: 'CT14',
    _site_name: 'SLR클럽',
    _domain: 'http://www.slrclub.com',
    _site_thumb_url: 'http://media.slrclub.com/main/2015/gnb/logo_slr.png',
    _list_selector: {
        'all': ".bbs_tbl_layout tbody tr:not(:first-child)",
        'partial': ".listLinkDate ul li"
    },
}

module.exports = {
    _timestamp: null,
    _meta: meta,
    setTimestamp (timestamp) {
        this._timestamp = timestamp
    },
    AllItems (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector['all'])
            list.each(function () {
                var item = new Object()
                let today = new Date()
                let tmpDate = $(this).find("td.list_date.no_att").text().split(":")
                item['meta'] = {
                    site: meta._site_name,
                    code: meta._code,
                    site_thumb_url: meta._site_thumb_url
                }
                item["post_id"] = parseInt($(this).find("td.list_num.no_att").text())
                item["title"] = $(this).find("td.sbj a").text()
                item["link"] = `${meta._domain}${$(this).find("td.sbj a").attr("href")}`
                item["author"] = $(this).find("td.list_name span").text()
                item["date"] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(tmpDate[0]) + UTCSeoul, tmpDate[1], tmpDate[2])
                item["recommends"] = parseInt($(this).find("td.list_vote.no_att").text())
                item["views"] = parseInt($(this).find("td.list_click.no_att").text())
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    },
    ItemsByQuery (err, $, res, body) {
        if (!err) {
            var list = $(meta._list_selector['partial'])
            list.each(function () {
                let item = new Object()
                item['meta'] = {
                    site: meta._site_name,
                    code: meta._code,
                    site_thumb_url: meta._site_thumb_url
                }
                item["title"] = $(this).find("a[title] span[itemprop='name']").text()
                item["link"] = $(this).find("a[title]").attr("href")
                item["author"] = $(this).find("span[itemprop='author'] span[itemprop='name']").text()
                item["date"] = new Date($(this).find("span.ltitle meta[itemprop='datePublished']").attr('content'))
                item["views"] = parseInt($(this).find("span[itemprop='ratingCount']").text())
                items.push(flattener(item))
            })
            logger.writeLog(logger.LOGLEVEL_SUCCEEDED, `${colors.red(meta._site_name)} - ${colors.magenta(meta._category)} ${colors.yellow(items.length)}개의 게시물이 수집되었습니다.`)
            xlWriter.writeItems(meta._code, items)
        }
    }
}