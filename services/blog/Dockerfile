FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py wsgi.py migrate_static.py static_articles.json .
RUN mkdir -p /data
ENV DB_PATH=/data/blog.db
EXPOSE 8080
CMD ["gunicorn", "--bind", "[::]:8080", "--workers", "1", "--threads", "4", "wsgi:app"]
