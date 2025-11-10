import React, { useState } from 'react';
import { useAccount } from 'wagmi';

function TokenCreator() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    image: '',
    website: '',
    twitter: '',
    telegram: '',
    initialSupply: 1000000000,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file.name });
    }
  };

  const handleSubmit = async () => {
    if (!isConnected || !formData.name || !formData.symbol) return;
    
    setIsCreating(true);
    try {
      // Simulate token creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        description: '',
        image: '',
        website: '',
        twitter: '',
        telegram: '',
        initialSupply: 1000000000,
      });
      setPreviewImage(null);
      
      alert('Token created successfully! 🚀');
    } catch (error) {
      console.error('Token creation failed:', error);
      alert('Token creation failed. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="animate-rocket mb-6">
          🚀
        </div>
        <h3 className="text-2xl font-bold mb-4 gradient-text">Ready to Launch?</h3>
        <p className="text-gray-400 mb-6">Connect your wallet to start creating the next viral memecoin</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Create Your Token</h2>
        <p className="text-xl text-gray-300">Launch the next big memecoin in minutes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="glass-morphism rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-semibold text-purple-300 mb-6">Token Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Token Name *</label>
              <input
                type="text"
                placeholder="e.g., Moon Dog"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Symbol *</label>
              <input
                type="text"
                placeholder="e.g., MDOG"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                placeholder="Tell the world about your token..."
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Token Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Initial Supply</label>
              <input
                type="number"
                placeholder="1000000000"
                value={formData.initialSupply}
                onChange={(e) => setFormData({ ...formData, initialSupply: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-purple-300 mb-4">Social Links (Optional)</h4>
            <div className="space-y-4">
              <input
                type="url"
                placeholder="Website URL"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <input
                type="url"
                placeholder="Twitter URL"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <input
                type="url"
                placeholder="Telegram URL"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="glass-morphism rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-purple-300 mb-6">Preview</h3>
          
          <div className="token-card glass-morphism rounded-xl p-6 mb-6 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 animate-token-spin">
                {previewImage ? (
                  <img src={previewImage} alt="Token" className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <span className="text-2xl">🪙</span>
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">{formData.name || 'Token Name'}</h4>
                <p className="text-purple-300">${formData.symbol || 'SYMBOL'}</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              {formData.description || 'Token description will appear here...'}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Supply:</span>
                <span className="text-white ml-2">{formData.initialSupply.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Market Cap:</span>
                <span className="text-green-400 ml-2">$0</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold text-purple-300">Creation Details</h4>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Creation Fee:</span>
                <span className="text-white">~$2 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="text-purple-300">Base</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time to Launch:</span>
                <span className="text-green-400">~30 seconds</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isCreating || !formData.name || !formData.symbol}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
          >
            {isCreating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Token...
              </div>
            ) : (
              'Launch Token 🚀'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

window.TokenCreator = TokenCreator;