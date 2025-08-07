import React, { useState, useEffect } from 'react';

const LiveLogStreamer = () => {
  const [socket, setSocket] = useState(null);
  const [logLine, setLogLine] = useState('');
  const [liveLogs, setLiveLogs] = useState([]);
  const [summary, setSummary] = useState('');
  const [rootCause, setRootCause] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/logs');
    setSocket(ws);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLiveLogs((prev) => [...prev, data.raw_log]);
        setSummary(data.summary);
        setRootCause(data.root_cause);
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    ws.onerror = (e) => console.error("WebSocket error:", e);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

  const sendLog = () => {
    if (logLine.trim() !== '' && socket?.readyState === 1) {
      socket.send(logLine.trim());
      setLogLine('');
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-xl max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">🔴 Live Log Stream</h2>
      <textarea
        rows="3"
        value={logLine}
        onChange={(e) => setLogLine(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        placeholder="Type or paste a log line..."
      />
      <button
        onClick={sendLog}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Send Log
      </button>

      <div className="mt-6">
        <h3 className="font-bold text-green-400">🧠 Root Cause:</h3>
        <p className="mb-4">{rootCause}</p>

        <h3 className="font-bold text-yellow-300">📝 Summary:</h3>
        <p className="mb-4">{summary}</p>

        <h3 className="font-bold text-gray-300">📜 Recent Logs:</h3>
        <div className="bg-gray-800 p-2 rounded h-40 overflow-y-auto">
          {liveLogs.slice(-10).map((log, idx) => (
            <div key={idx} className="text-sm text-gray-400 mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveLogStreamer;
