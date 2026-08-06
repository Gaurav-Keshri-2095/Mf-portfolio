import { useState } from 'react';
import { AuthCard } from '../components/AuthCard';
import type { AuthMode } from '../types';

type AuthPageProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onLogin: (username: string, password: string) => Promise<void>;
  onSignup: (payload: {
    username: string;
    email: string;
    full_name: string;
    password: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function AuthPage({ mode, onModeChange, onLogin, onSignup, loading, error }: AuthPageProps) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
  });

  return (
    <AuthCard mode={mode} onModeChange={onModeChange}>
      {mode === 'login' ? (
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            void onLogin(loginForm.username, loginForm.password);
          }}
        >
          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              value={loginForm.username}
              onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
              placeholder="Enter username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="form-footer">
            New here?{' '}
            <button type="button" className="link-button" onClick={() => onModeChange('signup')}>
              Create an account
            </button>
          </p>
        </form>
      ) : (
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            void onSignup(signupForm);
          }}
        >
          <label>
            Full name
            <input
              type="text"
              autoComplete="name"
              value={signupForm.full_name}
              onChange={(event) => setSignupForm({ ...signupForm, full_name: event.target.value })}
              placeholder="Your full name"
              required
            />
          </label>

          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              value={signupForm.username}
              onChange={(event) => setSignupForm({ ...signupForm, username: event.target.value })}
              placeholder="Choose a username"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={signupForm.email}
              onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
              placeholder="name@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="new-password"
              value={signupForm.password}
              onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
              placeholder="Create a password"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="form-footer">
            Already registered?{' '}
            <button type="button" className="link-button" onClick={() => onModeChange('login')}>
              Log in
            </button>
          </p>
        </form>
      )}
    </AuthCard>
  );
}