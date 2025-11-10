import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function TokenExplorer() {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'new', label: 'New Launches', icon: '🚀' },
    { id: 'top_gainers', label: 'Top Gainers', icon: '📈' },
    { id: 'volume', label: 'High Volume', icon: '💰' },
  ];

  useEffect(() => {
    fetchTokens();
  }, [filter]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock token data
      const mockTokens = [
        {
          id: 'moondog',
          name: 'Moon Dog',
          symbol: 'MDOG',
          image: 'https://picsum.photos/100/100?random=1',
          price: 0.00234,
          change24h: 156.7,
          marketCap: 2340000,
          volume24h: 890000,
          holders: 15420,
          description: 'The first dog to reach the moon! 🌙🐕',
        },
        {
          id: 'rocketcat',
          name: 'Rocket Cat',
          symbol: 'RCAT',
          image: 'https://picsum.photos/100/100?random=2',
          price: 0.00156,
          change24h: -23.4,
          marketCap: 1560000,
          volume24h: 450000,
          holders: 8930,
          description: 'Cats conquering space, one purr at a time! 🚀🐱',
        },
        {
          id: 'memewizard',
          name: 'Meme Wizard',
          symbol: 'MWIZ',
          image: 'https://picsum.photos/100/100?random=3',
          price: 0.00789,
          change24h: 89.2,
          marketCap: 7890000,
          volume24h: 1200000,
          holders: 25600,
          description: 'Casting meme magic across the blockchain! 🧙‍♂️✨',
        },
        {
          id: 'diamondhands',
          name: 'Diamond Hands',
          symbol: 'DHAND',
          image: 'https://picsum.photos/100/100?random=4',
          price: 0.00445,
          change24h: 12.8,
          marketCap: 4450000,
          volume24h: 670000,
          holders: 18900,
          description: 'For those who never sell! 💎🙌',
        },
        {
          id: 'galaxyfrog',
          name: 'Galaxy Frog',
          symbol: 'GFROG',
          image: 'https://picsum.photos/100/100?random=5',
          price: 0.00098,
          change24h: 245.6,
          marketCap: 980000,
          volume24h: 340000,
          holders: 7650,
          description: 'Hopping across galaxies! 🐸🌌',
        },
        {
          id: 'cryptoking',
          name: 'Crypto King',
          symbol: 'CKING',
          image: 'https://picsum.photos/100/100?random=6',
          price: 0.01234,
          change24h: -5.7,
          marketCap: 12340000,
          volume24h: 890000,
          holders: 34500,
          description: 'Rule the crypto kingdom! 👑⚔️',
        },
      ];
      
      setTokens(mockTokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TokenCard = ({ token }) => (
    <div 
      className="token-card glass-morphism rounded-xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:scale-105"
      onClick={() => navigate(`/${token.id}`)}
    >
      <div className="flex items-center mb-4">
        <img 
          src={token.image} 
          alt={token.name}
          className="w-12 h-12 rounded-full mr-3 border-2 border-purple-500/30"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white">{token.name}</h3>
          <p className="text-purple-300">${token.symbol}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-white">${token.price.toFixed(6)}</p>
          <p className={`text-sm ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{token.description}</p>
      
      <div className="grid grid-cols-3 gap-4 text-xs">
        <div>
          <p className="text-gray-400">Market Cap</p>
          <p className="text-white font-semibold">${(token.marketCap / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-gray-400">Volume 24h</p>
          <p className="text-white font-semibold">${(token.volume24h / 1000).toFixed(0)}K</p>
        </div>
        <div>
          <p className="text-gray-400">Holders</p>
          <p className="text-white font-semibold">{(token.holders / 1000).toFixed(1)}K</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin text-6xl mb-4">🪙</div>
        <p className="text-xl text-gray-300">Loading amazing tokens...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Discover Tokens</h2>
        <p className="text-xl text-gray-300">Find the next 100x gem</p>
      </div>

      {/* Search and Filters */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filter === f.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-xl text-gray-400">No tokens found matching your search</p>
        </div>
      )}
    </div>
  );
}

window.TokenExplorer = TokenExplorer;