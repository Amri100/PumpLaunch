import React, { useState, useEffect } from 'react';

function CryptoNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('memecoins');

  const filters = [
    { id: 'memecoins', label: 'Memecoins', icon: '🐕' },
    { id: 'defi', label: 'DeFi', icon: '🏦' },
    { id: 'nft', label: 'NFTs', icon: '🖼️' },
    { id: 'general', label: 'General', icon: '📰' },
  ];

  const formatPublishedDate = (dateString) => {
    try {
      const publishedDate = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - publishedDate) / (1000 * 60 * 60));

      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} days ago`;

      return publishedDate.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const extractSource = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return 'Unknown Source';
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const query = filter === 'general' ? 'crypto' : filter;
      const response = await fetch(
        `https://ide-api.infinityg.ai/api/search?query=${query}`
      );
      const data = await response.json();
      
      if (data.results && Array.isArray(data.results)) {
        // Add some mock memecoin-specific news for better demo
        const mockNews = [
          {
            title: "New Memecoin 'Galaxy Frog' Surges 300% in 24 Hours",
            content: "The latest Solana-based memecoin featuring a cartoon frog has captured investors' attention with its unique staking mechanics and viral marketing campaign.",
            url: "https://example.com/galaxy-frog-surge",
            published_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            title: "Pump.fun Alternative Launches with Enhanced Security Features",
            content: "A new token launchpad promises better security measures and rug-pull protection while maintaining the ease of use that made Pump.fun popular.",
            url: "https://example.com/new-launchpad",
            published_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          }
        ];
        
        const combinedNews = filter === 'memecoins' 
          ? [...mockNews, ...data.results.slice(0, 8)]
          : data.results.slice(0, 10);
        
        setNews(combinedNews);
        setError(null);
      } else {
        setError(data.error || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(`Failed to load news: ${err.message}`);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [filter]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin text-6xl mb-4">📰</div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-morphism rounded-lg p-4 animate-pulse">
              <div className="flex flex-col gap-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-400 mb-2">{error}</p>
        <button
          onClick={fetchNews}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Crypto News</h2>
        <p className="text-xl text-gray-300">Stay updated with the latest happenings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="glass-morphism rounded-xl p-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid gap-6">
        {news.map((article, index) => (
          <article
            key={index}
            className="glass-morphism rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-3 text-lg line-clamp-2 hover:text-purple-300 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-400 mb-4 line-clamp-3">
                {article.content}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="font-medium text-purple-400">
                    {extractSource(article.url)}
                  </span>
                  <span>•</span>
                  <span>{formatPublishedDate(article.published_date)}</span>
                </div>
                <span className="text-purple-400 hover:text-purple-300 transition-colors">
                  Read more →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={fetchNews}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          🔄 Refresh News
        </button>
      </div>
    </div>
  );
}

window.CryptoNews = CryptoNews;