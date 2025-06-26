import React, { useState } from 'react';

const AgentSettings: React.FC = () => {
  const [agentId, setAgentId] = useState('agent_01jyncdvaxfqn8kdqk5rfn1jdt'); // Replace with your agent ID or load dynamically
  const [prompt, setPrompt] = useState('');
  const [tools, setTools] = useState('[]');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setMessage('Error: VITE_ELEVENLABS_API_KEY is not set in .env file.');
      return;
    }
    if (!agentId) {
      setMessage('Error: Agent ID is required.');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      const parsedTools = JSON.parse(tools);
      const response = await fetch(`https://api.elevenlabs.io/v1/agents/${agentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            prompt: prompt,
            tools: parsedTools,
            voice_id: '21m00Tcm4TlvDq8ikWAM', // Or make this configurable
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || 'Failed to update agent.');
      }

      setMessage('Agent updated successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold mb-4">Fine-Tune Riya</h3>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="agentId" className="block text-sm font-medium text-white/80 mb-1">Agent ID</label>
          <input
            id="agentId"
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-full bg-white/10 rounded-md p-2 border border-white/20 focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="Enter Agent ID"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-white/80 mb-1">System Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="w-full bg-white/10 rounded-md p-2 border border-white/20 focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="Enter the agent`s system prompt here..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tools" className="block text-sm font-medium text-white/80 mb-1">Tools (JSON format)</label>
          <textarea
            id="tools"
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            rows={6}
            className="w-full bg-white/10 rounded-md p-2 border border-white/20 focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder='[{"type": "function", ...}]'
          />
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isUpdating ? 'Updating...' : 'Update Agent'}
        </button>
        {message && <p className="text-sm mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default AgentSettings;
