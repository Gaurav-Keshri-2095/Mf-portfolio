import type { AuthMode } from '../types';

type AuthCardProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  children: React.ReactNode;
};

export function AuthCard({ mode, onModeChange, children }: AuthCardProps) {
  return (
    <section className="auth-shell">
      <div className="auth-hero">
        <p className="eyebrow">MF Portfolio</p>
        <h1>See every rupee, goal, and return in one clean command center.</h1>
        <p>
          Sign in to track SIPs, portfolio allocation, and recent transactions with a dashboard
          designed for fast decision-making.
        </p>
        <div className="auth-highlight">
          <span>Live portfolio view</span>
          <strong>₹124.8K</strong>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => onModeChange('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'tab active' : 'tab'}
            onClick={() => onModeChange('signup')}
          >
            Sign up
          </button>
        </div>

        {children}
      </div>
    </section>
  );
}