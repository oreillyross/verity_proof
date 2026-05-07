import  { useEffect, useState } from 'react';

export default function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    window.api.listEntries().then(setEntries);
  }, []);

  const addTest = async () => {
    const created = await window.api.addEntry({
      projectId: 'demo',
      title: 'First log',
      description: 'It works'
    });
    setEntries(prev => [...prev, created]);
  };

  return (
    <div style={{ padding: 16 }}>
      <button onClick={addTest}>Add entry</button>
      <pre>{JSON.stringify(entries, null, 2)}</pre>
    </div>
  );
}