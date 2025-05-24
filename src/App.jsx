
import { useEffect, useState } from 'react';
import PatientForm from './PatientForm';
import SQLQuery from './SQLQuery';
import { initDB, broadcastChannel, getPatients, syncQuery } from './db';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
      setError(null);
    } 
    catch (err) {
      console.error('Failed to load patients:', err);
      setError('Failed to load patients. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  const clearPatients = async () => {
  try {
    await syncQuery("DELETE FROM patients");
    console.log("Deleted patients in DB");
    broadcastChannel.postMessage({ type: 'CLEAR_ALL' });
    await loadPatients();
    alert("All patient records cleared.");
  } catch (err) {
    console.error("Failed to clear patients:", err);
    alert("Failed to clear patients.");
  }
};

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        await loadPatients();
      } 
      catch (err) {
        setError('Failed to initialize database');
      }
    };

    const handleUpdate = (event) => {
      if (event.data.type === 'NEW_PATIENT') {
        setPatients(prev => [event.data.patient, ...prev]);
      }

      if (event.data.type === 'CLEAR_ALL') {
         console.log('Received CLEAR_ALL broadcast');
        setPatients([]);
      }
    };

    setup();
    broadcastChannel.addEventListener('message', handleUpdate);

    return () => {
      broadcastChannel.removeEventListener('message', handleUpdate);
    };
  }, []);

  useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      window.location.reload();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);

  const styles = {
    container: { 
      fontFamily: 'sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    },
    tabButton: {
      padding: '8px 16px',
      background: '#f0f0f0',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    activeTab: {
      background: '#007bff',
      color: 'white'
    },
    patientItem: {
      padding: '10px',
      borderBottom: '1px solid #eee'
    }
  };

  return (
    <div style={styles.container}>
      <h1>Patient Registration</h1>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
          <button 
            onClick={loadPatients}
            style={{ marginLeft: '10px' }}
          >
            Retry
          </button>
        </div>
      )}

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tabButton, ...(activeTab === 'register' && styles.activeTab) }}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
        <button
          style={{ ...styles.tabButton, ...(activeTab === 'query' && styles.activeTab) }}
          onClick={() => setActiveTab('query')}
        >
          SQL Query
        </button>
      </div>

      {activeTab === 'register' ? (
        <>
          <PatientForm onSuccess={loadPatients} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Registered Patients</h2>
            <button
              onClick={clearPatients}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >Clear All</button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : patients.length === 0 ? (
            <p>No patients registered yet</p>
          ) : (
            <ul style={{ padding: 0 }}>
              {patients.map(p => (
                <li key={p.id} style={styles.patientItem}>
                  <strong>{p.name}</strong> (Age: {p.age}, Gender: {p.gender})
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <SQLQuery />
      )}
    </div>
  );
}