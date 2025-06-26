import React from 'react';
import { Bell, Package, Heart, Star } from 'lucide-react';

const NotificationPanel: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your Neural VR Headset Pro has been shipped and will arrive tomorrow.',
      time: '12:49',
      icon: Package
    },
    {
      id: 2,
      type: 'wishlist',
      title: 'Wishlist Item Sale',
      message: 'Quantum Wireless Earbuds is now 20% off. Limited time offer!',
      time: '12:43',
      icon: Heart
    },
    {
      id: 3,
      type: 'review',
      title: 'Review Reminder',
      message: 'How was your Smart Home Hub X1? Leave a review and earn points.',
      time: '12:38',
      icon: Star
    },
    {
      id: 4,
      type: 'general',
      title: 'New AI Features',
      message: 'Experience enhanced voice shopping with our latest AI update.',
      time: '12:30',
      icon: Bell
    }
  ];

  return (
    <div className="w-80 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-white/10 backdrop-blur-xl rounded-lg text-white/80 border border-white/20">
            Recent
          </button>
          <button className="px-3 py-1 text-xs text-white/60">
            All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div key={notification.id} className="flex gap-3 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white/80" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-white truncate">{notification.title}</h3>
                  <span className="text-xs text-white/60 flex-shrink-0">{notification.time}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{notification.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPanel;