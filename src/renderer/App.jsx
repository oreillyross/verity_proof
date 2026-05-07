import { useEffect, useState } from 'react';

const api = window.api ?? {
  listEntries: async () => [],
  addEntry: async (entry) => ({ ...entry, id: Date.now(), createdAt: new Date().toISOString() })
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const isWeb = !window.api;

  useEffect(() => {
    api.listEntries().then(setEntries);
  }, []);

  const addTest = async () => {
    const created = await api.addEntry({
      projectId: 'demo',
      title: 'First log',
      description: 'It works'
    });
    setEntries(prev => [...prev, created]);
  };

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      {isWeb && (
        <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
          Running in browser preview — entries are not persisted (Electron not active).
        </p>
      )}
      <button onClick={addTest}>Add entry</button>
      <pre style={{ marginTop: 12 }}>{JSON.stringify(entries, null, 2)}</pre>
    </div>
  );
}
