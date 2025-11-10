import React, { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';

function EnhancedPortfolio() {
  const { address, isConnected } = useAccount();
  const [portfolio, setPortfolio] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [sortBy, setSortBy] = useState('value');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      fetchEnhancedPortfolio();
    }
  }, [isConnected, address, timeRange]);

  const fetchEnhancedPortfolio = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced mock portfolio data
      const mockPortfolio = [
        {
          token: 'Moon Dog',
          symbol: 'MDOG',
          balance: 15420.50,
          value: 1200.34,
          buyPrice: 0.00234,
          currentPrice: 0.00341,
          change: 45.7,
          change7d: 123.4,
          change30d: 234.5,
          image: 'https://picsum.photos/100/100?random=1',
          allocation: 35.2,
          risk: 'High',
          marketCap: 2340000,
          volume24h: 890000,
        },
        {
          token: 'Rocket Cat',
          symbol: 'RCAT',
          balance: 8930.25,
          value: 560.78,
          buyPrice: 0.00156,
          currentPrice: 0.00137,
          change: -12.3,
          change7d: -8.9,
          change30d: 67.8,
          image: 'https://picsum.photos/100/100?random=2',
          allocation: 16.4,
          risk: 'Medium',
          marketCap: 1560000,
          volume24h: 450000,
        },
        {
          token: 'Diamond Hands',
          symbol: 'DHAND',
          balance: 25600.00,
          value: 890.45,
          buyPrice: 0.00445,
          currentPrice: 0.00548,
          change: 23.1,
          change7d: 45.6,
          change30d: 89.7,
          image: 'https://picsum.photos/100/100?random=4',
          allocation: 26.0,
          risk: 'Low',
          marketCap: 4450000,
          volume24h: 670000,
        },
        {
          token: 'Galaxy Frog',
          symbol: 'GFROG',
          balance: 7650.33,
          value: 234.67,
          buyPrice: 0.00098,
          currentPrice: 0.00251,
          change: 156.8,
          change7d: 189.3,
          change30d: 445.7,
          image: 'https://picsum.photos/100/100?random=5',
          allocation: 6.9,
          risk: 'Very High',
          marketCap: 980000,
          volume24h: 340000,
        },
        {
          token: 'Crypto King',
          symbol: 'CKING',
          balance: 3200.12,
          value: 534.89,
          buyPrice: 0.01234,
          currentPrice: 0.01671,
          change: 35.4,
          change7d: 28.7,
          change30d: 156.9,
          image: 'https://picsum.photos/100/100?random=6',
          allocation: 15.6,
          risk: 'Medium',
          marketCap: 12340000,
          volume24h: 890000,
        },
      ];

      // Generate portfolio history
      const history = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        value: 3420 + Math.random() * 1000 - 500,
        change: (Math.random() - 0.5) * 20,
      }));

      setPortfolio(mockPortfolio);
      setPortfolioHistory(history);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);
    const totalPnL = portfolio.reduce((sum, item) => sum + (item.value * item.change / 100), 0);
    const totalPnLPercent = totalValue > 0 ? (totalPnL / totalValue) * 100 : 0;

    const bestPerformer = portfolio.reduce((best, current) => 
      current.change > (best?.change || -Infinity) ? current : best, null);
    const worstPerformer = portfolio.reduce((worst, current) => 
      current.change < (worst?.change || Infinity) ? current : worst, null);

    const riskDistribution = portfolio.reduce((acc, token) => {
      acc[token.risk] = (acc[token.risk] || 0) + token.allocation;
      return acc;
    }, {});

    return {
      totalValue,
      totalPnL,
      totalPnLPercent,
      bestPerformer,
      worstPerformer,
      riskDistribution,
    };
  }, [portfolio]);

  const sortedPortfolio = useMemo(() => {
    return [...portfolio].sort((a, b) => {
      switch (sortBy) {
        case 'value': return b.value - a.value;
        case 'change': return b.change - a.change;
        case 'allocation': return b.allocation - a.allocation;
        case 'risk': 
          const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 };
          return riskOrder[a.risk] - riskOrder[b.risk];
        default: return 0;
      }
    });
  }, [portfolio, sortBy]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-orange-400';
      case 'Very High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4 animate-bounce">📊</div>
        <h3 className="text-2xl font-bold mb-4 gradient-text">Enhanced Portfolio Dashboard</h3>
        <p className="text-gray-400">Connect your wallet to view your advanced portfolio analytics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin text-6xl mb-4">📈</div>
        <p className="text-xl text-gray-300">Analyzing your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Enhanced Portfolio</h2>
        <p className="text-xl text-gray-300">Advanced analytics for your memecoin empire</p>
      </div>

      {/* Portfolio Overview */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Portfolio Overview</h3>
          <div className="flex gap-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <h4 className="text-sm text-gray-400 mb-2">Total Value</h4>
            <p className="text-3xl font-bold text-white">${stats.totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">
              {address?.slice(0, 8)}...{address?.slice(-4)}
            </p>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <h4 className="text-sm text-gray-400 mb-2">Total P&L ({timeRange})</h4>
            <p className={`text-3xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
            </p>
            <p className={`text-sm ${stats.totalPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnLPercent >= 0 ? '+' : ''}{stats.totalPnLPercent.toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <h4 className="text-sm text-gray-400 mb-2">Best Performer</h4>
            <p className="text-lg font-bold text-white">{stats.bestPerformer?.symbol}</p>
            <p className="text-green-400 text-sm">+{stats.bestPerformer?.change.toFixed(1)}%</p>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <h4 className="text-sm text-gray-400 mb-2">Holdings</h4>
            <p className="text-3xl font-bold text-white">{portfolio.length}</p>
            <p className="text-sm text-gray-400">Tokens</p>
          </div>
        </div>

        {/* Portfolio Chart */}
        <div className="chart-container rounded-xl p-6 h-64 mb-6">
          <div className="flex items-end justify-around h-full space-x-1">
            {portfolioHistory.slice(-30).map((point, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                style={{ 
                  height: `${Math.max(10, (point.value / Math.max(...portfolioHistory.map(p => p.value))) * 100)}%`,
                  width: '100%'
                }}
                title={`${point.date.toLocaleDateString()}: $${point.value.toFixed(2)}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Risk Distribution</h4>
          <div className="flex justify-between items-center">
            {Object.entries(stats.riskDistribution).map(([risk, percentage]) => (
              <div key={risk} className="text-center">
                <div className={`text-2xl font-bold ${getRiskColor(risk)}`}>
                  {percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">{risk} Risk</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Holdings</h3>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white"
            >
              <option value="value">Sort by Value</option>
              <option value="change">Sort by Change</option>
              <option value="allocation">Sort by Allocation</option>
              <option value="risk">Sort by Risk</option>
            </select>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Token</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Balance</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Change {timeRange}</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Allocation</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {sortedPortfolio.map((holding, index) => (
                <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img 
                        src={holding.image} 
                        alt={holding.token}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-purple-500/30"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{holding.token}</h4>
                        <p className="text-purple-300 text-sm">{holding.symbol}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <p className="font-semibold text-white">{holding.balance.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">tokens</p>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <p className="font-semibold text-white">${holding.value.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">
                      ${(holding.value * (holding.change / 100)).toFixed(2)} PnL
                    </p>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <p className="font-semibold text-white">${holding.currentPrice.toFixed(6)}</p>
                    <p className="text-gray-400 text-sm">
                      Entry: ${holding.buyPrice.toFixed(6)}
                    </p>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <p className={`font-semibold ${holding.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(1)}%
                    </p>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <p className="font-semibold text-white">{holding.allocation.toFixed(1)}%</p>
                    <div className="w-16 h-2 bg-gray-700 rounded-full ml-auto mt-1">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${holding.allocation}%` }}
                      ></div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <span className={`font-semibold ${getRiskColor(holding.risk)}`}>
                      {holding.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Analytics */}
      {showAnalytics && (
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-white mb-6">Advanced Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-4">Sharpe Ratio</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">2.34</p>
                <p className="text-sm text-gray-400">Risk-adjusted return</p>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-4">Max Drawdown</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-400">-15.7%</p>
                <p className="text-sm text-gray-400">Maximum loss from peak</p>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-4">Volatility</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-400">45.2%</p>
                <p className="text-sm text-gray-400">30-day volatility</p>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-4">Win Rate</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">67.8%</p>
                <p className="text-sm text-gray-400">Profitable positions</p>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-4">Avg Hold Time</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">12.5d</p>
                <p className="text-sm text-gray-400">Average holding period</p>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-4">Diversification</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">0.78</p>
                <p className="text-sm text-gray-400">Portfolio diversity score</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.EnhancedPortfolio = EnhancedPortfolio;