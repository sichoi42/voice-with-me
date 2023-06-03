import requests
from bs4 import BeautifulSoup
# import schedule
import psycopg2
from dotenv import load_dotenv

import time
from urllib.parse import urlparse, parse_qs
import os
from datetime import datetime

load_dotenv()

news_url_numbers = ['437', '020', '016', '057', '028', '005',
                    '023', '032', '214', '366', '277', '448', '079', '088', '449']

news_type_numbers = ['100', '101', '102', '103', '104', '105']
news_type = ['정치', '경제', '사회', '생활/문화', '세계', 'IT/과학']
news_type_dict = dict(zip(news_type_numbers, news_type))

headers = ['h1', 'h2', 'h3']


class NewsSummary:
    nid: str
    title: str
    content: str
    url: str
    publisher: str
    published_at: str
    writer: str
    category: str


def scrape_news_article(url):
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    if response.status_code == 200:
        try:
            time.sleep(0.5)
            news = NewsSummary()
            news.url = url
            # print(news.url)

            # https://n.news.naver.com/article/437/0000345687?sid=100
            # nid is 0000345687
            nid = url.split("/")[-1].split("?")[0]
            news.nid = nid
            # print(news.nid)

            # url에서 sid 파라미터를 찾아서 이 값을 key로하는 value를 category에 저장
            parsed_url = urlparse(url)
            params = parse_qs(parsed_url.query)
            sid = params.get('sid', [''])[0]
            news.category = news_type_dict[sid]
            # print(news.category)

            html = response.text
            soup = BeautifulSoup(html, 'html.parser')

            # class가 ofhd_float_title인 h1 or h2 or h3 태그를 찾아서 publisher에 저장
            publisher = None
            for header in headers:
                publisher = soup.find_all(
                    header, {'class': 'ofhd_float_title'})
                if len(publisher) > 0:
                    break
            if publisher is None:
                return
            news.publisher = publisher[0].text.strip()
            # print(news.publisher)

            # class가 media_end_head_headline인 h1 or h2 or h3 태그를 찾아서 title에 저장
            title = None
            for header in headers:
                title = soup.find_all(
                    header, {'class': 'media_end_head_headline'})
                if len(title) > 0:
                    break
            if title is None:
                return
            news.title = title[0].text.strip()
            # print(news.title)

            # class가 media_end_head_info_datestamp_time인 span 태그를 찾아서 published_at에 저장
            published_at = soup.find_all(
                'span', {'class': 'media_end_head_info_datestamp_time'})
            news.published_at = published_at[0].text.strip()

            if '오후' in news.published_at:
                news.published_at = news.published_at.replace('오후', '')
                news.published_at = datetime.strptime(
                    news.published_at, '%Y.%m.%d.  %I:%M')
                news.published_at = news.published_at.replace(
                    hour=news.published_at.hour + 12)
            else:
                news.published_at = datetime.strptime(
                    news.published_at, '%Y.%m.%d. 오전 %I:%M')
            # print(news.published_at)

            # class가 media_end_head_journalist_name인 em 태그를 찾아서 writer에 저장
            writer = soup.find_all(
                'em', {'class': 'media_end_head_journalist_name'})
            news.writer = writer[0].text.strip()
            # print(news.writer)

            # id가 dic_area인 div 태그를 찾는다.
            content = soup.find_all('div', {'id': 'dic_area'})
            news.content = content[0].get_text().strip()
            # print(news.content)
            return news
        except Exception as e:
            print(e)


def scrape_news_list(conn):
    start = time.time()
    for news_url_number in news_url_numbers:
        for news_type_number in news_type_numbers:
            url = 'https://media.naver.com/press/' + \
                news_url_number + '?sid=' + news_type_number
            response = requests.get(
                url, headers={'User-Agent': 'Mozilla/5.0'})
            if response.status_code == 200:
                try:
                    time.sleep(0.5)
                    html = response.text
                    soup = BeautifulSoup(html, 'html.parser')

                    # class가 press_edit_news인 div 태그를 찾아서 저장
                    news_div = soup.find_all(
                        'div', {'class': 'press_edit_news'})

                    # news_div[0]의 자식 중 ul 태그를 찾아서 저장
                    news_ul = news_div[0].find_all('ul')

                    # news_ul의 li들을 iterate
                    news_lis = news_ul[0].find_all('li')
                    for news_li in news_lis:
                        # news_li의 자식 중 a 태그를 찾아서 저장
                        news_a = news_li.find_all('a')

                        # a태그의 자식 중 class가 press_edit_news_text인 span 태그를 찾아서 저장
                        news_span = news_a[0].find_all(
                            'span', {'class': 'press_edit_news_text'})
                        # news가 작성된 시간이 x일전이면 continue
                        news_time = news_span[0].findChildren()
                        if '일전' in news_time[-1].text.strip():
                            print(news_time[-1].text.strip())
                            continue

                        # news_a의 href 속성을 찾아서 저장
                        news_href = news_a[0].get('href')
                        print(news_href)

                        # news_href의 뉴스 기사를 스크래핑
                        news = scrape_news_article(news_href)
                        if news is not None:
                            # news를 DB에 저장
                            save_news(news, conn)
                        # FIXME: 하나만 스크래핑하고 break하도록 했으나
                        # 추후에 각각의 목록 중 댓글이 가장 많이 달린 기사 하나를 선택하도록
                        # 수정해야 함
                        break

                except Exception as e:
                    # 빨간색으로 에러 메시지 출력
                    print("\033[31m" + str(e) + "\033[0m")
                    continue

    print("time :", time.time() - start)


def save_news(news, conn):
    cur = conn.cursor()
    cur.execute("INSERT INTO news (nid, title, content, url, publisher, published_at, writer, category) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (news.nid, news.title, news.content, news.url, news.publisher, news.published_at, news.writer, news.category))
    conn.commit()
    cur.close()


def delete_old_news(conn):
    cur = conn.cursor()
    # 현재 시간으로부터 48시간 이전에 작성된 뉴스를 삭제
    cur.execute(
        "DELETE FROM news WHERE published_at < NOW() - INTERVAL '48 hours'")
    conn.commit()
    cur.close()


def scrapper_trigger():
    print("스크래핑 시작")
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST'),
        port=os.environ.get('DB_PORT'),
        database=os.environ.get('DB_DATABASE'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD')
    )
    scrape_news_list(conn)
    delete_old_news(conn)
    conn.close()


# # 매 정각 스크래핑 함수 실행
# schedule.every().hour.at(":00").do(scrapper_trigger)

# 서버 가동 후 1회 스크래핑 함수 실행
scrapper_trigger()

# # 스케줄러 실행
# while True:
#     schedule.run_pending()
#     time.sleep(1)
