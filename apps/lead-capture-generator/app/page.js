'use client'

import { useState } from 'react'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would normally send to your email service
    console.log('Lead captured:', formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successTitle}>Check Your Email!</h1>
          <p style={styles.successText}>
            Your Digital Income Starter Kit is on its way to <strong>{formData.email}</strong>
          </p>
          <p style={styles.downloadText}>
            Here are your downloads:
          </p>
          <div style={styles.downloadList}>
            <a href="#" style={styles.downloadLink}>📄 5-Minute Confidence Checklist (PDF)</a>
            <a href="#" style={styles.downloadLink}>📧 3 Email Templates (PDF)</a>
            <a href="#" style={styles.downloadLink}>📊 Simple Lead Tracker (Spreadsheet)</a>
          </div>
          <p style={styles.footerText}>
            If you don't see the email in a few minutes, check your spam folder.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>FREE RESOURCE</div>
        
        <h1 style={styles.title}>
          The Digital Income Starter Kit
        </h1>
        
        <p style={styles.subtitle}>
          3 simple tools to start earning online—no tech skills required
        </p>

        {/* Video Placeholder */}
        <div style={styles.videoContainer}>
          <div style={styles.videoPlaceholder}>
            <div style={styles.playButton}>▶</div>
            <p style={styles.videoText}>Video coming soon</p>
          </div>
        </div>

        <div style={styles.benefits}>
          <div style={styles.benefitItem}>
            <span style={styles.checkmark}>✓</span>
            <span>5-Minute Confidence Checklist</span>
          </div>
          <div style={styles.benefitItem}>
            <span style={styles.checkmark}>✓</span>
            <span>3 Ready-to-Use Email Templates</span>
          </div>
          <div style={styles.benefitItem}>
            <span style={styles.checkmark}>✓</span>
            <span>Simple Lead Tracker Spreadsheet</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Your first name"
            required
            style={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Your best email address"
            required
            style={styles.input}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <button type="submit" style={styles.button}>
            Send Me The Free Kit →
          </button>
        </form>

        <p style={styles.privacy}>
          🔒 We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    background: '#10b981',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 12px 0',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    margin: '0 0 30px 0',
    lineHeight: '1.5',
  },
  videoContainer: {
    marginBottom: '30px',
  },
  videoPlaceholder: {
    background: '#f3f4f6',
    borderRadius: '12px',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #d1d5db',
  },
  playButton: {
    width: '60px',
    height: '60px',
    background: '#667eea',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  videoText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  benefits: {
    textAlign: 'left',
    marginBottom: '30px',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '12px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    fontSize: '16px',
    color: '#374151',
  },
  checkmark: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    background: '#667eea',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '8px',
  },
  privacy: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '16px',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    background: '#10b981',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '40px',
    margin: '0 auto 20px',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 12px 0',
  },
  successText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0 0 24px 0',
  },
  downloadText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
  },
  downloadList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  downloadLink: {
    display: 'block',
    padding: '12px 16px',
    background: '#f3f4f6',
    borderRadius: '8px',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background 0.2s',
  },
  footerText: {
    fontSize: '14px',
    color: '#9ca3af',
  },
}
