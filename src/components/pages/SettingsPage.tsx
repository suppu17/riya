import React from "react";
import {
  Settings,
  Moon,
  Volume2,
  Mic,
  Bell,
  Shield,
  Palette,
  Bot,
} from "lucide-react";
import AgentSettings from "../AgentSettings";

const SettingsPage: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-white/80" />
                  <span className="text-white">Dark Mode</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-white/80" />
                  <span className="text-white">Theme Color</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Configuration */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Agent Configuration</h3>
            <AgentSettings />
          </div>

          {/* Audio & Voice */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Audio & Voice</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-white/80" />
                  <span className="text-white">Sound Effects</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-white/80" />
                  <span className="text-white">Voice Assistant</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-white/80" />
                  <span className="text-white">Push Notifications</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white/80" />
                  <span className="text-white">Security Alerts</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
