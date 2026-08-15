import { useEffect, useState } from 'react';
import { login, fetchCurrentUser, signup } from './lib/api';
import { tokenStorage } from './lib/storage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import type { AuthMode, AuthStatus, UserProfile } from './types';

function getModeFromHash(): AuthMode {
  return window.location.hash === '#signup' ? 'signup' : 'login';
}

export default function App() {
  const [mode, setMode] = useState<AuthMode>(getModeFromHash());
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const syncMode = () => setMode(getModeFromHash());
    window.addEventListener('hashchange', syncMode);
    return () => window.removeEventListener('hashchange', syncMode);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let cancelled = false;
    setStatus('loading');

    void fetchCurrentUser(token)
      .then((profile) => {
        if (!cancelled) {
          setUser(profile);
          setStatus('authenticated');
          window.location.hash = '#dashboard';
        }
      })
      .catch((requestError: unknown) => {
        if (cancelled) {
          return;
        }

        tokenStorage.clear();
        setToken(null);
        setUser(null);
        setStatus('error');
        setError(requestError instanceof Error ? requestError.message : 'Unable to load session');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleLogin(username: string, password: string) {
    setStatus('loading');
    setError(null);

    try {
      const response = await login(username, password);
      tokenStorage.set(response.access_token);
      setToken(response.access_token);
      setStatus('authenticated');
      window.location.hash = '#dashboard';
    } catch (requestError) {
      setStatus('error');
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in');
    }
  }

  async function handleSignup(input: {
    username: string;
    email: string;
    full_name: string;
    password: string;
  }) {
    setStatus('loading');
    setError(null);

    try {
      const response = await signup(input);
      tokenStorage.set(response.access_token);
      setToken(response.access_token);
      setStatus('authenticated');
      window.location.hash = '#dashboard';
    } catch (requestError) {
      setStatus('error');
      setError(requestError instanceof Error ? requestError.message : 'Unable to create account');
    }
  }

  function handleLogout() {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
    setStatus('idle');
    setError(null);
    window.location.hash = '#login';
  }

  if (token && status !== 'error' && user) {
    return <DashboardPage user={user} onLogout={handleLogout} />;
  }

  return (
    <main className="app-root">
      <AuthPage
        mode={mode}
        onModeChange={(nextMode) => {
          setMode(nextMode);
          window.location.hash = nextMode === 'signup' ? '#signup' : '#login';
          setError(null);
        }}
        onLogin={handleLogin}
        onSignup={handleSignup}
        loading={status === 'loading'}
        error={error}
      />
    </main>
  );
}