import { useState } from 'react';
import { syncQuery, broadcastChannel } from './db';

export default function PatientForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const result = await syncQuery(
        'INSERT INTO patients (name, age, gender) VALUES ($1, $2, $3) RETURNING *',
        [formData.name, formData.age, formData.gender]
      );
      
      broadcastChannel.postMessage({
        type: 'NEW_PATIENT',
        patient: result.rows[0]
      });
      console.log('Registration Successful');
      alert('Registration Successful.');

      setFormData({ name: '', age: '', gender: '' });
      onSuccess?.();
    } 
    catch (err) {
      console.error('Failed to register patient:', err);
      alert('Registration failed. Please try again.');
    } 
    finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          style={{ padding: '8px', width: '100%' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
          required
          min="1"
          style={{ padding: '8px', width: '100%' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({...formData, gender: e.target.value})}
          required
          style={{ padding: '8px', width: '100%' }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        disabled={submitting}
        style={{
          padding: '8px 16px',
          background: submitting ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {submitting ? 'Registering...' : 'Register Patient'}
      </button>
    </form>
  );
}