import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function ReviewerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [taskRes, projRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const reviewTasks = tasks.filter(t => t.status === 'IN_REVIEW');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <div className="text-muted">Loading QA Dashboard...</div>
    </div>
  );

  return (
    <div className="page-body fade-in">
      <div className="page-header">
        <h1>Quality Assurance</h1>
        <p>Reviewer Dashboard — {today}</p>
      </div>

      <div className="grid-3 mb-4">
        <div className="stat-card" style={{ '--accent-top': 'linear-gradient(90deg, var(--warning), #fbbf24)' }}>
          <div className="stat-label">Pending Review</div>
          <div className="stat-value">{reviewTasks.length}</div>
          <div className="stat-sub">Tasks waiting for QA</div>
        </div>
        <div className="stat-card" style={{ '--accent-top': 'linear-gradient(90deg, var(--success), #34d399)' }}>
          <div className="stat-label">Total Approved</div>
          <div className="stat-value">{doneTasks.length}</div>
          <div className="stat-sub">Completed tasks</div>
        </div>
        <div className="stat-card" style={{ '--accent-top': 'linear-gradient(90deg, var(--primary), var(--accent))' }}>
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-sub">In the system</div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Tasks Requiring Attention</h2>
          <span className="text-xs text-muted">{reviewTasks.length} pending</span>
        </div>
        
        {reviewTasks.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" className="mb-2" style={{margin: '0 auto'}}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>All caught up!</h3>
            <p>No tasks currently in review.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reviewTasks.map(task => (
                <tr key={task.id}>
                  <td className="font-bold">{task.title}</td>
                  <td>{task.project?.name}</td>
                  <td>{task.assignee?.name}</td>
                  <td><span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority}</span></td>
                  <td><span className="badge badge-in-review">In Review</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Active Projects List */}
      <div className="card mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Active Tech Projects</h2>
          <span className="text-xs text-muted">{projects.length} projects</span>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No active projects found.</p>
          </div>
        ) : (
          <div className="grid-3">
            {projects.slice(0, 6).map(p => (
              <div key={p.id} className="stat-card" style={{ '--accent-top': 'var(--primary)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(249,115,22,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lead: {p.owner?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p._count?.tasks || 0} Tasks</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
