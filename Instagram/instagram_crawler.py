# 인스타그램 게시물 크롤러
# 2019 05 22 전지원
import os
import requests
import json
import pprint
import pandas as pd
import traceback
from time import time, sleep
from datetime import datetime
from termcolor import colored

BASE_DIR = '%s/' % os.path.dirname(os.path.realpath(__file__))
USER_INFO_JSON = json.loads(open('%s/user_info.json' % os.path.dirname(os.path.realpath(__file__))).read())
INSTAGRAM_URLs = {
    'main': {
        'method': 'GET',
        'url': 'https://www.instagr.am',
    },
    'login_ajax': {
        'method': 'POST',
        'url': 'https://www.instagram.com/accounts/login/ajax/',
    },
    'hashtag': {
        'method': 'GET',
        'url': 'https://www.instagram.com/explore/tags/%s/?__a=1'
    }
}
pp = pprint.PrettyPrinter(indent=4)

# Traceback
def getTracebackStr():
	lines = traceback.format_exc().strip().split('\n')
	rl = [lines[-1]]
	lines = lines[1:-1]
	lines.reverse()
	for i in range(0,len(lines),2):
		rl.append('^\t%s at %s' % (lines[i].strip(),lines[i+1].strip()))
	return '\n'.join(rl)

# Save Log to a file
def saveLog(level, message, timestamp, color=None, shown=True):
    message = '%s - [%s] %s' % (datetime.today().strftime("%Y-%m-%d %H:%M:%S"), level, message)
    log_file = '%slog/log-%s.log' % (BASE_DIR, timestamp)
    with open(log_file, "a") as log:
        log.write(message)

    if color is not None:
        print(colored(message, color))
    else:
        if shown:
            print(message)

class InstagramScraper:
    def __init__(self, username, password, timestamp):
        self._username = username
        self._password = password
        self._timestamp = timestamp
        self.init()

    def init(self):
        saveLog('Notice', '로그인을 시도합니다.', self._timestamp, color='yellow')
        self._session = requests.Session()
        self._is_signed_in = False

        headers = {
            "Host": "www.instagram.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:53.0) Gecko/20100101 Firefox/53.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        }

        r = self._session.get(INSTAGRAM_URLs['main']['url'], headers=headers)
        self._last_cookies = r.cookies
    
    def sign_in(self):
        headers = {
            "Host": "www.instagram.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:53.0) Gecko/20100101 Firefox/53.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "X-CSRFToken": self._last_cookies['csrftoken'],
            "X-Instagram-AJAX": "1",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": "https://www.instagram.com/",
        }
        login_data = USER_INFO_JSON

        r = self._session.post(INSTAGRAM_URLs['login_ajax']['url'], headers=headers, data=login_data, cookies=self._last_cookies)
        self._last_cookies = r.cookies
        result = json.loads(r.text)

        if 'authenticated' in result:
            if result['authenticated'] == True:
                self._is_signed_in = True
                return self._is_signed_in
            else:
                return False
        else:
            print(str(result))
            return False

    def is_signed_in(self):
        return self._is_signed_in

    def get_hashtag_media(self, keyword, end_cursor=None):
        tmp = None
        if end_cursor is not None:
            tmp = '%s&max_id=%s' % (INSTAGRAM_URLs['hashtag']['url'] % keyword, end_cursor)
        else:
            tmp = INSTAGRAM_URLs['hashtag']['url'] % keyword
        
        r = self._session.get(tmp, cookies=self._last_cookies)
        self._last_cookies = r.cookies
        return json.loads(r.text)

def initInstagramInstance(timestamp):
    """
=================================
|   인스타그램 데이터 크롤러    |
=================================
    """
    return InstagramScraper(USER_INFO_JSON['username'], USER_INFO_JSON['password'], timestamp)

count = 0
SCRAPED = []
end_cursor = ''
if __name__ == "__main__":
    timestamp = int(time())
    data = dict()
    try:
        print(initInstagramInstance.__doc__)
        print('[Keyword] 검색할 키워드를 입력해주세요.')
        keyword = input().strip().replace(' ', '')
        instance = initInstagramInstance(timestamp)
        if instance.is_signed_in:
            saveLog('Notice', '로그인되었습니다.', timestamp, color='yellow')
            saveLog('Scraper', '해시태그 검색결과를 스크랩합니다.', timestamp, color='green')
            tmp_cursor = None
            tmp_has_next = False
            while True:
                if bool(data):
                    if tmp_has_next:
                        data = instance.get_hashtag_media(keyword, tmp_cursor)
                else:
                    data = instance.get_hashtag_media(keyword)
                    if 'graphql' in data:
                        saveLog('Notice', '수집 중입니다. 예상 데이터는 %d개입니다.' % data['graphql']['hashtag']['edge_hashtag_to_media']['count'], timestamp)

                if 'graphql' in data:
                    if data['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['has_next_page']:
                        tmp_has_next = data['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['has_next_page']
                        tmp_cursor = data['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['end_cursor']
                else:
                    saveLog('Scraper', '인스타그램에서 데이터 제공을 일시중단했습니다. 잠시 쉬어갑니다.... (for 5 seconds)', timestamp, color='yellow')
                    sleep(5)
                    continue
                
                SCRAPED = SCRAPED + data['graphql']['hashtag']['edge_hashtag_to_media']['edges']
                count = count + len(data['graphql']['hashtag']['edge_hashtag_to_media']['edges'])
                saveLog('Scraper', str(len(data['graphql']['hashtag']['edge_hashtag_to_media']['edges'])) + '개 수집되었습니다. (누적 %d개)' % count, timestamp, color='green')

                with open('data.json', 'w') as outfile:
                    json.dump(data, outfile)

                if data['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['has_next_page']:
                    continue
                else:
                    break

            df = pd.DataFrame(SCRAPED)
            df.to_excel(BASE_DIR + 'hashtag_%s.xlsx' % keyword, encoding='utf8')
            saveLog('Scraper', '엑셀 변환 완료', timestamp, color='green')
        else:
            exit(-1)
    except KeyboardInterrupt:
        saveLog('Exception', '사용자 강제종료', timestamp, color='red')
        exit(-1)
    except Exception as e:
        saveLog('Exception', str(e), timestamp, color='red')
        try:
            saveLog('Exception', getTracebackStr(), timestamp, color='red')
        except:
            pass
        exit(-1)