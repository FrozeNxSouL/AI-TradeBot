# FROM python:3.10

# WORKDIR /app

# COPY requirements.txt .

# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 6000

# # CMD ["sh", "-c", "python prediction_server.py & python updateGBPUSDModel.py & python updateUSDJPYModel.py & python main.py && wait"]
# CMD ["sh", "-c", "python prediction_server.py && wait"]

FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy only necessary files first (reduces cache busting)
COPY requirements.txt .

RUN pip install --upgrade pip
# Install only needed packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the required port
EXPOSE 6000

# Run the Python script
# CMD ["python", "predict_router.py", "provider_api.py", "function.py", "update_model.py", "environment.py" ]
CMD ["sh", "-c", "python provider_api.py & python function.py & python environment.py & python update_model.py & python predict_router.py && wait"]
