import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const isLead = user?.role === 'PROJECT_LEAD';

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try { const { data } = await api.get('/projects'); setProjects(data); } catch (e) { console.error(e); }
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      setShowModal(false);
      setForm({ name: '', description: '' });
      fetchProjects();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const deleteProject = async id => {
    if (!confirm('Delete project and all its tasks?')) return;
    try { await api.delete(`/projects/${id}`); fetchProjects(); } catch (e) { alert(e.response?.data?.message); }
  };

  return (
    <div className="page-body fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Projects</h1>
          <p>{projects.length} active projects</p>
        </div>
        {isLead && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', color: 'var(--text-muted)' }}>
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            <h3>No Projects Found</h3>
            <p>{isLead ? 'Create your first project to get started' : 'You have no assigned projects yet'}</p>
          </div>
        </div>
      ) : (
        <div className="grid-auto">
          {projects.map(project => (
            <div key={project.id} className="card" style={{ cursor: 'default' }}>
              <div className="flex justify-between items-center mb-4">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'white' }}>
                  {project.name.charAt(0).toUpperCase()}
                </div>
                {isLead && (
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProject(project.id)}>Delete</button>
                )}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>{project.name}</h3>
              {project.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{project.description}</p>}
              <div className="divider" />
              <div className="flex justify-between" style={{ fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Lead: {project.owner?.name}</span>
                <span style={{ color: 'var(--accent)' }}>{project._count?.tasks || 0} tasks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Project</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input className="form-input" placeholder="e.g. Website Redesign" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="What is this project about?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-between">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
