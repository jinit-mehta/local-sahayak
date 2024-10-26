from flask import Flask, request, jsonify
import pandas as pd
import requests
import holidays
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import warnings
import os

warnings.filterwarnings('ignore')

app = Flask(__name__)

# Initialize global variables
model = None
scaler = None
encoders = None

# Load model and other data
def load_model():
    global model, scaler, encoders
    # Load training data from CSV with specified encoding
    try:
        training_data = pd.read_csv('uniquedb.csv', encoding='ISO-8859-1')  # Adjust the filename and encoding as needed
        model, scaler, encoders = train_model(training_data)
    except Exception as e:
        print(f"Error loading the model: {e}")

def train_model(data):
    # Initialize encoders
    encoders = {
        'Location': LabelEncoder(),
        'Product_Category': LabelEncoder(),
        'Brand': LabelEncoder()
    }

    # Encode categorical features
    for column in ['Location', 'Product_Category', 'Brand']:
        data[f'{column}_Encoded'] = encoders[column].fit_transform(data[column].astype(str))

    # Split data into features and target
    X = data.drop('Stock_Level', axis=1)  # Replace 'Stock_Level' with the appropriate target variable name
    y = data['Stock_Level']  # Target variable

    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)

    return model, scaler, encoders

# Weather API integration
def fetch_weather_data(location):
    try:
        api_key = 'YOUR_API_KEY'  # Replace with your weather API key
        url = f'http://api.weatherapi.com/v1/current.json?key={api_key}&q={location}'
        
        response = requests.get(url)
        weather_data = response.json()
        
        if response.status_code == 200:
            temperature = weather_data['current']['temp_c']
            humidity = weather_data['current']['humidity']
            return temperature, humidity
        else:
            raise Exception("Error fetching weather data: " + weather_data.get("error", {}).get("message"))
            
    except Exception as e:
        print(f"Error fetching weather data: {str(e)}")
        return None, None

def detect_indian_festivals(date):
    india_holidays = holidays.IN(years=[datetime.now().year])
    festival_data = {
        "Diwali": datetime(datetime.now().year, 11, 12),
        "Holi": datetime(datetime.now().year, 3, 24),
        "Eid": datetime(datetime.now().year, 4, 21),
        "Ganesh Chaturthi": datetime(datetime.now().year, 9, 19)
    }

    holiday_name = india_holidays.get(date.date())
    festival_name = next((name for name, festival_date in festival_data.items() if festival_date.date() == date.date()), None)
    is_holiday = int(holiday_name is not None)
    is_festival = int(festival_name is not None)

    return holiday_name, festival_name, is_holiday, is_festival

def prepare_input_data(data):
    # Prepare input data for prediction
    holiday_name, festival_name, is_holiday, is_festival = detect_indian_festivals(data['Date'])

    # Adding the fetched weather data
    temperature, humidity = fetch_weather_data(data['Location'])

    # Calculate expiry date
    expiry_date = data['Date'] + timedelta(days=data['Shelf_Life'])
    days_to_expiry = (expiry_date - datetime.now()).days

    input_data = {
        'Temperature (°C)': temperature,
        'Humidity (%)': humidity,
        'Product_Price': data['Product_Price'],
        'Is_Holiday': is_holiday,
        'Is_Festival': is_festival,
        'Days_to_Expiry': max(days_to_expiry, 0)
    }

    # Encode categorical features
    for column in ['Location', 'Product_Category', 'Brand']:
        le = encoders[column]
        input_data[f'{column}_Encoded'] = le.transform([data[column]])[0]

    return pd.DataFrame([input_data])

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    df_input = prepare_input_data(data)
    
    prediction = model.predict(scaler.transform(df_input))
    recommended_demand = prediction[0]
    
    # Decision logic for recommendations
    if recommended_demand > data['Stock_Level'] * 1.2:
        recommendation = 'Increase stock'
        reason = 'High predicted demand due to factors like weather, holidays, or shelf-life concerns.'
    elif recommended_demand < data['Stock_Level'] * 0.8:
        recommendation = 'Decrease stock'
        reason = 'Predicted demand lower than stock level, potentially influenced by weather or expiration risk.'
    else:
        recommendation = 'Maintain current level'
        reason = ''

    # Save the record to Excel
    save_to_excel(data, recommended_demand, recommendation, reason)
    
    return jsonify({
        'Product': data['Product_Name'],
        'Predicted Demand': recommended_demand,
        'Recommendation': recommendation,
        'Reason': reason
    })

@app.route('/expiry', methods=['POST'])
def calculate_days_to_expiry():
    data = request.json
    expiry_date = datetime.strptime(data['Expiry_Date'], '%Y-%m-%d')
    days_to_expiry = (expiry_date - datetime.now()).days
    return jsonify({'Days_to_Expiry': max(days_to_expiry, 0)})

def save_to_excel(data, predicted_demand, recommendation, reason):
    df = pd.DataFrame([{
        'Date': data['Date'],
        'Location': data['Location'],
        'Product_Name': data['Product_Name'],
        'Product_Category': data['Product_Category'],
        'Brand': data['Brand'],
        'Product_Price': data['Product_Price'],
        'Stock_Level': data['Stock_Level'],
        'Predicted_Demand': predicted_demand,
        'Recommendation': recommendation,
        'Reason': reason
    }])
    
    file_path = 'unique.xlsx'
    
    # Append to existing file or create new one
    if os.path.exists(file_path):
        with pd.ExcelWriter(file_path, mode='a', engine='openpyxl', if_sheet_exists='overlay') as writer:
            df.to_excel(writer, index=False, header=False)
    else:
        df.to_excel(file_path, index=False)

if __name__ == '__main__':
    load_model()
    app.run(debug=True)
