import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

function GameCenter() {
  const { address, isConnected } = useAccount();
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 250,
    nextLevelXP: 1000,
    achievements: [],
    streak: 5,
    tokens: 1250,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    if (isConnected) {
      loadGameData();
    }
  }, [isConnected]);

  const loadGameData = () => {
    // Mock achievements
    const mockAchievements = [
      {
        id: 1,
        name: 'First Launch',
        description: 'Create your first token',
        icon: '🚀',
        unlocked: true,
        rarity: 'Common',
        reward: 100,
      },
      {
        id: 2,
        name: 'Diamond Hands',
        description: 'Hold a token for 30 days',
        icon: '💎',
        unlocked: true,
        rarity: 'Rare',
        reward: 500,
      },
      {
        id: 3,
        name: 'Moonshot',
        description: 'Token gains 1000% in 24h',
        icon: '🌙',
        unlocked: false,
        rarity: 'Legendary',
        reward: 2000,
      },
      {
        id: 4,
        name: 'Whale Trader',
        description: 'Trade over $100k volume',
        icon: '🐋',
        unlocked: false,
        rarity: 'Epic',
        reward: 1000,
      },
      {
        id: 5,
        name: 'Community Builder',
        description: 'Get 1000 followers',
        icon: '👥',
        unlocked: false,
        rarity: 'Rare',
        reward: 750,
      },
    ];

    // Mock leaderboard
    const mockLeaderboard = [
      { rank: 1, address: '0x123...456', level: 45, tokens: 125000, username: 'CryptoKing' },
      { rank: 2, address: '0x234...567', level: 38, tokens: 98000, username: 'MoonHunter' },
      { rank: 3, address: '0x345...678', level: 35, tokens: 87000, username: 'DiamondWhale' },
      { rank: 4, address: '0x456...789', level: 32, tokens: 76000, username: 'RocketTrader' },
      { rank: 5, address: '0x567...890', level: 29, tokens: 65000, username: 'GemFinder' },
    ];

    // Mock daily challenges
    const mockChallenges = [
      {
        id: 1,
        title: 'Volume Warrior',
        description: 'Trade $1000 volume today',
        progress: 650,
        target: 1000,
        reward: 150,
        icon: '⚔️',
      },
      {
        id: 2,
        title: 'Social Butterfly',
        description: 'Make 5 social posts',
        progress: 2,
        target: 5,
        reward: 75,
        icon: '🦋',
      },
      {
        id: 3,
        title: 'Discovery Quest',
        description: 'Explore 10 new tokens',
        progress: 7,
        target: 10,
        reward: 100,
        icon: '🔍',
      },
    ];

    setAchievements(mockAchievements);
    setLeaderboard(mockLeaderboard);
    setChallenges(mockChallenges);
  };

  const claimAchievement = (achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.unlocked) {
      setUserStats(prev => ({
        ...prev,
        tokens: prev.tokens + achievement.reward,
        experience: prev.experience + achievement.reward,
      }));
      
      setAchievements(prev => 
        prev.map(a => a.id === achievementId ? { ...a, claimed: true } : a)
      );
    }
  };

  const progressPercentage = (userStats.experience / userStats.nextLevelXP) * 100;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-6 animate-bounce">🎮</div>
        <h3 className="text-2xl font-bold mb-4 gradient-text">Game Center</h3>
        <p className="text-gray-400">Connect your wallet to access achievements, leaderboards, and rewards</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Game Center</h2>
        <p className="text-xl text-gray-300">Earn rewards, unlock achievements, and compete with traders</p>
      </div>

      {/* Player Stats */}
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl mr-4">
              🏆
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Level {userStats.level}</h3>
              <p className="text-purple-300">{address?.slice(0, 8)}...{address?.slice(-4)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-400">{userStats.tokens.toLocaleString()} 🪙</p>
            <p className="text-sm text-gray-400">Game Tokens</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <h4 className="text-sm text-gray-400 mb-2">Experience</h4>
            <div className="mb-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-white font-semibold">
              {userStats.experience} / {userStats.nextLevelXP} XP
            </p>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <h4 className="text-sm text-gray-400 mb-2">Achievements</h4>
            <p className="text-3xl font-bold text-white">
              {achievements.filter(a => a.unlocked).length}
            </p>
            <p className="text-sm text-gray-400">Unlocked</p>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <h4 className="text-sm text-gray-400 mb-2">Daily Streak</h4>
            <p className="text-3xl font-bold text-orange-400">{userStats.streak}</p>
            <p className="text-sm text-gray-400">Days</p>
          </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">📋 Daily Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-gray-800/30 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{challenge.icon}</span>
                <h4 className="font-semibold text-white">{challenge.title}</h4>
              </div>
              <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{challenge.progress}/{challenge.target}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-yellow-400 font-semibold">+{challenge.reward} 🪙</span>
                {challenge.progress >= challenge.target && (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                    Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-white mb-6">🏆 Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  achievement.unlocked 
                    ? 'bg-gray-800/50 border border-purple-500/30' 
                    : 'bg-gray-800/20 opacity-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{achievement.icon}</span>
                  <div>
                    <h4 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                    <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                      achievement.rarity === 'Legendary' ? 'bg-yellow-600/30 text-yellow-300' :
                      achievement.rarity === 'Epic' ? 'bg-purple-600/30 text-purple-300' :
                      achievement.rarity === 'Rare' ? 'bg-blue-600/30 text-blue-300' :
                      'bg-gray-600/30 text-gray-300'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
                
                {achievement.unlocked && !achievement.claimed && (
                  <button
                    onClick={() => claimAchievement(achievement.id)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Claim +{achievement.reward} 🪙
                  </button>
                )}
                
                {achievement.claimed && (
                  <span className="text-green-400 text-sm">✓ Claimed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-white mb-6">📈 Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div 
                key={player.rank} 
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  player.address === address 
                    ? 'bg-purple-600/20 border border-purple-500/50' 
                    : 'bg-gray-800/30'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-500 text-black' :
                    'bg-gray-600 text-white'
                  }`}>
                    {player.rank}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{player.username}</h4>
                    <p className="text-gray-400 text-sm font-mono">
                      {player.address.slice(0, 8)}...{player.address.slice(-4)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-semibold">Level {player.level}</p>
                  <p className="text-yellow-400 text-sm">{player.tokens.toLocaleString()} 🪙</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Mini Games */}
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">🎮 Mini Games</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-6 text-center hover:bg-gray-700/30 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-semibold text-white mb-2">Price Predictor</h4>
            <p className="text-gray-400 text-sm mb-4">Predict token prices and earn rewards</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Play Now
            </button>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 text-center hover:bg-gray-700/30 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🎰</div>
            <h4 className="text-lg font-semibold text-white mb-2">Token Slots</h4>
            <p className="text-gray-400 text-sm mb-4">Spin the reels with your favorite tokens</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Spin Now
            </button>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 text-center hover:bg-gray-700/30 transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🏁</div>
            <h4 className="text-lg font-semibold text-white mb-2">Racing Game</h4>
            <p className="text-gray-400 text-sm mb-4">Race your tokens to the moon</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Start Race
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.GameCenter = GameCenter;