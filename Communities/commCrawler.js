const stdio = require('stdio')
const cheerio = require('cheerio-httpcli')
const cron = require('node-cron')
const colors = require('colors')
const communities = require('./funcs/commCrawlers')
const logger = require('./funcs/logger')

const timestamp = new Date().valueOf()
const ops = stdio.getopt({
    'site' : { key: 's', description: '수집할 커뮤니티 코드를 연속하여 입력하세요 (예: CT02 CT05 CT13)' },
    'all' : { key: 'a', description: '전체 사이트에 대한 최신 게시물을 수집합니다. (arguments 필요없음)' },
    'cron': { key: 'c', args: 1, description: colors.red('(-a 혹은 -s 옵션 필요) ') + '작업 반복 주기를 입력하세요(N분)' },
    'query' : { key: 'q', args: 1, description: colors.red('(-a 혹은 -s 옵션 필요) ') + '모니터링 키워드를 입력하세요(따옴표 포함 e.x. "키워드")' }
})

const commDefs = {
    CT01: {
        name: '일간베스트',
        defaultURL: 'http://www.ilbe.com/ilbe',
        queryParams: { "mid": "ilbe", "_filter" : "search", "search_target" : "title_content", "search_keyword" : (ops.query? ops.query : "") },
        queryURL: 'http://www.ilbe.com/',
        scraper: communities.CT01(timestamp)
    },
    CT02: {
        name: '일간베스트',
        defaultURL: 'http://www.ilbe.com/jjal',
        queryParams: { "mid": "jjal", "_filter" : "search", "search_target" : "title_content", "search_keyword" : (ops.query? ops.query : "") },
        queryURL: 'http://www.ilbe.com/',
        scraper: communities.CT02(timestamp)
    },
    CT03: {
        name: '오늘의유머(사회)',
        defaultURL: 'http://www.todayhumor.co.kr/board/list.php?table=society',
        queryParams: { "kind" : "search", "table" : "society", "search_table_name": "society", "keyfield" : "subject", "keyword" : (ops.query? ops.query : ""), "Submit" : "검색" },
        queryURL: 'http://www.todayhumor.co.kr/board/list.php',
        scraper: communities.CT03(timestamp)
    },
    CT04: {
        name: '오늘의유머(시사)',
        defaultURL: 'http://www.todayhumor.co.kr/board/list.php?table=sisa',
        queryParams: { "kind" : "search", "table" : "sisa", "search_table_name": "sisa", "keyfield" : "subject", "keyword" : (ops.query? ops.query : ""), "Submit" : "검색" },
        queryURL: 'http://www.todayhumor.co.kr/board/list.php',
        scraper: communities.CT04(timestamp)
    },
    CT05: {
        name: '클리앙',
        defaultURL: 'https://www.clien.net/service/group/community',
        queryParams: { "q" : (ops.query? ops.query : "") },
        queryURL: 'https://www.clien.net/service/search',
        scraper: communities.CT05(timestamp)
    },
    CT06: {
        name: 'MLB파크',
        defaultURL: 'http://mlbpark.donga.com/mp/b.php?p=1&m=list&b=bullpen&query=&select=&user=',
        queryParams: { "select": "sct", "m": "search", "b": "bullpen", "x": "0", "y": "0", "query" : (ops.query? ops.query : "") },
        queryURL: 'http://mlbpark.donga.com/mp/b.php',
        scraper: communities.CT06(timestamp)
    },
    CT07: {
        name: '와이고수',
        defaultURL: 'https://www.ygosu.com/community/issue',
        queryParams: [
            { "bid": "issue", "search" : (ops.query? ops.query : ""), "searcht" : "s", "add_search_log" : "Y", "x" : "0", "y" : "0" },
            { "bid": "free", "search" : (ops.query? ops.query : ""), "searcht" : "s", "add_search_log" : "Y", "x" : "1", "y" : "14" },
        ],
        queryURL: 'https://www.ygosu.com/community',
        scraper: communities.CT07(timestamp)
    },
    CT08: {
        name: '워마드',
        defaultURL: 'https://womad.life/r?page=1&r=latest',
        queryParams: { "query": (ops.query? ops.query : ""), "l": "title+content", "o": "id+desc" },
        queryURL: 'https://womad.life/s',
        scraper: communities.CT08(timestamp)
    },
    CT09: {
        name: '개드립',
        defaultURL: 'https://www.dogdrip.net/politics',
        queryParams: { "_filter": "search", "act": "", "vid": "", "mid": "politics", "category": "", "search_target": "title_content", "search_keyword": (ops.query? ops.query : "") },
        queryURL: 'https://www.dogdrip.net/',
        scraper: communities.CT09(timestamp)
    },
    CT10: {
        name: '더쿠',
        defaultURL: 'https://theqoo.net/politics',
        queryParams: '',
        queryURL: '',
        scraper: communities.CT10(timestamp)
    },
    CT11: {
        name: '에펨코리아',
        defaultURL: 'https://www.fmkorea.com/news',
        queryParams: { "vid": "", "mid": "news", "category": "", "search_target": "title_content", "search_keyword": (ops.query? ops.query : "") },
        queryURL: 'https://www.fmkorea.com/',
        scraper: communities.CT11(timestamp)
    },
    CT12: {
        name: '뽐뿌',
        defaultURL: 'http://www.ppomppu.co.kr/zboard/zboard.php?id=issue',
        queryParams: { "id": "issue", "category": "", "search_type": "sub_memo", "keyword": (ops.query? ops.query : "") },
        queryURL: 'http://www.ppomppu.co.kr/zboard/zboard.php',
        scraper: communities.CT12(timestamp)
    },
    CT13: {
        name: '루리웹',
        defaultURL: 'http://bbs.ruliweb.com/community/board/300148',
        queryParams: { "search_type": "subject_content", "search_key": (ops.query? ops.query : "") },
        queryURL: 'http://bbs.ruliweb.com/community/board/300148',
        scraper: communities.CT13(timestamp)
    },
    CT14: {
        name: 'SLR클럽',
        defaultURL: 'http://www.slrclub.com/bbs/zboard.php?id=free',
        queryParams: { "stype": "body", "keyword" : (ops.query? ops.query : "") },
        queryURL: 'http://m.hotge.co.kr/b/hot/slrclub',
        scraper: communities.CT14(timestamp)
    },
    CT15: {
        name: '보배드림',
        defaultURL: 'http://www.bobaedream.co.kr/list?code=freeb&pagescale=70',
        queryParams: { "code": "freeb", "pagescale": "70", "s_key": (ops.query? ops.query : "") },
        queryURL: 'http://www.bobaedream.co.kr/list',
        scraper: communities.CT15(timestamp)
    },
}

var messages = {
    welcome: `
    \x1b[44m======================================================================================\x1b[0m
    \x1b[44m                           커뮤니티 사이트 모니터링 프로그램                          \x1b[0m
    \x1b[44m                                                                                      \x1b[0m
    \x1b[44m                                 ©   2017 ~ 2019 전지원                               \x1b[0m
    \x1b[44m======================================================================================\x1b[0m
    `,
    request (key) {
        return key + " 게시글 데이터 수집 시작"
    },
    detour: "우회 접속 시도가 필요하여 추가 작업을 진행합니다.",
    errors: {
        taskInitError: "필수 파라미터 값이 필요합니다. 도움말이 필요하면 파라미터 --help를 입력하세요. (node commCrawler.js --help)",
        commDefError: "사이트명이 불분명합니다.",
        paramError: "파라미터 값이 올바르지 않습니다."
    },
    startedCron: "크롤링 작업 예약이 완료되었습니다. 수집을 시작합니다.",
}

logger.setTimestamp(timestamp)
logger.writeLog(logger.LOGLEVEL_EMPTY, messages.welcome)

function crawlAll() {
    for (let key in commDefs) {
        logger.writeLog(logger.LOGLEVEL_NOTICE, messages.request(key))
        if (ops.query){
            if (Array.isArray(commDefs[key]["queryParams"])) {
                for(let i in commDefs[key]["queryParams"]) {
                    cheerio.fetch(commDefs[key]["queryURL"], commDefs[key]["queryParams"][i], commDefs[key]["scraper"].ItemsByQuery)
                }
            } else {
                cheerio.fetch(commDefs[key]["queryURL"], commDefs[key]["queryParams"], commDefs[key]["scraper"].ItemsByQuery)
            }
        } else {
            cheerio.fetch(commDefs[key]["defaultURL"], {}, commDefs[key]["scraper"].AllItems)
        }
    }
}

function crawlPart() {
    for (s in ops.args) {
        logger.writeLog(logger.LOGLEVEL_NOTICE, messages.request(ops.args[s]))
        if(!(ops.args[s] in commDefs)) {
            logger.writeLog(logger.LOGLEVEL_ERROR, messages.errors.commDefError)
        } else {
            if(!commDefs[ops.args[s]]["bypass"]) {
                if(ops.query) {
                    if(Array.isArray(commDefs[ops.args[s]]["queryParams"])) {
                        for(let i in commDefs[ops.args[s]]["queryParams"]) {
                            cheerio.fetch(commDefs[ops.args[s]]["queryURL"], commDefs[ops.args[s]]["queryParams"][i], commDefs[ops.args[s]]["scraper"].ItemsByQuery)
                        }
                    } else {
                        cheerio.fetch(commDefs[ops.args[s]]["queryURL"], commDefs[ops.args[s]]["queryParams"], commDefs[ops.args[s]]["scraper"].ItemsByQuery)
                    }
                } else {
                    cheerio.fetch(commDefs[ops.args[s]]["defaultURL"], {}, commDefs[ops.args[s]]["scraper"].AllItems)
                }
            } else {
                logger.writeLog(logger.LOGLEVEL_NOTICE, messages.detour)
            }
        }
    }
}

if (!ops.site && !ops.all) {
    logger.writeLog(logger.LOGLEVEL_ERROR, messages.errors.taskInitError)
} else {
    if (ops.all) {
        if (!ops.cron) crawlAll()
        else {
            if (parseInt(ops.cron) > 0) {
                cron.schedule('*/'+ ops.cron + ' * * * *', crawlAll)
                logger.writeLog(logger.LOGLEVEL_SUCCEEDED, messages.startedCron)
            } else {
                logger.writeLog(logger.LOGLEVEL_ERROR, messages.errors.paramError)
            }
        }
    } else {
        if (ops.site) {
            if (!ops.cron) crawlPart()
            else {
                if (parseInt(ops.cron) > 0) {
                    logger.writeLog(logger.LOGLEVEL_SUCCEEDED, messages.startedCron)
                } else {
                    logger.writeLog(logger.LOGLEVEL_ERROR, messages.errors.paramError)
                }
            }
        }
    }
}