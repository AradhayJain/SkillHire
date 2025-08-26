# Use slim Python base image
FROM python:3.10-slim

# System deps for PyMuPDF (fitz) and OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy requirements first (for caching layers)
COPY ./requirements.txt /app/requirements.txt

# Upgrade pip and install deps with longer timeout + retries
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir --default-timeout=100 -r requirements.txt
    # If timeout persists, try using a faster mirror:
    # pip install --no-cache-dir -i https://pypi.tuna.tsinghua.edu.cn/simple --default-timeout=100 -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose port (if running API)
EXPOSE 5000

# Default command (update if you use FastAPI/Flask etc.)
CMD ["python", "app.py"]
