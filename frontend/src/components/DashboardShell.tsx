import type { UserProfile } from '../types';

type DashboardShellProps = {
  user: UserProfile | null;
  onLogout: () => void;
  children: React.ReactNode;
};

export function DashboardShell({ user, onLogout, children }: DashboardShellProps) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">MF Portfolio</p>
          <h2>Investor Console</h2>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard sections">
          <a href="#overview">Overview</a>
          <a href="#allocation">Allocation</a>
          <a href="#transactions">Transactions</a>
          <a href="#watchlist">Watchlist</a>
        </nav>

        <div className="sidebar-profile">
          <span>Signed in as</span>
          <strong>{user?.full_name ?? user?.username ?? 'Investor'}</strong>
          <small>{user?.email ?? 'Connected account'}</small>
        </div>

        <button type="button" className="logout-button" onClick={onLogout}>
          Log out
        </button>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}