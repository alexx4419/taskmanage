import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [form, setForm] = useState({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
  const isLead = user?.role === 'PROJECT_LEAD';

  useEffect(() => { fetchTasks(); if (isLead || user?.role === 'QUALITY_REVIEWER') { fetchProjects(); fetchMembers(); } }, []);

  const fetchTasks = async () => {
    try { const { data } = await api.get('/tasks'); setTasks(data); } catch (e) { console.error(e); }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (e) { console.error(e); }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      setMembers(data);
    } catch (e) { console.error(e); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/tasks/${id}`, { status }); fetchTasks(); } catch (e) { alert(e.response?.data?.message); }
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); fetchTasks(); } catch (e) { alert(e.response?.data?.message); }
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/tasks', form);
      setShowModal(false);
      setForm({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
      fetchTasks();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const displayed = filterStatus === 'ALL' ? tasks : tasks.filter(t => t.status === filterStatus);

  const statusColor = { TODO: '#94a3b8', IN_PROGRESS: '#67e8f9', DONE: '#6ee7b7' };

  return (
    <div className="page-body fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>My Tasks</h1>
          <p>{tasks.length} total tasks</p>
        </div>
        {(isLead || user?.role === 'QUALITY_REVIEWER') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Task
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-4">
        {['ALL', ...STATUSES].map(s => (
          <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterStatus(s)}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Kanban-style columns */}
      <div className="grid-3">
        {STATUSES.map(status => {
          const col = displayed.filter(t => t.status === status);
          return (
            <div key={status} className="card" style={{ padding: '16px' }}>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor[status] }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {status.replace('_', ' ')}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '999px' }}>
                  {col.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.map(task => (
                  <div key={task.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px', color: 'var(--text-primary)' }}>{task.title}</p>
                    {task.description && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{task.description}</p>}
                    <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                      <span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority}</span>
                      {task.project && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{task.project.name}</span>}
                      {task.assignee && <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>@{task.assignee.name}</span>}
                    </div>
                    <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                      {STATUSES.filter(s => s !== status).map(s => (
                        <button key={s} className="btn btn-ghost btn-sm" onClick={() => updateStatus(task.id, s)}>
                          → {s.replace('_', ' ')}
                        </button>
                      ))}
                      {isLead && (
                        <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                      )}
                    </div>
                  </div>
                ))}
                {col.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No tasks</p>}
              </div>
            </div>
          );
        })}
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
              <div className="flex gap-3 justify-between">
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
