import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AuthDebug: React.FC = () => {
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [testPassword, setTestPassword] = useState("password123");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const { login } = useAuth();

  const testConnection = async () => {
    try {
      setDebugInfo("Testing mock authentication system...");

      // Test mock system
      const mockUser = localStorage.getItem("demo-user");

      if (mockUser) {
        setDebugInfo("✅ Mock authentication system working - User logged in");
      } else {
        setDebugInfo(
          "✅ Mock authentication system working - No user logged in"
        );
      }
    } catch (error) {
      setDebugInfo(`❌ Connection failed: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      setDebugInfo("Testing login...");
      const result = await login(testEmail, testPassword);

      if (result.success) {
        setDebugInfo("✅ Login successful");
      } else {
        setDebugInfo(`❌ Login failed: ${result.error}`);
      }
    } catch (error) {
      setDebugInfo(`❌ Login error: ${error}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md z-[10000]">
      <h3 className="text-lg font-bold mb-2">Auth Debug Panel</h3>

      <div className="space-y-2 mb-4">
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="Test email"
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
        <input
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          placeholder="Test password"
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={testConnection}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Test Connection
        </button>
        <button
          onClick={testLogin}
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
        >
          Test Login
        </button>
      </div>

      {debugInfo && (
        <div className="bg-gray-800 p-2 rounded text-sm">
          <pre className="whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-400">
        <div>Mode: Mock Authentication</div>
        <div>Demo Credentials: demo@example.com / demo123</div>
      </div>
    </div>
  );
};

export default AuthDebug;
