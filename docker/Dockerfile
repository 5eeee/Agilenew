FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY packages ./packages
COPY apps ./apps

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/packages

EXPOSE 8080 8081 8082 8083

CMD ["python", "apps/gateway/server.py"]
