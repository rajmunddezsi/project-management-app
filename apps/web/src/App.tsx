import { useState } from 'react';

type HealthResponse = {
  status: string;
  service: string;
  version: string;
  timestamp: string;
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');

      if (!response.ok) {
        throw new Error(`Failed to fetch! Status: ${response.status}`);
      }

      const data = (await response.json()) as HealthResponse;
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Project Management App</h1>
      <p>Frontend is running successfully.</p>

      <button onClick={handleCheckApi} disabled={loading}>
        Check API
      </button>

      {health && (
        <div>
          <div>Service: {health.service}</div>
          <div>Status: {health.status}</div>
          <div>Version: {health.version}</div>
          <div>Timestamp: {health.timestamp}</div>
        </div>
      )}

      {error && <div>{error}</div>}
    </main>
  );
}

export default App;
