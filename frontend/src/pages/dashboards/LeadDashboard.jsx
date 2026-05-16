import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function LeadDashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [projRes, taskRes, leaveRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
        api.get('/leave')
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
      setLeaves(leaveRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLeaveAction = async (id, status) => {
    try {
      await api.put(`/leave/${id}`, { status });
      fetchAll();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
  const doneTasks = tasks.filter(t => t.status === 'DONE');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <div className="text-muted">Loading Overview...</div>
    </div>
  );

  return (
    <div className="page-body fade-in">
      <div className="page-header">
        <h1>Project Lead Overview</h1>
        <p>Command Center — {today}</p>
      </div>

      <div className="grid-3 mb-4">
        <div className="stat-card" style={{ '--accent-top': 'var(--primary)' }}>
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{projects.length}</div>
          <div className="stat-sub">Projects created</div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
        </div>
        <div className="stat-card" style={{ '--accent-top': 'var(--accent)' }}>
          <div className="stat-label">Total Team Tasks</div>
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-sub">{inProgressTasks.length} in progress · {doneTasks.length} done</div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div className="stat-card" style={{ '--accent-top': 'var(--warning)' }}>
          <div className="stat-label">Pending Leave</div>
          <div className="stat-value">{pendingLeaves.length}</div>
          <div className="stat-sub">Requests awaiting approval</div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="mb-4" style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state"><p>No projects yet. Create one from the Projects page.</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Project Name</th><th>Owner</th><th>Tasks</th></tr></thead>
              <tbody>
                {projects.slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td className="font-bold" style={{ color: 'var(--text-primary)' }}>{p.name}</td>
                    <td>{p.owner?.name}</td>
                    <td><span style={{ color: 'var(--primary)', fontWeight: 700 }}>{p._count?.tasks || 0}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2 className="mb-4" style={{ fontSize: '1rem', fontWeight: 700 }}>Leave Requests</h2>
          {leaves.length === 0 ? (
            <div className="empty-state"><p>No leave requests yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Dates</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {leaves.slice(0, 5).map(l => (
                  <tr key={l.id}>
                    <td className="font-bold" style={{ color: 'var(--text-primary)' }}>{l.user?.name || 'Unknown'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{l.fromDate} → {l.toDate}</td>
                    <td><span className={`badge badge-${l.status?.toLowerCase()}`}>{l.status}</span></td>
                    <td>
                      {l.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleLeaveAction(l.id, 'APPROVED')}>✓</button>
                          <button className="btn btn-sm btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleLeaveAction(l.id, 'REJECTED')}>✕</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="mb-4" style={{ fontSize: '1rem', fontWeight: 700 }}>All Team Tasks</h2>
        {tasks.length === 0 ? (
          <div className="empty-state"><p>No tasks created yet. Go to "My Tasks" to create tasks.</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Priority</th><th>Status</th></tr></thead>
            <tbody>
              {tasks.slice(0, 10).map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.title}</td>
                  <td>{t.project?.name}</td>
                  <td>{t.assignee?.name || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
                  <td><span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span></td>
                  <td><span className={`badge badge-${t.status.toLowerCase().replace('_', '-')}`}>{t.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
