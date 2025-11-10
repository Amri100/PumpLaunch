import React, { useEffect, useState, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    if (entry.entryType === 'navigation') {
      console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
    }
  });
});
performanceObserver.observe({ entryTypes: ['navigation', 'measure'] });

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home.jsx'));
const TokenDetailsPage = lazy(() => import('./pages/TokenDetailsPage.jsx'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <div className="relative">
        <div className="animate-spin text-8xl mb-8 relative">🚀</div>
        <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
      <h1 className="text-4xl font-bold gradient-text mb-4 animate-pulse">PumpLaunch</h1>
      <p className="text-xl text-gray-400 animate-fade-in">Preparing for launch...</p>
      <div className="w-64 h-2 bg-gray-800 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full animate-progress-bar"></div>
      </div>
      <div className="mt-4 text-sm text-gray-500">Enhanced Performance • AI-Powered • Real-time</div>
    </div>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [basename, setBasename] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    setBasename(basePath);

    const checkDependencies = () => {
      const requiredComponents = [
        'Web3Provider', 'TokenCreator', 'TokenExplorer', 'TradingInterface',
        'Portfolio', 'SocialFeed', 'CryptoNews', 'Airdrop', 'TokenDetailsPage', 'Home'
      ];
      
      let loaded = 0;
      requiredComponents.forEach(component => {
        if (window[component]) loaded++;
      });
      
      const progress = (loaded / requiredComponents.length) * 100;
      setLoadingProgress(progress);
      
      if (progress === 100) {
        setTimeout(() => setIsReady(true), 500); // Small delay for smooth transition
      }
    };

    const interval = setInterval(checkDependencies, 100);
    checkDependencies();

    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return <LoadingFallback />;
  }

  return (
    <window.ErrorBoundary>
      <window.Web3Provider>
        <BrowserRouter basename={basename}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:tokenId" element={<TokenDetailsPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </window.Web3Provider>
    </window.ErrorBoundary>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);