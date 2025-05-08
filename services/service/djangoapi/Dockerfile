FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt .

RUN apt-get update \
    && apt-get -y install libpq-dev gcc libgdal-dev cron \
        libcairo2 libcairo2-dev libpango1.0-0 libpangocairo-1.0-0

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["gunicorn", "djangoapi.wsgi:application", "--access-logfile", "-", "--error-logfile", "-", "--bind", "0.0.0.0:8000", "--timeout", "900"]