import React, { useState, useRef, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';

function Home() {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState('explore');
  const dialogRef = useRef(null);

  const tabs = [
    { id: 'explore', label: 'Explore', icon: '🔍', component: window.TokenExplorer },
    { id: 'create', label: 'Create Token', icon: '🚀', component: window.TokenCreator },
    { id: 'portfolio', label: 'Portfolio', icon: '📊', component: window.EnhancedPortfolio },
    { id: 'trading', label: 'Advanced Trading', icon: '📈', component: window.AdvancedTradingInterface },
    { id: 'social', label: 'Social', icon: '👥', component: window.SocialFeed },
    { id: 'games', label: 'Game Center', icon: '🎮', component: window.GameCenter },
    { id: 'news', label: 'News', icon: '📰', component: window.CryptoNews },
    { id: 'airdrop', label: 'Airdrop', icon: '🪂', component: window.Airdrop },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  useEffect(() => {
    // Enhanced floating particles animation
    const particles = [];
    for (let i = 0; i < 75; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 1;
      particle.className = 'fixed rounded-full pointer-events-none animate-float';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = `rgba(139, 92, 246, ${Math.random() * 0.6 + 0.1})`;
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (8 + Math.random() * 8) + 's';
      particle.style.filter = 'blur(1px)';
      document.body.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <>
      {/* Real-time Updates Component */}
      {window.RealTimeUpdates && <window.RealTimeUpdates />}
      
      <div className="min-h-screen relative">
        {/* Enhanced Hero Section */}
        <div className="relative z-10 text-center py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <div className="w-40 h-40 mx-auto mb-8 animate-rocket drop-shadow-2xl text-8xl">🚀</div>
              <h1 className="text-7xl lg:text-9xl font-bold mb-8">
                <span className="gradient-text">PumpLaunch</span>
              </h1>
              <p className="text-2xl lg:text-3xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
                The ultimate next-generation memecoin platform with AI-powered analytics, advanced trading, and gamification
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg text-purple-300">
                <span className="flex items-center"><span className="mr-2">🤖</span>AI-Powered</span>
                <span className="flex items-center"><span className="mr-2">⚡</span>Real-time</span>
                <span className="flex items-center"><span className="mr-2">🎮</span>Gamified</span>
                <span className="flex items-center"><span className="mr-2">🔒</span>Secure</span>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="glass-morphism rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <h3 className="text-4xl font-bold text-white mb-2">15.2M+</h3>
                <p className="text-gray-400">Tokens Created</p>
                <div className="mt-2 text-green-400 text-sm">↗ +12% today</div>
              </div>
              <div className="glass-morphism rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <h3 className="text-4xl font-bold text-white mb-2">$2.8B</h3>
                <p className="text-gray-400">Volume Traded</p>
                <div className="mt-2 text-green-400 text-sm">↗ +28% this week</div>
              </div>
              <div className="glass-morphism rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <h3 className="text-4xl font-bold text-white mb-2">890K+</h3>
                <p className="text-gray-400">Active Users</p>
                <div className="mt-2 text-blue-400 text-sm">🎮 45K playing games</div>
              </div>
              <div className="glass-morphism rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <h3 className="text-4xl font-bold text-white mb-2">99.9%</h3>
                <p className="text-gray-400">Uptime</p>
                <div className="mt-2 text-green-400 text-sm">🔒 Enterprise-grade</div>
              </div>
            </div>

            {/* Enhanced Wallet Connection */}
            <div className="glass-morphism rounded-2xl p-8 mb-16 backdrop-blur-strong">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-left flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {isConnected ? '🎉 Welcome to the Future!' : '🚀 Ready for Takeoff?'}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {isConnected 
                      ? `Welcome back, ${address?.slice(0, 8)}...${address?.slice(-4)}! Your enhanced trading experience awaits.`
                      : 'Connect your wallet to unlock AI-powered trading, advanced analytics, achievements, and exclusive features.'
                    }
                  </p>
                  {isConnected && (
                    <div className="flex gap-4 mt-4">
                      <div className="bg-gray-800/30 rounded-lg px-4 py-2">
                        <span className="text-green-400">●</span>
                        <span className="text-white ml-2 text-sm">Connected</span>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg px-4 py-2">
                        <span className="text-yellow-400">🏆</span>
                        <span className="text-white ml-2 text-sm">Level 5 Trader</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-4">
                  {isConnected ? (
                    <>
                      <button
                        onClick={() => setActiveTab('portfolio')}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 animate-pulse-glow"
                      >
                        📊 View Portfolio
                      </button>
                      <button
                        onClick={() => disconnect()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
                      >
                        Disconnect Wallet
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => dialogRef.current?.showModal()}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 animate-pulse-glow text-lg"
                    >
                      Connect Wallet 🚀
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass-morphism rounded-xl p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Analytics</h3>
                <p className="text-gray-300">Get intelligent insights, price predictions, and risk analysis powered by advanced AI algorithms.</p>
              </div>
              
              <div className="glass-morphism rounded-xl p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Trading</h3>
                <p className="text-gray-300">Professional-grade trading tools with limit orders, stop-loss, and real-time charts.</p>
              </div>
              
              <div className="glass-morphism rounded-xl p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-5xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-white mb-4">Gamification</h3>
                <p className="text-gray-300">Earn achievements, climb leaderboards, and unlock exclusive rewards while trading.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="sticky top-0 z-20 bg-black/30 backdrop-blur-xl border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all whitespace-nowrap min-w-0 ${
                    activeTab === tab.id
                      ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="animate-fade-in">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Enhanced Wallet Connection Modal */}
        <dialog
          ref={dialogRef}
          className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-transparent border-none p-4"
        >
          <div className="glass-morphism p-8 rounded-2xl shadow-2xl animate-bounce-in max-w-md backdrop-blur-strong">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold gradient-text">Connect Wallet</h2>
              <button
                onClick={() => dialogRef.current?.close()}
                className="text-gray-400 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-300 mb-6 text-center">
              Choose your preferred wallet to access all PumpLaunch features
            </p>
            
            <div className="space-y-4">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    dialogRef.current?.close();
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-gray-800/40 hover:bg-gray-700/60 rounded-xl transition-all duration-300 hover:scale-105 neon-border group"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white">🦊</span>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors">
                      {connector.name === 'Injected' ? 'MetaMask' : connector.name}
                    </span>
                    <p className="text-sm text-gray-400">
                      {connector.name === 'Injected' ? 'Connect using MetaMask' : `Connect using ${connector.name}`}
                    </p>
                  </div>
                  <span className="text-purple-400 group-hover:text-purple-300 transition-colors">→</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                By connecting, you agree to our{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </a>
              </p>
              <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-400">
                <span>🔒</span>
                <span>Your wallet is secured by industry-standard encryption</span>
              </div>
            </div>
          </div>
        </dialog>

        {/* Enhanced Footer */}
        <footer className="relative z-10 border-t border-purple-500/20 mt-20 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 mr-4 text-4xl">🚀</div>
                  <h3 className="text-3xl font-bold gradient-text">PumpLaunch</h3>
                </div>
                <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                  The most advanced memecoin platform in the universe. Create, trade, and discover tokens with our cutting-edge AI-powered tools, advanced trading features, and gamified experience.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110">
                    <span className="text-2xl">🐦</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110">
                    <span className="text-2xl">💬</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110">
                    <span className="text-2xl">✈️</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-110">
                    <span className="text-2xl">📱</span>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-white mb-6">Platform</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Create Token</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Explore Tokens</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Advanced Trading</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">AI Analytics</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Game Center</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-white mb-6">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">API Reference</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Community</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 transform duration-300">Contact Us</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2025 PumpLaunch. All rights reserved. Built with ❤️ for the memecoin community.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>🚀 Powered by AI</span>
                <span>•</span>
                <span>⚡ Ultra-fast</span>
                <span>•</span>
                <span>🔒 Secure</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

window.Home = Home;