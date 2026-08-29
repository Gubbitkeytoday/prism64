# Multi-stage lightweight Python runtime
FROM python:3.11-alpine

WORKDIR /app

# Copy project files
COPY . /app

# Expose server port
EXPOSE 8000

ENV PORT=8000
ENV PYTHONUNBUFFERED=1

CMD ["python", "server_mcp.py"]
