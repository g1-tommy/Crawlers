import os
import requests
import pprint
import pandas as pd
from termcolor import colored
from tqdm import tqdm
from bs4 import BeautifulSoup

BOOKS = []
URL = 'http://www.kyobobook.co.kr/bestSellerNew/bestseller.laf'
REQ_PAGE_NUM = 10
pp = pprint.PrettyPrinter(indent=4)

def scrape_kyobobooks_bestsellers():
    """
===== 교보문고 베스트셀러 크롤러 =====
    """
    for i in tqdm(range(1, REQ_PAGE_NUM + 1)):
        FORM_DATA = {
            'targetPage': i,
            'mallGb': 'KOR',
            'range': 1,
            'kind': 0,
            'kyoboTotalYn': 'N',
            'selBestYmw': '2019052',
            'linkClass': 'A',
            'cateDivYn': '2',
            'pageNumber': i,
            'perPage': '20',
            'excelYn': 'N',
            'seeOverYn': 'Y',
            'loginYN': 'N'
        }
        res = requests.post(URL, data=FORM_DATA)
        soup = BeautifulSoup(res.text, 'html.parser')
        for book in tqdm(soup.select('#main_contents > ul > li')):
            book_info = dict()
            meta = book.select_one('div.detail > div.author').get_text().strip().split('|')
            if "저자 더보기" in meta[0]:
                book_info['author'] = meta[0].split('저자 더보기')[0].strip()
            else:
                book_info['author'] = meta[0].strip()
            book_info['price'] = book.select_one('div.detail > div.price > strong').get_text().strip()
            book_info['launched'] = meta[-1].strip()
            book_info['title'] = book.select_one('div.detail > div.title > a > strong').get_text().strip()
            BOOKS.append(book_info)

    return BOOKS

if __name__ == "__main__":
   print(colored(scrape_kyobobooks_bestsellers.__doc__, 'green'))
   BOOKS = scrape_kyobobooks_bestsellers()
   print(colored('\n\n===== 완료되었습니다. =====\n', 'green'))
   df = pd.DataFrame(BOOKS, columns=BOOKS[0].keys())
   df.to_excel('%s/SCRAPED_RESULT.xlsx' % os.getcwd(), encoding='utf8')