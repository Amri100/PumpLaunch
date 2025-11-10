import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

function Portfolio() {
  const { address, isConnected } = useAccount();
  const [portfolio, setPortfolio] = useState([]);
  const [stats, setStats] = useState({
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    bestPerformer: null,
    worstPerformer: null,
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchPortfolio();
    }
  }, [isConnected, address]);

  const fetchPortfolio = async () => {
    // Mock portfolio data
    const mockPortfolio = [
      {
        token: 'Moon Dog',
        symbol: 'MDOG',
        balance: 15420.50,
        value: 1200.34,
        change: 45.7,
        image: 'https://picsum.photos/100/100?random=1',
      },
      {
        token: 'Rocket Cat',
        symbol: 'RCAT',
        balance: 8930.25,
        value: 560.78,
        change: -12.3,
        image: 'https://picsum.photos/100/100?random=2',
      },
      {
        token: 'Diamond Hands',
        symbol: 'DHAND',
        balance: 25600.00,
        value: 890.45,
        change: 23.1,
        image: 'https://picsum.photos/100/100?random=4',
      },
      {
        token: 'Galaxy Frog',
        symbol: 'GFROG',
        balance: 7650.33,
        value: 234.67,
        change: 156.8,
        image: 'https://picsum.photos/100/100?random=5',
      },
    ];

    setPortfolio(mockPortfolio);

    const totalValue = mockPortfolio.reduce((sum, item) => sum + item.value, 0);
    const totalPnL = mockPortfolio.reduce((sum, item) => sum + (item.value * item.change / 100), 0);
    const totalPnLPercent = (totalPnL / totalValue) * 100;

    const bestPerformer = mockPortfolio.reduce((best, current) => 
      current.change > (best?.change || -Infinity) ? current : best, null);
    const worstPerformer = mockPortfolio.reduce((worst, current) => 
      current.change < (worst?.change || Infinity) ? current : worst, null);

    setStats({
      totalValue,
      totalPnL,
      totalPnLPercent,
      bestPerformer,
      worstPerformer,
    });
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold mb-4 gradient-text">Portfolio Dashboard</h3>
        <p className="text-gray-400">Connect your wallet to view your holdings</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Portfolio</h2>
        <p className="text-xl text-gray-300">Track your memecoin empire</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-morphism rounded-xl p-6 text-center">
          <h3 className="text-sm text-gray-400 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-white">${stats.totalValue.toFixed(2)}</p>
        </div>
        
        <div className="glass-morphism rounded-xl p-6 text-center">
          <h3 className="text-sm text-gray-400 mb-2">Total P&L</h3>
          <p className={`text-3xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
          </p>
          <p className={`text-sm ${stats.totalPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalPnLPercent >= 0 ? '+' : ''}{stats.totalPnLPercent.toFixed(1)}%
          </p>
        </div>
        
        <div className="glass-morphism rounded-xl p-6 text-center">
          <h3 className="text-sm text-gray-400 mb-2">Best Performer</h3>
          <p className="text-lg font-bold text-white">{stats.bestPerformer?.symbol}</p>
          <p className="text-green-400 text-sm">+{stats.bestPerformer?.change.toFixed(1)}%</p>
        </div>
        
        <div className="glass-morphism rounded-xl p-6 text-center">
          <h3 className="text-sm text-gray-400 mb-2">Worst Performer</h3>
          <p className="text-lg font-bold text-white">{stats.worstPerformer?.symbol}</p>
          <p className="text-red-400 text-sm">{stats.worstPerformer?.change.toFixed(1)}%</p>
        </div>
      </div>

      {/* Holdings List */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">Holdings</h3>
        <div className="space-y-4">
          {portfolio.map((holding, index) => (
            <div key={index} className="token-card bg-gray-800/30 rounded-xl p-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={holding.image} 
                    alt={holding.token}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-purple-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-white">{holding.token}</h4>
                    <p className="text-purple-300 text-sm">{holding.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-white">{holding.balance.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">tokens</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-white">${holding.value.toFixed(2)}</p>
                  <p className={`text-sm ${holding.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">Portfolio Performance</h3>
        <div className="chart-container rounded-xl p-4 h-64 flex items-end justify-around space-x-1">
          {[...Array(30)].map((_, i) => {
            const height = Math.max(10, Math.random() * 100);
            return (
              <div
                key={i}
                className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%`, width: '100%' }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.Portfolio = Portfolio;