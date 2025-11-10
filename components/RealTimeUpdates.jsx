import React, { useState, useEffect } from 'react';

function RealTimeUpdates() {
  const [notifications, setNotifications] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time connections
    const connectWebSocket = () => {
      setIsConnected(true);
      console.log('Connected to real-time feed');
      
      // Simulate real-time notifications
      const interval = setInterval(() => {
        const mockNotifications = [
          {
            id: Date.now(),
            type: 'price_alert',
            title: 'Price Alert Triggered',
            message: 'MDOG has reached your target price of $0.003',
            timestamp: new Date(),
            priority: 'high',
          },
          {
            id: Date.now() + 1,
            type: 'trade',
            title: 'Order Filled',
            message: 'Your buy order for 1000 RCAT has been executed',
            timestamp: new Date(),
            priority: 'medium',
          },
          {
            id: Date.now() + 2,
            type: 'social',
            title: 'New Mention',
            message: 'Your token GFROG was mentioned in a viral tweet',
            timestamp: new Date(),
            priority: 'low',
          },
        ];

        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep last 20
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_alert': return '📈';
      case 'trade': return '💱';
      case 'social': return '📱';
      case 'achievement': return '🏆';
      default: return 'ℹ️';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Connection Status */}
      <div className={`glass-morphism p-3 rounded-lg flex items-center ${
        isConnected ? 'border-green-500/50' : 'border-red-500/50'
      }`}>
        <div className={`w-2 h-2 rounded-full mr-3 ${
          isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
        }`}></div>
        <span className="text-white text-sm">
          {isConnected ? 'Live Updates Active' : 'Connecting...'}
        </span>
      </div>

      {/* Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`glass-morphism p-4 rounded-lg shadow-lg animate-slide-in-right ${getPriorityColor(notification.priority)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-2xl mr-3">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{notification.title}</h4>
                <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-white ml-2"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

window.RealTimeUpdates = RealTimeUpdates;