# FROM python:3.9-alpine

# WORKDIR /app

# # Install R and required packages
# RUN apk update && \
#     apk add --no-cache R R-dev

# # Set R_HOME environment variable
# ENV R_HOME /usr/lib/R

# COPY requirements.txt .
# # ENV RPY2_CFFI_MODE=ABI

# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# CMD [ "python", "./main.py" ]



FROM python:3.9-slim-buster

# Install R and required libraries
RUN apt-get update && \
    apt-get install -y r-base libssl-dev libffi-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set up default R packages
RUN echo "options(defaultPackages = c(getOption('defaultPackages'), 'utils', 'grDevices', 'graphics', 'stats', 'methods'))" >> /usr/lib/R/etc/Rprofile.site

WORKDIR /app

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Flask app
EXPOSE 5000

# Copy the application code to the container
COPY . /app

# Start the Flask app
CMD ["python", "main.py"]

