# Dockerfile

FROM python:3.11

# Set the working directory to the root of the project, not `/app`
WORKDIR /app

# Copy the whole project folder into the container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r app/requirements.txt

# Expose FastAPI's default port
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
