# Use a specific slim image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Create a non-root user and switch to it
# This is a security best practice
RUN useradd -m myappuser
USER myappuser

# Copy requirements first to leverage Docker's layer cache
COPY --chown=myappuser:myappuser requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# (Assumes you have a .dockerignore file)
COPY --chown=myappuser:myappuser . .

# Expose the port the app runs on (make sure this matches your app)
EXPOSE 5000

# Command to run the application
CMD ["python", "app.py"]