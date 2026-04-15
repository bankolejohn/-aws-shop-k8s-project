import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Zap, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type: 'error'|'success', message }

  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect back to where user came from, or home
  const from = location.state?.from || '/'

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    let result
    if (tab === 'login') {
      result = await login(form.email, form.password)
    } else {
      if (form.password.length < 8) {
        setFeedback({ type: 'error', message: 'Password must be at least 8 characters' })
        setLoading(false)
        return
      }
      result = await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName
      })
    }

    setLoading(false)

    if (result.success) {
      setFeedback({ type: 'success', message: tab === 'login' ? 'Welcome back!' : 'Account created!' })
      setTimeout(() => navigate(from), 800)
    } else {
      setFeedback({ type: 'error', message: result.error || 'Something went wrong' })
    }
  }

  const switchTab = (t) => {
    setTab(t)
    setFeedback(null)
    setForm({ email: '', password: '', firstName: '', lastName: '' })
  }

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-logo">
          <Zap size={28} />
          <span>ShopAWS</span>
        </div>

        <div className="login-tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>
            Sign In
          </button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => switchTab('register')}>
            Register
          </button>
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div className={`login-feedback ${feedback.type}`}>
            {feedback.type === 'error'
              ? <AlertCircle size={15} />
              : <CheckCircle size={15} />
            }
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="grid-2">
              <div className="form-group">
                <label>First Name</label>
                <input
                  required
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  required
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder={tab === 'register' ? 'Min. 8 characters' : '••••••••'}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading
              ? <span className="login-spinner" />
              : null
            }
            {loading
              ? (tab === 'login' ? 'Signing in...' : 'Creating account...')
              : (tab === 'login' ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        {/* Demo quick-login */}
        <button
          className="btn btn-outline demo-btn"
          onClick={() => {
            set('email', 'demo@shopaws.com')
            set('password', 'demo1234')
            setTab('login')
          }}
        >
          Use Demo Account
        </button>

        <div className="login-footer">
          <Lock size={13} />
          <span>Secured by AWS Cognito User Pool</span>
        </div>
      </div>
    </div>
  )
}