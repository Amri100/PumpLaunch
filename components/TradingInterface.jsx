import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

function TradingInterface({ token }) {
  const { isConnected } = useAccount();
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [priceData, setPriceData] = useState([]);
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    generatePriceData();
    const interval = setInterval(generatePriceData, 5000);
    return () => clearInterval(interval);
  }, []);

  const generatePriceData = () => {
    const newData = Array.from({ length: 50 }, (_, i) => ({
      time: Date.now() - (49 - i) * 60000,
      price: 0.00234 + Math.random() * 0.001 - 0.0005,
      volume: Math.random() * 1000000,
    }));
    setPriceData(newData);
  };

  const handleTrade = async () => {
    if (!isConnected || !amount) return;
    
    setIsTrading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${orderType === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`);
      setAmount('');
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsTrading(false);
    }
  };

  const currentPrice = token?.price || 0.00234;
  const estimatedTokens = amount ? parseFloat(amount) / currentPrice : 0;
  const estimatedValue = amount ? parseFloat(amount) : 0;

  return (
    <div className="space-y-6">
      {/* Price Chart */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">
            {token?.symbol || 'TOKEN'} Trading
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">${currentPrice.toFixed(6)}</p>
            <p className="text-green-400">+12.4% (24h)</p>
          </div>
        </div>
        
        <div className="chart-container rounded-xl p-4 h-64 flex items-end justify-around space-x-1">
          {priceData.map((point, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
              style={{ 
                height: `${Math.max(10, (point.price / Math.max(...priceData.map(p => p.price))) * 100)}%`,
                width: '100%'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Trading Panel */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex mb-6 bg-gray-800/30 rounded-xl p-1">
          <button
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              orderType === 'buy' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              orderType === 'sell' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slippage Tolerance: {slippage}%
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {amount && (
            <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">You'll receive:</span>
                <span className="text-white font-semibold">
                  {estimatedTokens.toFixed(2)} {token?.symbol || 'TOKEN'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price per token:</span>
                <span className="text-white">${currentPrice.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slippage:</span>
                <span className="text-yellow-400">{slippage}%</span>
              </div>
            </div>
          )}

          <button
            onClick={handleTrade}
            disabled={!isConnected || !amount || isTrading}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              orderType === 'buy'
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
            } ${(!isConnected || !amount) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} text-white animate-pulse-glow`}
          >
            {!isConnected ? 'Connect Wallet' : 
             isTrading ? 'Processing...' : 
             `${orderType === 'buy' ? 'Buy' : 'Sell'} ${token?.symbol || 'TOKEN'}`}
          </button>
        </div>
      </div>

      {/* Order Book */}
      <div className="glass-morphism rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Recent Trades</h4>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700/30">
              <span className={`text-sm ${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.random() > 0.5 ? 'BUY' : 'SELL'}
              </span>
              <span className="text-white text-sm">
                {(Math.random() * 1000).toFixed(0)} {token?.symbol || 'TOKEN'}
              </span>
              <span className="text-gray-400 text-sm">
                ${(currentPrice * (0.9 + Math.random() * 0.2)).toFixed(6)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TradingInterface = TradingInterface;