import React from 'react';
import { User, Settings, Package, CreditCard, MapPin, Bell } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const stats = [
    { label: 'Orders', value: '23', icon: Package },
    { label: 'Wishlist', value: '14', icon: Package },
    { label: 'Reviews', value: '8', icon: Package },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Alex Johnson</h2>
            <p className="text-white/60">Premium Member since 2023</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Account Settings</h3>
        
        <div className="space-y-4">
          {[
            { icon: User, label: 'Personal Information', desc: 'Update your profile details' },
            { icon: CreditCard, label: 'Payment Methods', desc: 'Manage your payment options' },
            { icon: MapPin, label: 'Addresses', desc: 'Your delivery addresses' },
            { icon: Bell, label: 'Notifications', desc: 'Manage your notifications' },
            { icon: Settings, label: 'Privacy Settings', desc: 'Control your privacy' },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-white/80" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-white">{item.label}</h4>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;