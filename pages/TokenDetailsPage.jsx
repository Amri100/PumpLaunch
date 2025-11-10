import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TokenDetailsPage() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('trading');

  useEffect(() => {
    fetchTokenDetails();
  }, [tokenId]);

  const fetchTokenDetails = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock token data based on ID
      const mockData = {
        moondog: {
          name: 'Moon Dog',
          symbol: 'MDOG',
          image: 'https://picsum.photos/200/200?random=1',
          price: 0.00234,
          change24h: 156.7,
          marketCap: 2340000,
          volume24h: 890000,
          holders: 15420,
          totalSupply: 1000000000,
          description: 'The first dog to reach the moon! 🌙🐕 Join our pack as we explore the lunar surface and beyond. Moon Dog represents the spirit of adventure and the pursuit of impossible dreams.',
          website: 'https://moondog.space',
          twitter: 'https://twitter.com/moondog',
          telegram: 'https://t.me/moondog',
          contract: '0x1234567890123456789012345678901234567890',
        },
        rocketcat: {
          name: 'Rocket Cat',
          symbol: 'RCAT',
          image: 'https://picsum.photos/200/200?random=2',
          price: 0.00156,
          change24h: -23.4,
          marketCap: 1560000,
          volume24h: 450000,
          holders: 8930,
          totalSupply: 500000000,
          description: 'Cats conquering space, one purr at a time! 🚀🐱 Our feline astronauts are on a mission to establish the first cat colony on Mars.',
          website: 'https://rocketcat.io',
          twitter: 'https://twitter.com/rocketcat',
          telegram: 'https://t.me/rocketcat',
          contract: '0x2345678901234567890123456789012345678901',
        }
      };
      
      const data = mockData[tokenId];
      if (data) {
        setTokenData(data);
      } else {
        setError('Token not found');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-token-spin text-8xl mb-6">🪙</div>
        <h2 className="text-2xl font-semibold text-white mb-4">Loading Token Data</h2>
        <p className="text-gray-400">Fetching the latest information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="text-8xl mb-6">😞</div>
        <h2 className="text-3xl font-bold text-white mb-4">Token Not Found</h2>
        <p className="text-gray-400 mb-8">The token you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-6"
        >
          ← Back to Explorer
        </button>

        {/* Token Header */}
        <div className="glass-morphism rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <img
              src={tokenData.image}
              alt={tokenData.name}
              className="w-24 h-24 rounded-full border-4 border-purple-500/30 animate-token-spin"
            />
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{tokenData.name}</h1>
              <p className="text-xl text-purple-300 mb-4">${tokenData.symbol}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-800/30 rounded-lg px-3 py-1">
                  <span className="text-gray-400 text-sm">Contract: </span>
                  <span className="text-white font-mono text-sm">
                    {tokenData.contract.slice(0, 8)}...{tokenData.contract.slice(-6)}
                  </span>
                </div>
                <div className="bg-gray-800/30 rounded-lg px-3 py-1">
                  <span className="text-gray-400 text-sm">Network: </span>
                  <span className="text-purple-300 text-sm">Ethereum</span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <p className="text-4xl font-bold text-white mb-2">
                ${tokenData.price.toFixed(6)}
              </p>
              <p className={`text-lg font-semibold ${
                tokenData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {tokenData.change24h >= 0 ? '+' : ''}{tokenData.change24h.toFixed(1)}% (24h)
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-morphism rounded-xl p-6 text-center">
            <h3 className="text-sm text-gray-400 mb-2">Market Cap</h3>
            <p className="text-2xl font-bold text-white">
              ${(tokenData.marketCap / 1000000).toFixed(1)}M
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 text-center">
            <h3 className="text-sm text-gray-400 mb-2">Volume 24h</h3>
            <p className="text-2xl font-bold text-white">
              ${(tokenData.volume24h / 1000).toFixed(0)}K
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 text-center">
            <h3 className="text-sm text-gray-400 mb-2">Holders</h3>
            <p className="text-2xl font-bold text-white">
              {(tokenData.holders / 1000).toFixed(1)}K
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 text-center">
            <h3 className="text-sm text-gray-400 mb-2">Total Supply</h3>
            <p className="text-2xl font-bold text-white">
              {(tokenData.totalSupply / 1000000).toFixed(0)}M
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-morphism rounded-2xl p-1">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass-morphism rounded-2xl p-8">
          {activeTab === 'trading' && window.TradingInterface && (
            <window.TradingInterface token={tokenData} />
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">About {tokenData.name}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {tokenData.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-purple-300 mb-4">Links</h4>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={tokenData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-colors"
                  >
                    🌐 Website
                  </a>
                  <a
                    href={tokenData.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-600/20 text-sky-400 px-4 py-2 rounded-lg hover:bg-sky-600/30 transition-colors"
                  >
                    🐦 Twitter
                  </a>
                  <a
                    href={tokenData.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    ✈️ Telegram
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-4">Community Hub</h3>
              <p className="text-gray-400 text-center py-8">
                Community features coming soon! 🚀
              </p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-4">Token Analytics</h3>
              
              {/* Price Chart */}
              <div className="chart-container rounded-xl p-6 h-64">
                <div className="flex items-end justify-around h-full space-x-1">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                      style={{
                        height: `${Math.max(10, Math.random() * 100)}%`,
                        width: '100%'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Top Holders</h4>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-400 font-mono">
                          0x{Math.random().toString(16).slice(2, 10)}...
                        </span>
                        <span className="text-white">
                          {(Math.random() * 10).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Recent Transactions</h4>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className={`${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                          {Math.random() > 0.5 ? 'BUY' : 'SELL'}
                        </span>
                        <span className="text-white">
                          {(Math.random() * 1000).toFixed(0)} {tokenData.symbol}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.TokenDetailsPage = TokenDetailsPage;