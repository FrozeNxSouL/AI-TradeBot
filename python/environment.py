import gym
from gym import spaces
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

class TradingEnv(gym.Env):
    # def __init__(self, data, existed_trades=None, initial_balance=1000, lookback_window=20, max_trades=10, step_size=20, overlap=10):
    def __init__(self, data, existed_trades=None, initial_balance=100, lookback_window=20, max_trades=10, overlap=10):
        super(TradingEnv, self).__init__()

        self.data = data
        self.initial_step = lookback_window
        # self.step_size = step_size
        self.overlap = overlap
        self.n_steps = len(data) // overlap
        self.lookback_window = lookback_window
        self.current_step = lookback_window
        self.volatility = 0
        self.max_trades = max_trades

        # Initial account parameters
        self.prev_profit = 0
        self.prev_price = 0
        self.prev_unprofit = 0
        self.initial_balance = initial_balance
        self.balance = initial_balance
        self.net_worth = initial_balance

        # Trade tracking
        self.trades = []  # Completed trades
        self.open_trades = existed_trades if existed_trades else []  # Existing trades passed externally
        self.initial_open_trades = existed_trades if existed_trades else [] 
        # Observation space: Price data + open trades (entry price, position, etc.)
        # obs_dim = len(data.columns) * lookback_window + max_trades * 3
        # obs_dim = self.lookback_window * len(self.data.columns) + self.max_trades * 3 + 2
        obs_dim = self.lookback_window * len(self.data.columns) + self.max_trades * 4 + 5
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(obs_dim,), dtype=np.float32
        )

        # Action space:
        # - First `max_trades` actions for currently open trades (Hold, Close).
        # - One action for a new trade (Buy, Sell, Do Nothing).
        self.action_space = spaces.MultiDiscrete([2] * 2 + [3])  # [Hold/Close] * max_trades + [Buy/Sell]
        # self.action_space = spaces.Box(low=-1, high=1, shape=(max_trades + 1,), dtype=np.float32)

    def seed(self, seed=None):
        self.seed_value = seed
        np.random.seed(seed)

    def _calculate_volatility(self, cci, rsi, current_price, lower, upper):
        vol1 = abs(cci / 125)
        vol2 = abs((((rsi - 25) * 4) - 100) / 100)
        vol3 = abs((max(0, current_price - lower) / (upper - lower)) - 0.5) * 2
        return min(1, max((vol1 + vol2) / 2, vol3))

    # def _calculate_reward(self, profit, prev_profit, step, entry_step):
    def _calculate_reward(self, profit, prev_profit):
        reward = 0
        
        # if profit <= 0 and profit <= prev_profit :
        #     reward = ((profit - abs(prev_profit)) - profit)
        # else:
        #     reward = (profit - prev_profit)

        # if  profit <= 0 :
        #     if profit < prev_profit:
        #         # if prev_profit <= 0 :
        #         #     reward = profit * 4
        #         # else:
        #         reward = profit * 2
        #     else :
        #         reward = profit * 0.5
        # elif profit >= 0 :
        #     if profit > prev_profit:
        #         # if prev_profit >= 0 :
        #         #     reward = profit * 2
        #         # else:
        #         reward = profit
        #     else :
        #         reward = profit * 0.25
        
        # if profit <= prev_profit and profit > 0:
        #     reward = profit * 0.75
        # else:
        #     reward = profit

        if profit > prev_profit:
            reward = profit * 5
        else:
            reward = profit

        # reward = profit - prev_profit if profit >= 0 or prev_profit >= 0 else max(profit, prev_profit)
        # reward = (profit - prev_profit)
        # reward = profit
        return reward
    
    def _get_observation(self):
        if self.current_step >= len(self.data):
            obs_dim = self.lookback_window * len(self.data.columns) + self.max_trades * 4 + 5  # +2 for avg profits
            return np.full((obs_dim,), -1)
    
        # Extract price and indicators
        current_price = self.data.iloc[self.current_step]['Middle_price']
        upper = self.data.iloc[self.current_step]['Upper_Band']
        lower = self.data.iloc[self.current_step]['Lower_Band']
        cci = self.data.iloc[self.current_step]['CCI']
        rsi = self.data.iloc[self.current_step]['RSI']
    
        self.volatility = self._calculate_volatility(cci, rsi, current_price, lower, upper)
    
        # Extract historical data
        start = max(0, self.current_step - self.lookback_window)
        end = self.current_step
        obs = self.data.iloc[start:end].values.flatten()
    
        # Padding for missing values if lookback window is not full
        if len(obs) < self.lookback_window * len(self.data.columns):
            padding = np.zeros(self.lookback_window * len(self.data.columns) - len(obs))
            obs = np.concatenate([padding, obs])
    
        # Separate profitable and unprofitable trades
        profitable_trades = [t for t in self.open_trades if t["profit"] > 0]
        unprofitable_trades = [t for t in self.open_trades if t["profit"] <= 0]
    
        # Calculate average profit for both groups
        sum_profit_profitable = np.sum([t["profit"] for t in profitable_trades]) if profitable_trades else 0
        sum_profit_unprofitable = np.sum([t["profit"] for t in unprofitable_trades]) if unprofitable_trades else 0
    
        # Encode trade information
        trade_obs = np.zeros((self.max_trades, 4)).flatten()
        for i, trade in enumerate(self.open_trades[:self.max_trades]):
            trade_obs[i * 4:(i + 1) * 4] = [
                trade["entry_price"], trade["position"], trade["step_count"], trade.get("profit", 0)
            ]
    
        # Final observation vector
        return np.concatenate([obs, trade_obs, [current_price, self.prev_profit, self.prev_unprofit, sum_profit_profitable, sum_profit_unprofitable]])

    def _calculate_profit(self, entry_price, exit_price, position):
        return (exit_price - entry_price) * position

    def reset(self):
        self.current_step = self.initial_step
        self.trades = []
        self.open_trades = self.initial_open_trades
        self.net_worth = self.initial_balance
        return self._get_observation()


    def step(self, action):
        reward = 0
        min_loss = 0.01  # 1%
        max_loss = 0.15  # 15%
    
        current_price = self.data.iloc[self.current_step]['Middle_price']
    
        # Separate trades into two groups
        profitable_trades = [t for t in self.open_trades if t["profit"] > 0]
        unprofitable_trades = [t for t in self.open_trades if t["profit"] <= 0]
    
        # Apply actions to groups
        # if action[0] == 0:  # Close profitable trades
        #     sumofprofit = 0
        #     sumstep = 0
        #     for trade in profitable_trades[:]:  # Iterate over a COPY to avoid list modification issues
        #         profit = self._calculate_profit(trade["entry_price"], current_price, trade["position"])
        #         trade["action"] = 0
        #         trade["exit_price"] = current_price
        #         trade["profit"] = profit
        #         trade["exit_step"] = self.current_step
        #         sumofprofit += profit                
        #         # sumstep = max(trade["step_count"], sumstep)
        #         self.balance += profit
        #         self.trades.append(trade)
        #         self.open_trades.remove(trade)  # SAFE NOW
        #     # reward += min(self._calculate_reward(sumofprofit, self.prev_profit) * (1 + 0.01 * sumstep), 1)
        #     reward += (self._calculate_reward(sumofprofit, self.prev_profit))
        #     # reward += (1 if sumofprofit > self.prev_profit else 0.5) * (1 if len(profitable_trades) > 0 else 0)
        #     self.prev_profit = max(sumofprofit, self.prev_profit)
        
        if action[0] == 0:  # Close profitable trades
            sumofprofit = sum(t["profit"] for t in profitable_trades)
            
            for trade in profitable_trades[:]:
                self.balance += trade["profit"]
                trade["action"] = 0
                trade["exit_price"] = current_price
                trade["exit_step"] = self.current_step
                self.trades.append(trade)
                self.open_trades.remove(trade)
        
            # Bonus for closing at peak profit
            reward += sumofprofit * (5 if sumofprofit > self.prev_profit else 1)
            self.prev_profit = max(sumofprofit, self.prev_profit)


        elif action[0] == 1:  # Hold profitable trades
            sumofprofit = sum(self._calculate_profit(t["entry_price"], current_price, t["position"]) for t in profitable_trades)
            
            for trade in profitable_trades:
                trade["step_count"] += 1
                trade["action"] = 1
                trade["profit"] = self._calculate_profit(trade["entry_price"], current_price, trade["position"])
    
                # hold_bonus = (-(math.exp(-0.02 * min(trade["step_count"], 150)) - math.exp(-0.0225 * max(trade["step_count"] - 150, 0))))
                # reward += trade["profit"] * (hold_bonus)
                # if sumofprofit > self.prev_profit:
                #     reward -= (sumofprofit - self.prev_profit) / max(len(profitable_trades),1)
                # else :
                #     hold_bonus = (-(math.exp(-0.02 * min(trade["step_count"], 150)) - math.exp(-0.0225 * max(trade["step_count"] - 150, 0))))
                #     reward += trade["profit"] * (hold_bonus)
            if sumofprofit > self.prev_profit:
                reward -= (sumofprofit - self.prev_profit)
            else :
                reward += sumofprofit * 0.01

        # elif action[0] == 1:  # Hold profitable trades
        #     sumofprofit = 0
        #     for trade in profitable_trades:
        #         profit = self._calculate_profit(trade["entry_price"], current_price, trade["position"])
        #         # reward += profit * 0.005 * trade["step_count"]
        #         sumofprofit += profit  
        #         trade["action"] = 1
        #         trade["profit"] = profit
        #         trade["step_count"] += 1  # Properly indented
        #     # reward += (1 if sumofprofit > self.prev_profit else 0.5) * (0.8 if len(profitable_trades) > 0 else 0)
        #     # reward += sumofprofit * 0.05
        #     if sumofprofit > self.prev_profit:
        #         reward += ((self.prev_profit - sumofprofit) * 5)
        #     else :
        #         reward += sumofprofit * 0.025
        #         # reward += (sumofprofit)
    
        if action[1] == 0:  # Close unprofitable trades
            sumofprofit = 0
            # sumstep = 0
            for trade in unprofitable_trades[:]:  # Iterate over a COPY to avoid list modification issues
                profit = self._calculate_profit(trade["entry_price"], current_price, trade["position"])
                # reward += self._calculate_reward(profit, self.prev_profit) * (1 + 0.01 * trade["step_count"])
                trade["action"] = 0
                trade["exit_price"] = current_price
                trade["profit"] = profit
                trade["exit_step"] = self.current_step
                sumofprofit += profit
                # sumstep = max(trade["step_count"], sumstep)
                self.balance += profit
                self.trades.append(trade)
                self.open_trades.remove(trade)  # SAFE NOW
            # reward += max(self._calculate_reward(sumofprofit, self.prev_profit) * (1 + 0.01 * sumstep), -1)
            # reward += (sumofprofit - self.prev_unprofit) * 2 if sumofprofit - self.prev_unprofit < 0 else sumofprofit - self.prev_unprofit
            # reward += (-1 if sumofprofit < self.prev_unprofit else 0.25) * (1 if len(unprofitable_trades) > 0 else 0)
            # reward += self._calculate_reward(sumofprofit, self.prev_profit)
            reward += sumofprofit * (2 if sumofprofit < self.prev_unprofit else 1)
            self.prev_unprofit = min(sumofprofit, self.prev_unprofit)

        
        elif action[1] == 1:  # Hold unprofitable trades
            sumofprofit = sum(self._calculate_profit(t["entry_price"], current_price, t["position"]) for t in unprofitable_trades)
        
            for trade in unprofitable_trades:
                trade["step_count"] += 1
                trade["action"] = 1
                trade["profit"] = self._calculate_profit(trade["entry_price"], current_price, trade["position"])
        
                # Penalize holding losing trades beyond 20 steps
                # penalty = -0.02 * max(0, trade["step_count"] - 20)  
                penalty = -0.005 * max(0, trade["step_count"] - 100)
                reward -= trade["profit"] * (0.01 + penalty)  
            reward += (sumofprofit*5 if sumofprofit < self.prev_unprofit else 0) * (1 if len(unprofitable_trades) > 0 else 0)
        # elif action[1] == 1:  # Hold unprofitable trades
        #     sumofprofit = 0
        #     for trade in unprofitable_trades:
        #         profit = self._calculate_profit(trade["entry_price"], current_price, trade["position"])
        #         sumofprofit += profit
        #         # reward += profit * 0.005 * trade["step_count"]
        #         trade["action"] = 1
        #         trade["profit"] = profit
        #         trade["step_count"] += 1  # Properly indented
        #     # reward += sumofprofit * 0.1
        #     # reward += (-1 if sumofprofit < self.prev_unprofit else 0.25) * (0.5 if len(unprofitable_trades) > 0 else 0)
        #     # reward += (sumofprofit if sumofprofit < self.prev_unprofit else abs(sumofprofit) * 0.25) * (0.5 if len(unprofitable_trades) > 0 else 0)
        #     reward += (sumofprofit * 5 if sumofprofit < self.prev_unprofit else sumofprofit * 0.05)


        new_trade_action = action[2]
        if new_trade_action in [0, 1] and len(self.open_trades) < self.max_trades:
            # volatility_threshold = 0.07  # Example threshold, adjust as needed
            # if self.volatility > volatility_threshold:
            stoploss_percentage = min_loss + (max_loss - min_loss) * self.volatility
            self.open_trades.append({
                "ticket": -1,
                "entry_price": current_price,
                "position": 1 if new_trade_action == 0 else -1,
                "profit": 0,
                "entry_step": self.current_step,
                "step_count": 0,
                "sl_percentage": stoploss_percentage,  
                "action": 2 if new_trade_action == 0 else 3
            })
            # reward += 0.001  # Small penalty for opening unnecessary trades

        # Handle new trades
        # new_trade_action = action[2]
        # if new_trade_action == 0:  # Buy
        #     if len(self.open_trades) < self.max_trades and self.balance >= current_price:
        #         stoploss_percentage = min_loss + (max_loss - min_loss) * self.volatility
        #         self.open_trades.append({
        #             "ticket": -1,
        #             "entry_price": current_price,
        #             "position": 1,  
        #             "profit": 0,
        #             "entry_step": self.current_step,
        #             "step_count": 0,
        #             "sl_percentage": stoploss_percentage,  
        #             "action": 2
        #         })
        #         # self.balance -= current_price
        # elif new_trade_action == 1:  # Sell
        #     if len(self.open_trades) < self.max_trades and self.balance >= current_price:
        #         stoploss_percentage = min_loss + (max_loss - min_loss) * self.volatility
        #         self.open_trades.append({
        #             "ticket": -1,
        #             "entry_price": current_price,
        #             "position": -1,  # Short position
        #             "profit": 0,
        #             "entry_step": self.current_step,
        #             "step_count": 0,
        #             "sl_percentage": stoploss_percentage,  
        #             "action": 3
        #         })
        #         # self.balance -= current_price
        

        # Update net worth
        self.net_worth = self.balance + sum(
            (current_price - trade["entry_price"]) * trade["position"] for trade in self.open_trades
        )

        self.current_step += self.overlap
        done = self.current_step >= len(self.data)

        return self._get_observation(), reward, done, {
            "open_trades": self.open_trades, 
            "completed_trades": self.trades,
            "balance": self.balance,
            "net_worth": self.net_worth 
        }


    def render(self, mode="human"):
        print(f"Step: {self.current_step}, Balance: {self.balance}, Net Worth: {self.net_worth}")


