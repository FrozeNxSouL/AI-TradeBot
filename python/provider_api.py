import pandas as pd
import requests
from datetime import datetime, timedelta

class TiingoDataFetcher:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.tiingo.com/tiingo"

    def get_price(self, ticker, start_date=None, end_date=None, frequency='daily'):

        if not start_date:
            start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
            
        if frequency in ["1min", '1hour', 'daily']:
            endpoint = f"/fx/{ticker}/prices"
            params = {
                'startDate': start_date,
                'endDate': end_date,
                'format': 'json',
                'resampleFreq': frequency,
                'token': self.api_key
            }
        else:
            # For intraday data
            endpoint = f"/iex/{ticker}/prices"
            params = {
                'startDate': start_date,
                'endDate': end_date,
                'format': 'json',
                'resampleFreq': frequency,
                'token': self.api_key
            }
            
        url = f"{self.base_url}{endpoint}"

        response = requests.get(url, params=params)
        print(response)        
        if response.status_code != 200:
            raise Exception(f"Error fetching data: {response.text}")
            
        data = response.json()
        df = pd.DataFrame(data)
        
        # Rename columns to standard OHLCV format
        column_mapping = {
            'open': 'Open',
            'high': 'High',
            'low': 'Low',
            'close': 'Close',
            'volume': 'Volume',
            'date': 'Date'
        }
        df = df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns})
        
        # Convert date to datetime
        if 'Date' in df.columns:
            df['Date'] = pd.to_datetime(df['Date'])
            df.set_index('Date', inplace=True)
        
        return df

# Example usage
# if __name__ == "__main__":
#     api_key = "1c61ee55e8094c0123235cd59b659eb176093e8b"
#     fetcher = TiingoDataFetcher(api_key)
    
    
#     # # Get 5-minute data for the last week
#     start_date = (datetime.now() - timedelta(days=4)).strftime('%Y-%m-%d')
#     end_date = (datetime.now() - timedelta(days=0)).strftime('%Y-%m-%d')
#     output_data = fetcher.get_price("USDJPY", start_date=start_date,end_date=end_date, frequency='1min')
#     print(output_data.head(5))
#     print(output_data.tail(5))
    