import React, { useState, useEffect } from 'react';

function AIAnalysis({ token }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState({});

  const generateAIAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const sentiment = Math.random();
      const riskLevel = Math.random();
      const prediction = (Math.random() - 0.5) * 200; // -100% to +100%
      
      setAnalysis({
        sentiment: sentiment > 0.7 ? 'Bullish' : sentiment > 0.3 ? 'Neutral' : 'Bearish',
        sentimentScore: (sentiment * 100).toFixed(1),
        riskLevel: riskLevel > 0.7 ? 'High' : riskLevel > 0.3 ? 'Medium' : 'Low',
        riskScore: (riskLevel * 100).toFixed(1),
        prediction: prediction.toFixed(1),
        confidence: (70 + Math.random() * 30).toFixed(1),
        factors: [
          'High trading volume activity',
          'Strong community engagement',
          'Positive social media sentiment',
          'Recent partnership announcements',
          'Technical indicators bullish'
        ].slice(0, Math.floor(3 + Math.random() * 3))
      });
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      generateAIAnalysis();
    }
  }, [token]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Bullish': return 'text-green-400';
      case 'Bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'High': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="animate-spin text-2xl mr-3">🤖</div>
          <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
          <p className="text-purple-300 text-sm">Processing market data and sentiment...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">🤖 AI Analysis</h3>
          <button
            onClick={generateAIAnalysis}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Analyze
          </button>
        </div>
        <p className="text-gray-400">Get AI-powered insights and predictions for this token.</p>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">🤖 AI Analysis</h3>
        <div className="text-xs text-purple-300">
          Confidence: {analysis.confidence}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h4 className="text-sm text-gray-400 mb-2">Market Sentiment</h4>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${getSentimentColor(analysis.sentiment)}`}>
              {analysis.sentiment}
            </span>
            <span className="text-gray-300">{analysis.sentimentScore}%</span>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-4">
          <h4 className="text-sm text-gray-400 mb-2">Risk Level</h4>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${getRiskColor(analysis.riskLevel)}`}>
              {analysis.riskLevel}
            </span>
            <span className="text-gray-300">{analysis.riskScore}%</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-3">7-Day Prediction</h4>
        <div className="flex items-center">
          <span className={`text-2xl font-bold mr-2 ${
            parseFloat(analysis.prediction) >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {parseFloat(analysis.prediction) >= 0 ? '+' : ''}{analysis.prediction}%
          </span>
          <span className="text-sm text-gray-400">price change expected</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-gray-400 mb-3">Key Factors</h4>
        <ul className="space-y-2">
          {analysis.factors.map((factor, index) => (
            <li key={index} className="flex items-center text-sm text-gray-300">
              <span className="text-green-400 mr-2">•</span>
              {factor}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={generateAIAnalysis}
        disabled={loading}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors text-sm"
      >
        🔄 Refresh Analysis
      </button>
    </div>
  );
}

window.AIAnalysis = AIAnalysis;