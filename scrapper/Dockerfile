FROM python:3.11.3-slim AS builder

RUN apt-get update && \
    apt-get install -y libpq-dev gcc

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY ./requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

FROM python:3.11.3-slim

RUN apt-get update && \
    apt-get install -y libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

COPY ./scrapper.py .

CMD ["python", "scrapper.py"]

