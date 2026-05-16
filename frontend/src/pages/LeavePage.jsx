import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function LeavePage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fromDate: '', toDate: '', reason: '' });

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try { const { data } = await api.get('/leave/my'); setLeaves(data); } catch (e) { console.error(e); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/leave', form);
      setShowModal(false);
      setForm({ fromDate: '', toDate: '', reason: '' });
      fetchLeaves();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  return (
    <div className="page-body fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Leave Requests</h1>
          <p>Track your time-off requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Apply Leave
        </button>
      </div>

      <div className="card">
        {leaves.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', color: 'var(--text-muted)' }}>
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h3>No leave requests</h3>
            <p>Apply for leave using the button above</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id}>
                  <td style={{ color: 'var(--text-primary)' }}>{l.fromDate}</td>
                  <td>{l.toDate}</td>
                  <td style={{ maxWidth: '200px' }} className="truncate">{l.reason}</td>
                  <td><span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span></td>
                  <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Apply for Leave</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">From Date</label>
                  <input type="date" className="form-input" value={form.fromDate} onChange={e => setForm({...form, fromDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">To Date</label>
                  <input type="date" className="form-input" value={form.toDate} onChange={e => setForm({...form, toDate: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea className="form-input" rows={3} placeholder="Reason for leave..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required />
              </div>
              <div className="flex gap-3 justify-between">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
