import { useEffect, useRef, useState } from 'react';
import api from '../../lib/api';

export default function TaskerDashboard() {
  const [attendance, setAttendance] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (attendance?.punchIn && !attendance?.punchOut) {
      const start = new Date(attendance.punchIn);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [attendance]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [attRes, taskRes, projRes, userRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/users')
      ]);
      setAttendance(attRes.data);
      setTasks(taskRes.data);
      setProjects(projRes.data);
      setMembers(userRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const punchIn = async () => {
    try { const { data } = await api.post('/attendance/punch-in'); setAttendance(data); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const punchOut = async () => {
    clearInterval(timerRef.current);
    try { const { data } = await api.post('/attendance/punch-out'); setAttendance(data); setElapsed(0); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/tasks', form);
      setShowModal(false);
      setForm({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
      fetchAll();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '–';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const isPunchedIn = attendance?.punchIn && !attendance?.punchOut;
  const isPunchedOut = !!attendance?.punchOut;
  const completedTasks = tasks.filter(t => t.status === 'DONE');
  const totalMins = attendance?.totalMinutes || (isPunchedIn ? Math.floor(elapsed / 60) : 0);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
    </div>
  );

  return (
    <div className="page-body fade-in">
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p>Welcome back — {today}</p>
      </div>

      {/* Alert banner */}
      {!isPunchedIn && !isPunchedOut && (
        <div className="alert-banner alert-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          You haven't punched in yet. Punch in to start tracking your time.
        </div>
      )}
      {isPunchedOut && (
        <div className="alert-banner alert-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          You've punched out for today. Total: {attendance.totalMinutes}m. Great work!
        </div>
      )}

      {/* Punch Card Split Layout */}
      <div className="punch-split-container">
        {/* Left: Timer Box */}
        <div className="punch-timer-box">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '16px' }}>
            {isPunchedIn ? 'Session Active' : (isPunchedOut ? 'Session Completed' : 'Ready to Start')}
          </p>
          <div className={`timer-display ${isPunchedIn ? 'running' : ''}`} style={{ fontSize: '4.5rem', marginBottom: '32px' }}>
            {isPunchedOut
              ? `${String(Math.floor(attendance.totalMinutes / 60)).padStart(2,'0')}:${String(attendance.totalMinutes % 60).padStart(2,'0')}:00`
              : formatTime(isPunchedIn ? elapsed : 0)
            }
          </div>
          
          <div style={{ width: '100%', maxWidth: '300px' }}>
            {!isPunchedIn && !isPunchedOut && (
              <button className="btn btn-primary w-full" onClick={punchIn} style={{ padding: '16px', fontSize: '1.1rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Punch In Now
              </button>
            )}
            {isPunchedIn && (
              <button className="btn btn-danger w-full" onClick={punchOut} style={{ padding: '16px', fontSize: '1.1rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>
                Punch Out
              </button>
            )}
            {isPunchedOut && (
              <div style={{ textAlign: 'center' }}>
                <span className="badge badge-done" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Great job today!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="punch-timeline">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Today's Activity</h3>
          <div className="divider" style={{ margin: '8px 0 24px' }}></div>
          
          <div className="timeline-item">
            <div className="timeline-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div className="timeline-content">
              <div className="label">Punch In Time</div>
              <div className="value">{formatDate(attendance?.punchIn)}</div>
              <div className="sub">{attendance?.punchIn ? today : 'Pending'}</div>
            </div>
          </div>
          
          <div className="timeline-item" style={{ marginTop: '16px' }}>
            <div className={`timeline-icon ${isPunchedOut ? '' : 'out'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="timeline-content">
              <div className="label">Punch Out Time</div>
              <div className="value">{formatDate(attendance?.punchOut)}</div>
              <div className="sub">{attendance?.punchOut ? today : 'Pending'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card" style={{ '--accent-top': 'linear-gradient(90deg, var(--success), #34d399)' }}>
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-value">{completedTasks.length}</div>
          <div className="stat-sub">of {tasks.length} total</div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div className="stat-card" style={{ '--accent-top': 'linear-gradient(90deg, var(--accent), #818cf8)' }}>
          <div className="stat-label">Total Time Today</div>
          <div className="stat-value">{totalMins >= 60 ? `${Math.floor(totalMins/60)}h ${totalMins%60}m` : `${totalMins}m`}</div>
          <div className="stat-sub">hours logged</div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div className="stat-card" style={{ '--accent-top': 'linear-gradient(90deg, var(--primary), var(--accent))' }}>
          <div className="stat-label">Avg Task Time</div>
          <div className="stat-value">{completedTasks.length > 0 ? `${Math.round(totalMins / completedTasks.length)}m` : '0m'}</div>
          <div className="stat-sub">AHT (avg handle time)</div>
          <div className="stat-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Today's Task Log</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">{tasks.length} tasks</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              + Create Task
            </button>
          </div>
        </div>
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks assigned</h3>
            <p>Tasks assigned to you will appear here</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 8).map(task => (
                <tr key={task.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{task.title}</td>
                  <td>{task.project?.name}</td>
                  <td><span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority}</span></td>
                  <td><span className={`badge badge-${task.status.toLowerCase().replace('_','-')}`}>{task.status.replace('_',' ')}</span></td>
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

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Task</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input className="form-input" placeholder="Enter task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} placeholder="Optional description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Project</label>
                  <select className="form-input" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} required>
                    <option value="">Select project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select className="form-input" value={form.assigneeId} onChange={e => setForm({...form, assigneeId: e.target.value})}>
                  <option value="">Select team member (optional)</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role.replace('_', ' ')})</option>)}
                </select>
              </div>
              <div className="flex gap-3 justify-between mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
