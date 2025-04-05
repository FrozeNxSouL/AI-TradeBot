import zmq
import json
import schedule
import time
from stable_baselines3 import PPO
import threading
from environment import TradingEnv
from function import dataFiltering, calculateMABand,calculate_CCI,calculate_rsi,cleasing_data
import pandas as pd
import os
import re
from stable_baselines3 import PPO

models_dict = {}
AvailableTF = ["01","02","03"]

def load_all_models():
    base_dir = "./models"
    
    global models_dict
    models_dict = {}
    
    for file in os.listdir(base_dir):
        file_path = os.path.join(base_dir, file)
        if file.endswith('.zip') and os.path.isfile(file_path):
            # Extract the model ID (without the .zip extension)
            model_id = file.replace('.zip', '')
            
            print(f"Loading model: {model_id}")
            try:
                # Load the model directly from the zip file
                models_dict[model_id] = PPO.load(file_path)
            except Exception as e:
                print(f"Error loading model {model_id}: {e}")
                
                
def reload_new_models():
    print("Reloading models with new version updates...")
    load_all_models()
    print("Models reloaded.")

def scheduler_thread():
    while True:
        schedule.run_pending()
        time.sleep(1)
    
    
def find_newest_model(directory, symbol_code, timeframe_code):
    pattern = r"(\d{3})(\d{2})(\d{3})\.zip"
    
    matching_files = []
    
    for filename in os.listdir(directory):
        match = re.match(pattern, filename)
        if match and os.path.isfile(os.path.join(directory, filename)):
            sym_code, tf_code, version = match.groups()
            
            if sym_code == symbol_code and tf_code == timeframe_code:
                matching_files.append({
                    'filename': filename,
                    'symbol_code': sym_code,
                    'timeframe_code': tf_code,
                    'version': int(version),
                    'full_path': os.path.join(directory, filename)
                })
    
    if not matching_files:
        return None
    
    newest_model = sorted(
        matching_files, 
        key=lambda x: (x['version']), 
        reverse=True
    )[0]
    
    return newest_model

def main():
    pattern = r"(\d{3})(\d{2})(\d{3})"
    
    load_all_models()
    
    schedule.every().days.do(reload_new_models)
    
    # เริ่ม thread สำหรับ scheduler
    threading.Thread(target=scheduler_thread, daemon=True).start()
    
    context = zmq.Context()
    socket = context.socket(zmq.ROUTER)
    socket.bind("tcp://*:6000") 

    print("Python Server: Waiting for messages...")
    
    while True:
        client_id, message = socket.recv_multipart()
        message = message.decode()
        
        try:
            
            data = json.loads(message)

            if not isinstance(data, dict) or "Ticks" not in data or "Trades" not in data or "ID" not in data:
                socket.send_multipart([client_id,json.dumps([]).encode('utf-8')])
            
            selected_id = str(data.get("ID"))
            ticks = pd.DataFrame(data["Ticks"], columns=["Price", "High", "Low", "Volume"])
            tradesArray = data.get("Trades", None)
            
            load_model = models_dict[selected_id]
                
            timesec = 15
            timesstep = 20
            
            
            if not tradesArray:
                tradesArray = None
                
            postdat = dataFiltering(ticks,timesec)

            calculateMABand(postdat,timesstep)
            calculate_CCI(postdat,timesstep)
            calculate_rsi(postdat,timesstep)

            last_finalize_data = cleasing_data(postdat)
            
            match = re.match(pattern, selected_id)
            sym_code, tf_code, version = match.groups()

            if tf_code == AvailableTF[0]:
                test_data = last_finalize_data.iloc[len(last_finalize_data)-31:].reset_index(drop=True)
                env = TradingEnv(test_data, existed_trades=tradesArray, lookback_window=30, max_trades=10, overlap=15)
            elif tf_code == AvailableTF[1]:
                test_data = last_finalize_data.iloc[len(last_finalize_data)-13:].reset_index(drop=True)
                env = TradingEnv(test_data, existed_trades=tradesArray, lookback_window=12, max_trades=10, overlap=6)
            elif tf_code == AvailableTF[2]:
                test_data = last_finalize_data.iloc[len(last_finalize_data)-8:].reset_index(drop=True)
                env = TradingEnv(test_data, existed_trades=tradesArray, lookback_window=7, max_trades=10, overlap=3)

            obs = env.reset()
            done = False

            # Run the prediction loop
            while not done:
                # Predict the action using the loaded model
                action, _ = load_model.predict(obs)

                # Take the action in the environment
                obs, reward, done, info = env.step(action)

            predictions = [
                [item['ticket'], item['position'], item['sl_percentage'], item['action']]
                for item in info["completed_trades"] + info["open_trades"]
            ]

            socket.send_multipart([client_id, json.dumps(predictions).encode('utf-8')])
            
        except zmq.error.ZMQError as e:
            print(f"ZMQ error occurred: {e}")
            socket.send_multipart([client_id,json.dumps([]).encode('utf-8')])
            break
        except json.JSONDecodeError:
            print("Invalid JSON received in first message.")
            socket.send_multipart([client_id,json.dumps([]).encode('utf-8')])

if __name__ == "__main__":
    main()


