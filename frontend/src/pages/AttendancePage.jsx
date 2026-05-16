import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function AttendancePage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/attendance/history').then(r => setHistory(r.data)).catch(console.error);
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '–';
  const fmtMins = (m) => m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;

  return (
    <div className="page-body fade-in">
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Your last 30 days attendance record</p>
      </div>

      <div className="card">
        {history.length === 0 ? (
          <div className="empty-state">
            <h3>No attendance records</h3>
            <p>Start punching in to track your attendance</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Punch In</th>
                <th>Punch Out</th>
                <th>Total Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(rec => (
                <tr key={rec.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td>{fmt(rec.punchIn)}</td>
                  <td>{fmt(rec.punchOut)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{fmtMins(rec.totalMinutes)}</td>
                  <td>
                    <span className={`badge ${rec.punchOut ? 'badge-done' : rec.punchIn ? 'badge-in_progress' : 'badge-todo'}`}>
                      {rec.punchOut ? 'Complete' : rec.punchIn ? 'Active' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
