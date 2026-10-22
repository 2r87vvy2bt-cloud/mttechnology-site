FROM python:3.12-slim
RUN pip install --no-cache-dir libretranslate
ENV LT_HOST=0.0.0.0
ENV LT_LOAD_ONLY=en,ru,de,bg
CMD ["sh", "-c", "libretranslate --host 0.0.0.0 --port ${PORT:-5000} --load-only en,ru,de,bg"]
