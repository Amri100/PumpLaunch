import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

function SocialFeed() {
  const { address, isConnected } = useAccount();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [filter, setFilter] = useState('trending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    
    // Mock social posts
    const mockPosts = [
      {
        id: 1,
        user: '0x123...456',
        avatar: 'https://picsum.photos/50/50?random=1',
        content: 'Just discovered MDOG! This could be the next 100x! 🚀🌙',
        timestamp: '2m ago',
        likes: 23,
        comments: 5,
        token: 'MDOG',
        liked: false,
      },
      {
        id: 2,
        user: 'CryptoWhale',
        avatar: 'https://picsum.photos/50/50?random=2',
        content: 'Portfolio update: Up 450% this month thanks to these gems! Diamond hands paying off 💎🙌',
        timestamp: '15m ago',
        likes: 89,
        comments: 12,
        token: 'DHAND',
        liked: true,
      },
      {
        id: 3,
        user: 'MemeKing',
        avatar: 'https://picsum.photos/50/50?random=3',
        content: 'New token launch tomorrow! Get ready for the most epic meme coin ever created 🔥',
        timestamp: '1h ago',
        likes: 156,
        comments: 34,
        token: null,
        liked: false,
      },
      {
        id: 4,
        user: '0x789...abc',
        avatar: 'https://picsum.photos/50/50?random=4',
        content: 'GFROG just hit new ATH! Told you guys this frog was going to hop to the moon 🐸🌕',
        timestamp: '2h ago',
        likes: 67,
        comments: 18,
        token: 'GFROG',
        liked: false,
      },
    ];

    await new Promise(resolve => setTimeout(resolve, 1000));
    setPosts(mockPosts);
    setLoading(false);
  };

  const handlePost = async () => {
    if (!newPost.trim() || !isConnected) return;
    
    const post = {
      id: posts.length + 1,
      user: address?.slice(0, 6) + '...' + address?.slice(-4),
      avatar: 'https://picsum.photos/50/50?random=99',
      content: newPost,
      timestamp: 'now',
      likes: 0,
      comments: 0,
      token: null,
      liked: false,
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const PostCard = ({ post }) => (
    <div className="glass-morphism rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-start space-x-3">
        <img 
          src={post.avatar} 
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-purple-500/30"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-white">{post.user}</h4>
            {post.token && (
              <span className="bg-purple-600/30 text-purple-300 text-xs px-2 py-1 rounded">
                ${post.token}
              </span>
            )}
            <span className="text-gray-400 text-sm">{post.timestamp}</span>
          </div>
          
          <p className="text-gray-300 mb-4">{post.content}</p>
          
          <div className="flex items-center space-x-4 text-sm">
            <button 
              onClick={() => toggleLike(post.id)}
              className={`flex items-center space-x-1 transition-colors ${
                post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <span>{post.liked ? '❤️' : '🤍'}</span>
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
              <span>💬</span>
              <span>{post.comments}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
              <span>🔄</span>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin text-6xl mb-4">💬</div>
        <p className="text-xl text-gray-300">Loading community posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Social Feed</h2>
        <p className="text-xl text-gray-300">Connect with the memecoin community</p>
      </div>

      {/* Post Creation */}
      {isConnected && (
        <div className="glass-morphism rounded-xl p-6">
          <div className="flex space-x-3">
            <img 
              src="https://picsum.photos/50/50?random=99" 
              alt="You"
              className="w-10 h-10 rounded-full border-2 border-purple-500/30"
            />
            <div className="flex-1">
              <textarea
                placeholder="What's happening in the memecoin world?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows="3"
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2 text-sm text-gray-400">
                  <button className="hover:text-purple-400 transition-colors">📷 Image</button>
                  <button className="hover:text-purple-400 transition-colors">🪙 Tag Token</button>
                  <button className="hover:text-purple-400 transition-colors">🎯 Poll</button>
                </div>
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="glass-morphism rounded-xl p-1">
          {['trending', 'recent', 'following'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === f 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {!isConnected && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Connect your wallet to join the conversation</p>
        </div>
      )}
    </div>
  );
}

window.SocialFeed = SocialFeed;