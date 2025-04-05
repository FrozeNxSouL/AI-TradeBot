import schedule
import time
from environment import TradingEnv
from stable_baselines3 import PPO
from function import dataFiltering, calculateMABand,calculate_CCI,calculate_rsi,cleasing_data
import requests
import json
from datetime import datetime, timedelta
from stable_baselines3.common.callbacks import BaseCallback
from stable_baselines3.common.vec_env import SubprocVecEnv, DummyVecEnv
import numpy as np
import os
import re
from provider_api import TiingoDataFetcher
import pandas as pd

AvailableSymbol = [{"name":"USDJPY", "code":"100"},{"name":"USDCAD", "code":"101"},{"name":"EURUSD", "code":"102"}]
AvailableTF = ["01","02","03"]
API_KEY = "1c61ee55e8094c0123235cd59b659eb176093e8b"
base_dir = "models"

class AdaptiveLearningRateCallback(BaseCallback):
    def __init__(self, start_lr, end_lr, num_steps, verbose=0):
        super().__init__(verbose)
        self.start_lr = start_lr
        self.end_lr = end_lr
        self.num_steps = num_steps

    def _on_step(self):
        progress = self.num_timesteps / self.num_steps
        new_lr = self.end_lr + (self.start_lr - self.end_lr) * np.exp(-5 * progress)
        new_lr = max(new_lr, self.end_lr)

        self.model.learning_rate = new_lr
        self.model._setup_lr_schedule()
        return True

def make_env(env_name, rank, data, lookback, overlap):
    def _init():
        try:
            env = TradingEnv(data, lookback_window=lookback, max_trades=10, overlap=overlap)
            # env = StockTradingEnv(data)
            env.seed(rank)
            return env
        except Exception as e:
            print(f"Environment {rank} encountered an error: {e}")
            raise
    return _init

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


def send_model_info(model_id,model_path, currency, timeframe):
    url = "http://localhost:3000/api/py_model"  # Adjust API endpoint
    payload = {
        "data": {
            "id": int(model_id),
            "path": model_path,
            "currency": currency,
            "timeframe": timeframe
        }
    }
    
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print("API Response:", response.json())

# Job function to automate training and API call

def M1job():
    fetcher = TiingoDataFetcher(API_KEY)
    for symbol in AvailableSymbol:
        final_df = pd.DataFrame()
        for i in range(8):
            start_date = (datetime.now() - timedelta(days=((i+1)*4))).strftime('%Y-%m-%d')
            end_date = (datetime.now() - timedelta(days=(i*4))).strftime('%Y-%m-%d')
            output_data = fetcher.get_price(symbol["name"], start_date=start_date,end_date=end_date, frequency='1min')
            final_df = pd.concat([ output_data ,final_df ], axis=1)
        
        model_info = find_newest_model(base_dir, symbol["code"], AvailableTF[0])
        
        timesec = 15
        timesstep = 20
                
        postdat = dataFiltering(final_df,timesec)

        calculateMABand(postdat,timesstep)
        calculate_CCI(postdat,timesstep)
        calculate_rsi(postdat,timesstep)

        finalize_data = cleasing_data(postdat)

        lr_base = 0.0005
        lr_end = 0.0000075
        steps = 100000

        adaptive_lr_callback = AdaptiveLearningRateCallback(lr_base, lr_end, steps)

        num_envs = 8  # Adjust based on your CPU
        
        env = DummyVecEnv([make_env('TradingEnv', i, finalize_data , 30, 15) for i in range(num_envs)])

        try:
        # Load the model and set the environment
            load_model = PPO.load(model_info['full_path'])
            load_model.set_env(env)  # Assign the environment
            load_model.learn(total_timesteps=steps, callback=adaptive_lr_callback)
        except Exception as e:
            print("An error occurred during training:")
            
        next_version = model_info['version'] + 1
        next_version_str = f"{next_version:04d}"
        model_id = f"{symbol['code']}{AvailableTF[0]}{next_version_str}"
        model_path = f"{base_dir}/{symbol['code']}{AvailableTF[0]}{next_version_str}"
        
        load_model.save(model_path)
        
        send_model_info(model_id, model_path, symbol["name"], "M1")


def H1job():
    fetcher = TiingoDataFetcher(API_KEY)
    for symbol in AvailableSymbol:
        final_df = pd.DataFrame()
        for i in range(6):
            start_date = (datetime.now() - timedelta(days=((i+1)*30))).strftime('%Y-%m-%d')
            end_date = (datetime.now() - timedelta(days=(i*30))).strftime('%Y-%m-%d')
            output_data = fetcher.get_price(symbol["name"], start_date=start_date,end_date=end_date, frequency='1hour')
            final_df = pd.concat([ output_data ,final_df ], axis=1)
        
        model_info = find_newest_model(base_dir, symbol["code"], AvailableTF[1])
        
        timesec = 15
        timesstep = 20
                
        postdat = dataFiltering(final_df,timesec)

        calculateMABand(postdat,timesstep)
        calculate_CCI(postdat,timesstep)
        calculate_rsi(postdat,timesstep)

        finalize_data = cleasing_data(postdat)

        lr_base = 0.0005
        lr_end = 0.0000075
        steps = 100000

        adaptive_lr_callback = AdaptiveLearningRateCallback(lr_base, lr_end, steps)

        num_envs = 8  # Adjust based on your CPU
        
        env = DummyVecEnv([make_env('TradingEnv', i, finalize_data, 12, 6) for i in range(num_envs)])

        try:
        # Load the model and set the environment
            load_model = PPO.load(model_info['full_path'])
            load_model.set_env(env)  # Assign the environment
            load_model.learn(total_timesteps=steps, callback=adaptive_lr_callback)
        except Exception as e:
            print("An error occurred during training:")
            
        next_version = model_info['version'] + 1
        next_version_str = f"{next_version:04d}"

        model_id = f"{symbol['code']}{AvailableTF[1]}{next_version_str}"
        model_path = f"{base_dir}/{symbol['code']}{AvailableTF[1]}{next_version_str}"
        
        load_model.save(model_path)
        
        send_model_info(model_id, model_path, symbol["name"], "H1")
        

def D1job():
    fetcher = TiingoDataFetcher(API_KEY)
    for symbol in AvailableSymbol:
        final_df = pd.DataFrame()
        for i in range(2):
            start_date = (datetime.now() - timedelta(weeks=((i+1)*48))).strftime('%Y-%m-%d')
            end_date = (datetime.now() - timedelta(weeks=(i*48))).strftime('%Y-%m-%d')
            output_data = fetcher.get_price(symbol["name"], start_date=start_date,end_date=end_date, frequency='daily')
            final_df = pd.concat([ output_data ,final_df ], axis=1)
        
        model_info = find_newest_model(base_dir, symbol["code"], AvailableTF[2])
        
        timesec = 15
        timesstep = 20
                
        postdat = dataFiltering(final_df,timesec)

        calculateMABand(postdat,timesstep)
        calculate_CCI(postdat,timesstep)
        calculate_rsi(postdat,timesstep)

        finalize_data = cleasing_data(postdat)

        lr_base = 0.0005
        lr_end = 0.0000075
        steps = 100000

        adaptive_lr_callback = AdaptiveLearningRateCallback(lr_base, lr_end, steps)

        num_envs = 8  # Adjust based on your CPU
        
        env = DummyVecEnv([make_env('TradingEnv', i, finalize_data, 7, 3) for i in range(num_envs)])

        try:
        # Load the model and set the environment
            load_model = PPO.load(model_info['full_path'])
            load_model.set_env(env)  # Assign the environment
            load_model.learn(total_timesteps=steps, callback=adaptive_lr_callback)
        except Exception as e:
            print("An error occurred during training:")
            
        next_version = model_info['version'] + 1
        next_version_str = f"{next_version:04d}"

        model_id = f"{symbol['code']}{AvailableTF[2]}{next_version_str}"
        model_path = f"{base_dir}/{symbol['code']}{AvailableTF[2]}{next_version_str}"
        
        load_model.save(model_path)
        
        send_model_info(model_id, model_path, symbol["name"], "D1")


schedule.every(30).days.do(M1job)
schedule.every(180).days.do(H1job)
schedule.every(365).days.do(D1job)


while True:
    schedule.run_pending()
    time.sleep(1)  

# schedule.every().day.at("12:00").do(job)
# if __name__ == "__main__":
#     model_info = find_newest_model(base_dir, "100", "01")

#     if model_info:
#         print(f"Found newest model: {model_info['filename']}")
#         print(f"Version: {model_info['version']}")
        
#         # model = PPO.load(model_info['full_path'])
#         print(model_info['full_path'])
#     else:
#         print("No matching models found")
#     print("Running schedule")
# schedule.every(1).minutes.do(job)

# # print("Scheduler is running...")