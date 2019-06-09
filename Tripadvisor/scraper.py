# 알송(알바생이라 죄송)합니다....
# 2019 05 09 크롤링 - Tripadvisor

import requests
import json
import pandas as pd
from bs4 import BeautifulSoup

number = 0
url = f'https://www.tripadvisor.co.kr/Attractions-g187147-Activities-Paris_Ile_de_France.html#FILTERED_LIST'
session = requests.Session()

res = requests.get(url)
soup = BeautifulSoup(res.text, 'html.parser')

place_data = []

max_page = int(soup.select_one('#FILTERED_LIST > div.al_border.deckTools.btm > div > div > div > a:nth-child(8)').get_text())
print('총 %d 페이지' % max_page)

url = f'https://www.tripadvisor.co.kr/Attractions-g187147-Activities-oa{number}-Paris_Ile_de_France.html#FILTERED_LIST'
for page in range(0, max_page + 1):
    number = page * 30
    res = requests.get(url)
    soup = BeautifulSoup(res.text, 'html.parser')
    # Same as { 'class': 'listing_details' }
    places = soup.find_all('div', class_="listing_details") 
    for place in places:
        place_title_area = place.find('div', { 'class': 'listing_title' })
        place_title = place_title_area.a.text.strip()
        place_link = place_title_area.a['href']
        place_rating_area = place.find('div', { 'class': 'listing_rating' })
        place_rating = float(place_rating_area.find('span', { 'class' : 'ui_bubble_rating' })['alt'].split(' ')[-1])
        place_reviews = int(place_rating_area.find('a').get_text().strip().replace(',', '').replace('건의 리뷰', ''))
        
        data = dict(title=place_title, link=place_link, ratings=place_rating, reviews=place_reviews)
        place_data.append(data)
    
    print('현재 %d 페이지' % (page + 1))

df = pd.DataFrame(place_data, columns=['title', 'link', 'ratings', 'reviews'])
df.head(30)
df.to_excel('places_result.xlsx', encoding='utf8')
