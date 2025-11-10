import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';

function AdvancedTradingInterface({ token }) {
  const { isConnected } = useAccount();
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [chartInterval, setChartInterval] = useState('1h');
  const [orders, setOrders] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [isTrading, setIsTrading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Memoized current price calculation
  const currentPrice = useMemo(() => {
    return token?.price || 0.00234;
  }, [token]);

  // Real-time price updates simulation
  useEffect(() => {
    const generatePriceData = () => {
      const basePrice = currentPrice;
      const newData = Array.from({ length: 100 }, (_, i) => {
        const time = Date.now() - (99 - i) * 60000;
        const volatility = 0.1;
        const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
        return {
          time,
          open: price * (1 + (Math.random() - 0.5) * 0.02),
          high: price * (1 + Math.random() * 0.05),
          low: price * (1 - Math.random() * 0.05),
          close: price,
          volume: Math.random() * 1000000,
        };
      });
      setPriceData(newData);
    };

    generatePriceData();
    const interval = setInterval(generatePriceData, 5000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  // Add notification
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Advanced order placement
  const handleAdvancedTrade = async () => {
    if (!isConnected || !amount) return;
    
    setIsTrading(true);
    try {
      const order = {
        id: Date.now(),
        type: orderType,
        side,
        amount: parseFloat(amount),
        price: orderType === 'market' ? currentPrice : parseFloat(price),
        stopPrice: parseFloat(stopPrice) || null,
        status: orderType === 'market' ? 'filled' : 'pending',
        timestamp: new Date(),
      };

      if (orderType === 'market') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        addNotification(`${side.toUpperCase()} order filled successfully!`, 'success');
      } else {
        setOrders(prev => [...prev, order]);
        addNotification(`${orderType.toUpperCase()} order placed successfully!`, 'info');
      }

      setAmount('');
      setPrice('');
      setStopPrice('');
    } catch (error) {
      console.error('Trade failed:', error);
      addNotification('Trade failed. Please try again.', 'error');
    } finally {
      setIsTrading(false);
    }
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    addNotification('Order cancelled successfully!', 'info');
  };

  const estimatedValue = useMemo(() => {
    const orderPrice = orderType === 'market' ? currentPrice : parseFloat(price) || currentPrice;
    return amount ? parseFloat(amount) * orderPrice : 0;
  }, [amount, price, currentPrice, orderType]);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`glass-morphism p-4 rounded-lg shadow-lg animate-slide-in-right ${
              notification.type === 'success' ? 'border-green-500/50' :
              notification.type === 'error' ? 'border-red-500/50' :
              'border-blue-500/50'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {notification.type === 'success' ? '✅' : 
                 notification.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <span className="text-white text-sm">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Chart */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">
            {token?.symbol || 'TOKEN'} Advanced Trading
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">${currentPrice.toFixed(6)}</p>
              <p className="text-green-400 text-sm">+12.4% (24h)</p>
            </div>
            <div className="flex bg-gray-800/30 rounded-lg p-1">
              {['5m', '15m', '1h', '4h', '1d'].map((interval) => (
                <button
                  key={interval}
                  onClick={() => setChartInterval(interval)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    chartInterval === interval 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Candlestick Chart Simulation */}
        <div className="chart-container rounded-xl p-4 h-80 flex items-end justify-around space-x-1">
          {priceData.slice(-50).map((candle, i) => {
            const bodyHeight = Math.abs(candle.close - candle.open) / candle.high * 100;
            const isGreen = candle.close > candle.open;
            return (
              <div key={i} className="relative" style={{ width: '2%' }}>
                {/* Wick */}
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 bg-gray-400"
                  style={{
                    width: '1px',
                    height: `${((candle.high - candle.low) / candle.high) * 100}%`,
                    bottom: `${(candle.low / candle.high) * 100}%`,
                  }}
                />
                {/* Body */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-full ${
                    isGreen ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  style={{
                    height: `${bodyHeight}%`,
                    bottom: `${(Math.min(candle.open, candle.close) / candle.high) * 100}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advanced Order Panel */}
        <div className="glass-morphism rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-white mb-4">Place Order</h4>
          
          {/* Order Type Selection */}
          <div className="flex mb-4 bg-gray-800/30 rounded-xl p-1">
            {['market', 'limit', 'stop-loss'].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  orderType === type 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>

          {/* Buy/Sell Toggle */}
          <div className="flex mb-6 bg-gray-800/30 rounded-xl p-1">
            <button
              onClick={() => setSide('buy')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                side === 'buy' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSide('sell')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                side === 'sell' 
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
                Amount ({token?.symbol || 'TOKEN'})
              </label>
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {orderType !== 'market' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  placeholder={currentPrice.toFixed(6)}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            )}

            {orderType === 'stop-loss' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stop Price (USD)
                </label>
                <input
                  type="number"
                  placeholder={(currentPrice * 0.9).toFixed(6)}
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            )}

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
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.1%</span>
                <span>5%</span>
              </div>
            </div>

            {amount && (
              <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-white font-semibold">${estimatedValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee (0.25%):</span>
                  <span className="text-white">${(estimatedValue * 0.0025).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slippage:</span>
                  <span className="text-yellow-400">{slippage}%</span>
                </div>
              </div>
            )}

            <button
              onClick={handleAdvancedTrade}
              disabled={!isConnected || !amount || isTrading}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                side === 'buy'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
              } ${(!isConnected || !amount) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 animate-pulse-glow'} text-white`}
            >
              {!isConnected ? 'Connect Wallet' : 
               isTrading ? 'Processing...' : 
               `${orderType === 'market' ? 'Market' : 'Place'} ${side.toUpperCase()} Order`}
            </button>
          </div>
        </div>

        {/* Open Orders & History */}
        <div className="space-y-6">
          {/* Open Orders */}
          <div className="glass-morphism rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Open Orders</h4>
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No open orders</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.side === 'buy' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'
                        }`}>
                          {order.side.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-xs">{order.type}</span>
                      </div>
                      <p className="text-white text-sm">
                        {order.amount} {token?.symbol} @ ${order.price.toFixed(6)}
                      </p>
                    </div>
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Book */}
          <div className="glass-morphism rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Order Book</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
              </div>
              
              {/* Sell orders */}
              {[...Array(5)].map((_, i) => (
                <div key={`sell-${i}`} className="flex justify-between items-center py-1 text-sm">
                  <span className="text-red-400">
                    ${(currentPrice * (1 + (i + 1) * 0.01)).toFixed(6)}
                  </span>
                  <span className="text-white">
                    {(Math.random() * 1000).toFixed(0)}
                  </span>
                  <span className="text-gray-400">
                    ${(Math.random() * 10000).toFixed(0)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-gray-700 my-2"></div>
              
              {/* Buy orders */}
              {[...Array(5)].map((_, i) => (
                <div key={`buy-${i}`} className="flex justify-between items-center py-1 text-sm">
                  <span className="text-green-400">
                    ${(currentPrice * (1 - (i + 1) * 0.01)).toFixed(6)}
                  </span>
                  <span className="text-white">
                    {(Math.random() * 1000).toFixed(0)}
                  </span>
                  <span className="text-gray-400">
                    ${(Math.random() * 10000).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AdvancedTradingInterface = AdvancedTradingInterface;