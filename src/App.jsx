import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:4000/api'

function MarkIcon() {
  return <svg className="mark-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 27 9v8c0 6.4-4.4 10.5-11 12C9.4 27.5 5 23.4 5 17V9l11-6Z" /><path className="mark-check" d="m10.5 16.2 3.5 3.5 7.5-8" /></svg>
}

function FieldIcon({ type }) {
  return type === 'email'
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
}

function App() {
  const [email, setEmail] = useState('demo@nova.io')
  const [password, setPassword] = useState('nova1234')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('nova_token') || sessionStorage.getItem('nova_token')
    if (!token) return
    fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setUser(data.user))
      .catch(() => { localStorage.removeItem('nova_token'); sessionStorage.removeItem('nova_token') })
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      if (remember) localStorage.setItem('nova_token', data.token)
      else sessionStorage.setItem('nova_token', data.token)
      setUser(data.user)
    } catch (requestError) {
      setError(requestError.message || '로그인에 실패했습니다.')
    } finally { setIsLoading(false) }
  }

  function handleLogout() {
    localStorage.removeItem('nova_token'); sessionStorage.removeItem('nova_token'); setUser(null)
  }

  if (user) return <main className="authenticated-shell">
    <div className="dashboard-bar"><div className="brand"><MarkIcon /><span>NOVA</span></div><button className="text-button" type="button" onClick={handleLogout}>로그아웃</button></div>
    <section className="welcome-panel"><div className="status-dot">인증 완료</div><p className="eyebrow">YOUR PRIVATE WORKSPACE</p><h1>반가워요, {user.name}님.</h1><p className="welcome-copy">NOVA 보안 콘솔에 안전하게 연결되었습니다.</p><div className="session-card"><span>현재 세션</span><strong>{user.email}</strong><small>JWT access token으로 보호 중</small></div></section>
  </main>

  return <main className="login-shell">
    <section className="intro-panel"><div className="brand"><MarkIcon /><span>NOVA</span></div><div className="intro-content"><p className="eyebrow">SECURE ACCESS / 01</p><h1>Work with<br /><em>clarity.</em></h1><p className="intro-copy">A calm, secure workspace for teams building what matters next.</p></div><div className="intro-footer"><span>© 2025 NOVA SYSTEMS</span><span>STATUS <b>●</b> OPERATIONAL</span></div></section>
    <section className="form-panel"><div className="form-wrap"><div className="mobile-brand brand"><MarkIcon /><span>NOVA</span></div><p className="eyebrow">WELCOME BACK</p><h2>다시 만나서 반가워요.</h2><p className="form-subtitle">계정에 로그인하고 작업을 계속하세요.</p><form onSubmit={handleSubmit}>
      <label htmlFor="email">이메일 주소</label><div className="input-wrap"><FieldIcon type="email" /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div>
      <div className="label-row"><label htmlFor="password">비밀번호</label><button className="forgot-button" type="button">비밀번호 찾기</button></div><div className="input-wrap"><FieldIcon type="password" /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? '숨김' : '보기'}</button></div>
      <label className="check-row"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>로그인 상태 유지</span></label>{error && <p className="error-message" role="alert">{error}</p>}<button className="submit-button" type="submit" disabled={isLoading}>{isLoading ? '확인 중...' : '안전하게 로그인'}<span>↗</span></button>
    </form><p className="demo-hint">DEMO ACCOUNT <strong>demo@nova.io</strong> / <strong>nova1234</strong></p><p className="signup-copy">아직 계정이 없나요? <button type="button">무료로 시작하기</button></p></div><div className="form-mark">N / 01</div></section>
  </main>
}

export default App
