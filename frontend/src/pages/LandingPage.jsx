import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: 'What is Orvix Pro?', answer: 'Orvix Pro is a premium team intelligence platform that helps you organize and manage your team like a boss. It offers a free task management tool packing more capabilities than you can imagine.' },
    { question: 'How do I get started?', answer: 'Simply click the "Get Started" button and create a free account. You can then invite your team members and start managing projects immediately.' },
    { question: 'How much does it cost?', answer: 'The core task management features are completely free. We also offer premium plans for advanced analytics and larger teams.' },
    { question: 'What devices can I use?', answer: 'Orvix Pro is a fully responsive web application that works seamlessly on desktop, tablet, and mobile devices.' },
    { question: 'Will my data be safe?', answer: 'Yes, we use industry-standard encryption and security protocols to ensure your team\'s data is always protected.' },
  ];

  return (
    <div className="landing-page fade-in">
      <nav className="landing-nav">
        <div className="logo-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-icon">OX</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Orvix Pro</h2>
        </div>
        <div>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <div style={{display:'flex', gap: '16px', alignItems: 'center'}}>
              <Link to="/auth" className="btn btn-ghost" style={{border: 'none'}}>Log In</Link>
              <Link to="/auth" className="btn btn-primary">Get Started</Link>
            </div>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(124,58,237,0.1)', borderRadius: '999px', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px', border: '1px solid rgba(124,58,237,0.2)' }}>
            ✨ Orvix Pro 2.0 is here
          </div>
          <h1>ONLINE TASK MANAGER</h1>
          <p>
            Organize and manage your team like a boss with Orvix Pro, a free task management tool packing more capabilities than you can imagine.
          </p>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Start for free
            </Link>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No credit card required</span>
          </div>
        </div>
        
        <div className="landing-hero-visual">
          <div className="hero-mockup">
            {/* Floating Elements */}
            <div className="floating-badge top-right animate-float">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Task Completed
            </div>
            <div className="floating-badge bottom-left animate-float">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Punched In: 08:30 AM
            </div>

            {/* Mockup UI */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <div className="grid-3">
              {[1, 2, 3].map((i, idx) => (
                <div key={i} style={{ background: 'var(--bg-elevated)', height: '240px', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ width: '40%', height: '12px', background: ['#94a3b8', '#67e8f9', '#6ee7b7'][idx], borderRadius: '4px', marginBottom: '8px' }}></div>
                  <div style={{ width: '100%', height: '60px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}></div>
                  <div style={{ width: '100%', height: '60px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}></div>
                  <div style={{ width: '100%', height: '60px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', opacity: 0.5 }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stat-banner">
        <div className="stat-item">
          <h3>10k+</h3>
          <p>Teams Worldwide</p>
        </div>
        <div className="stat-item">
          <h3>99.9%</h3>
          <p>Uptime SLA</p>
        </div>
        <div className="stat-item">
          <h3>5M+</h3>
          <p>Tasks Completed</p>
        </div>
      </section>

      {/* Unique Features Bento Grid */}
      <section className="landing-features">
        <h2>Everything your team needs</h2>
        <div className="bento-grid">
          
          <div className="bento-card large">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Live Time Tracking & Attendance</h3>
            <p>Built-in punch clock. Team members must punch in to start their shift. Track average handle times (AHT) and total logged hours automatically across all your projects without third-party integrations.</p>
          </div>

          <div className="bento-card" style={{ background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))' }}>
            <div className="bento-icon" style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>3-Tier Role System</h3>
            <p>Granular control with Project Lead, QA Reviewer, and Tasker roles to ensure the right people have the right access.</p>
          </div>

          <div className="bento-card" style={{ background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))' }}>
            <div className="bento-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2"/></svg>
            </div>
            <h3>Leave Management</h3>
            <p>Streamline PTO requests directly inside your task manager. Leads can approve or reject leaves with a single click.</p>
          </div>

          <div className="bento-card large">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <h3>Intelligent Visual Dashboards</h3>
            <p>Get a bird's eye view of your team's performance. Monitor task completion rates, evaluate bottlenecks, and use Kanban boards to easily drag and drop priorities across your workflow.</p>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-faq">
        <h2>Orvix Pro FAQ</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openFaq === index ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="faq-question">
                {faq.question}
                <svg className="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to transform your team?</h2>
          <p>Join thousands of teams already using Orvix Pro to hit their goals faster.</p>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem', borderRadius: '999px' }}>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Chat Widget */}
      <div className="floating-chat" title="Chat with us">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
    </div>
  );
}
