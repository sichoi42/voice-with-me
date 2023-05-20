FROM python:3.9-slim

# 소스 코드 복사
COPY ./scrapper.py .

# 필요한 패키지 설치
RUN pip install --no-cache-dir requests beautifulsoup4 schedule psycopg2 dotenv

# 소스 코드 실행 명령
CMD ["python", "scrapper.py"]
