FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

RUN apt-get update && \
    apt-get install -y --no-install-recommends redis celery gfortran && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install dropkick

COPY . /app


# CMD ["sh", "-c", "service rabbitmq-server start && celery -A services.celeryApp worker -l info -Q jobQueue --concurrency=4 && uvicorn controller:app --host 0.0.0.0 --port 8000"]
CMD ["sh", "-c", "./run_redis.sh & ./run_celery.sh & ./run_fastapi.sh"]