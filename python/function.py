import numpy as np

def dataFiltering(data,timesec):
    
    # scaler = MinMaxScaler(feature_range=(0, 1))
    
    # # columns_to_scale = list(range(0, 2))  # Indices 1 through 5
    # columns_to_scale = list(range(0, 3))  # Indices 1 through 5
    # # columns_to_scale = list(range(1, 4))  # Indices 1 through 5
    # columns_to_exclude = [3]
    # # Convert to datetime
    
    # scaled_data = scaler.fit_transform(data.iloc[:, columns_to_scale])
    # # data[data.columns] = scaler.fit_transform(data[data.columns]).flatten()
    # scaled_df = pd.DataFrame(scaled_data, columns=data.columns[columns_to_scale], index=data.index)
    
    # # Combine scaled and unscaled columns
    # # final_df = pd.concat([ scaled_df], axis=1)
    # final_df = pd.concat([ scaled_df ,data.iloc[:,columns_to_exclude] ], axis=1)
    data.rename(columns={"Price": "Middle_price"}, inplace=True)
    final_df = data
    return final_df

def calculateMABand(data,timestep):
    # data["Middle_price"] = (data["Bid"] + data["Ask"])/2
    
    # data["Price_volume"] = (data["Middle_price"] * data["Volume"])  # Price * Volume
    
    # data["cumulative_price_volume"] = data["price_volume"].cumsum()  # Cumulative sum of (Price * Volume)
    # data["cumulative_volume"] = data["Volume"].cumsum()  # Cumulative sum of Volume
    # data["VWAP"] = data["cumulative_price_volume"] / data["cumulative_volume"]  # VWAP Formula    
    # # Step 2: Calculate 10-step Moving Average of VWAP
    # data["VWAP_MA"] = data["VWAP"].rolling(window=timestep).mean()
    data["Price_MA"] = data["Middle_price"].rolling(window=timestep).mean()

    lookback = 5
    k_base = 2  # Base multiplier for bands
    alpha = 0.15  # Scaling factor for adjusting k
    # 1. Calculate Growth Rate
    # data["CUM_Price_Growth"] = (data["Middle_price"].pct_change(periods=timestep)).cumsum()
    data["Lookback_Price"] = data["Middle_price"].shift(timestep)
    # data["Growth_Rate"] = np.abs(data["Middle_price"].pct_change()) * 100  # Percentage change over n periods
    data["Growth_Rate"] = np.where(
        (data["Lookback_Price"] > 0) & (data["Middle_price"] > 0), 
        np.abs(((data["Middle_price"]) / (data["Lookback_Price"])).apply(np.log)), 
        0
    )
    # 2. Adjust Band Multiplier (k) Based on Growth Rate
    data["Adjusted_k"] = k_base + alpha * data["Growth_Rate"]
    # 3. Calculate Standard Deviation
    data["Std_Dev"] = data["Middle_price"].rolling(window=timestep).std()
    # 4. Calculate Bands with Adjusted k
    data["Upper_Band"] = data["Price_MA"] + data["Adjusted_k"] * data["Std_Dev"]
    data["Lower_Band"] = data["Price_MA"] - data["Adjusted_k"] * data["Std_Dev"]

    
    # Initialize the cubic prediction column
    # data["Upper_Band"] = np.nan
    # data["Lower_Band"] = np.nan

    # lookback = timestep*3
    # time_points = np.arange(1,lookback+1) 
    # predict_point = lookback + forwardstep

    # for i in range(len(data) - lookback + 1):
    #     # interpolate
    #     subset_prices = data["Middle_price"].iloc[i:i + lookback].values
    #     # predict_interpolator = interp1d(time_points, subset_prices, kind='quadratic', fill_value="extrapolate")
    #     # predict_value = predict_interpolator(predict_point)
    #     position = i + lookback - 1
    #     adjusted_k = data.loc[position, "Adjusted_k"]
    #     std_dev = data.loc[position, "Std_Dev"]

    #     # data.loc[position, "Upper_Band"] = predict_value + adjusted_k * std_dev
    #     # data.loc[position, "Lower_Band"] = predict_value - adjusted_k * std_dev

    #     # spline
    #     spline = CubicSpline(time_points, subset_prices, bc_type='not-a-knot')

    #     predicted_values = spline([predict_point])
    #     value = predicted_values[0]
        
    #     data.loc[position, "Upper_Band"] = value + adjusted_k * std_dev
    #     data.loc[position, "Lower_Band"] = value - adjusted_k * std_dev
    

def calculate_CCI(data, timestep):
    data["SMA_Price"] = data["Middle_price"].rolling(window=timestep).mean()
    data["MAD_Price"] = data["Middle_price"].rolling(window=timestep).apply(lambda x: np.mean(np.abs(x - x.mean())), raw=True)
    data["CCI"] = ((data["Middle_price"] - data["SMA_Price"]) / (0.015 * data["MAD_Price"]))/ 100

def calculate_ATR(data, timestep):
    data["Previous_Price"] = data["Middle_price"].shift(1)
    data["True_Range"] = abs(data["Middle_price"] - data["Previous_Price"])
    data["ATR"] = data["True_Range"].rolling(window=timestep).mean()
    
def calculate_rsi(data, timestep):
    delta = data["Middle_price"].diff()  # Price changes
    gain = (delta.where(delta > 0, 0))  # Positive gains
    loss = (-delta.where(delta < 0, 0))  # Negative losses

    avg_gain = gain.rolling(window=timestep).mean()
    avg_loss = loss.rolling(window=timestep).mean()

    rs = avg_gain / avg_loss  # Relative Strength
    data["RSI"] = (100 - (100 / (1 + rs))) / 100  # RSI formula

def calculate_vpt(data):
    # Price change percentage
    price_change = data["Middle_price"].pct_change()  # (Close_t - Close_{t-1}) / Close_{t-1}
    # VPT Calculation
    data["VPT"] = (price_change * data["Volume"]).cumsum()  # Cumulative sum of price change * volume

def cleasing_data(data):
    temp_data = data.drop(columns=["SMA_Price",
                                   "MAD_Price",
                                   "Std_Dev",
                                   "Lookback_Price",
                                   "Growth_Rate",
                                   "Adjusted_k",
                                   "Volume"
                                   # "Previous_Price",
                                    # "True_Range",
                                  ])
    cleaned = temp_data.dropna().reset_index(drop=True)
    # cleaned['Time'] = pd.to_datetime(cleaned['Time'])
    # cleaned['Time'] = cleaned['Time'].astype('int64') // 10**9
    return cleaned