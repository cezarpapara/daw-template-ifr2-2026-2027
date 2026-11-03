import React, { useState, useEffect } from 'react';

export default function App() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    nume: '',
    email: '',
    telefon: '',
    tipAbonament: 'Standard',
    status: 'Activ'
  });

  const fetchMembers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/members');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error('Eroare la preluarea membrilor:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ nume: '', email: '', telefon: '', tipAbonament: 'Standard', status: 'Activ' });
      fetchMembers();
    } catch (err) {
      console.error('Eroare la adaugarea membrului:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sigur doriți să ștergeți membrul?')) {
      try {
        await fetch(`http://localhost:8080/api/members/${id}`, { method: 'DELETE' });
        fetchMembers();
      } catch (err) {
        console.error('Eroare la stergere:', err);
      }
    }
  };

  const handleExport = () => {
    window.open('http://localhost:8080/api/members/export/csv', '_blank');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Gestiunea și Exportul Membrilor</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          placeholder="Nume complet" 
          value={form.nume} 
          onChange={e => setForm({...form, nume: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          placeholder="Email" 
          type="email" 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          placeholder="Telefon" 
          value={form.telefon} 
          onChange={e => setForm({...form, telefon: e.target.value})} 
          style={{ padding: '8px' }}
        />
        <select 
          value={form.tipAbonament} 
          onChange={e => setForm({...form, tipAbonament: e.target.value})}
          style={{ padding: '8px' }}
        >
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Adaugă Membru
        </button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleExport} 
          style={{ backgroundColor: '#28a745', color: '#fff', padding: '10px 15px', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
        >
          📥 Descarcă Export CSV
        </button>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Nume</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Abonament</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>Nu există membri înregistrați.</td>
            </tr>
          ) : (
            members.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nume}</td>
                <td>{m.email}</td>
                <td>{m.telefon}</td>
                <td>{m.tipAbonament}</td>
                <td>{m.status}</td>
                <td>
                  <button onClick={() => handleDelete(m.id)} style={{ color: 'white', backgroundColor: '#dc3545', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                    Șterge
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}