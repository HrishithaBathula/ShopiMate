import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../assets/styles/auth.css'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')

  const handleAuth = async () => {
    setError('')
    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) setError(error.message)
    else console.log('✅ Auth Success:', data)
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-heading">
          {isLogin ? 'Welcome Back 👋' : 'Create an Account'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />

        {error && <p className="auth-error">{error}</p>}

        <button onClick={handleAuth} className="auth-button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="auth-toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="auth-toggle-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
