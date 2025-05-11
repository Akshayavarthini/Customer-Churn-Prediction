from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import numpy as np

# Initialize the FastAPI app
app = FastAPI()

# Define the input data model (matches the input from the form in HTML)
class CustomerData(BaseModel):
    CreditScore: int
    Geography: int  
    Gender: int  
    Age: int
    Tenure: int
    Balance: float
    NumOfProducts: int
    HasCrCard: int 
    IsActiveMember: int 
    EstimatedSalary: float

# Load the trained ANN model
model = tf.keras.models.load_model('churn_model.h5')  # Path to your trained model

@app.post("/predict")
async def predict_churn(data: CustomerData):
    # Convert input data to a NumPy array in the required shape
    input_data = np.array([[ 
        data.CreditScore, data.Geography, data.Gender, data.Age,
        data.Tenure, data.Balance, data.NumOfProducts,
        data.HasCrCard, data.IsActiveMember, data.EstimatedSalary
    ]])

    # Make a prediction using the ANN model
    prediction = model.predict(input_data)[0][0]  # Get the first element of the first prediction

    # Return the prediction as JSON
    return {"churn_probability": float(prediction)}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
