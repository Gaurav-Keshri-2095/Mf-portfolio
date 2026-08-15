import { allocation, goals, portfolioMetrics, recentTransactions, watchlist } from '../data/dashboard';
import { DashboardShell } from '../components/DashboardShell';
import type { UserProfile } from '../types';

type DashboardPageProps = {
  user: UserProfile | null;
  onLogout: () => void;
};

function AllocationRing() {
  const total = allocation.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;

  return (
    <svg viewBox="0 0 120 120" className="allocation-ring" aria-label="Portfolio allocation chart">
      <circle className="ring-base" cx="60" cy="60" r="42" />
      {allocation.map((segment) => {
        const circumference = 264;
        const dash = (segment.value / total) * circumference;
        const circle = (
          <circle
            key={segment.label}
            className="ring-segment"
            cx="60"
            cy="60"
            r="42"
            stroke={segment.color}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return circle;
      })}
      <text x="60" y="56" textAnchor="middle" className="ring-label">
        100%
      </text>
      <text x="60" y="71" textAnchor="middle" className="ring-subtitle">
        invested
      </text>
    </svg>
  );
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  return (
    <DashboardShell user={user} onLogout={onLogout}>
      <section className="dashboard-hero" id="overview">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{user?.full_name ?? user?.username ?? 'Investor'}, your portfolio is moving in the right direction.</h1>
          <p>
            Monitor performance, rebalance exposure, and keep your goals on track without leaving
            the same dashboard.
          </p>
        </div>

        <div className="market-card">
          <span>Market pulse</span>
          <strong>Sensex +0.82%</strong>
          <small>Nifty Pharma leading the session</small>
        </div>
      </section>

      <section className="metric-grid" aria-label="Portfolio metrics">
        {portfolioMetrics.map((metric) => (
          <article key={metric.label} className={`metric-card tone-${metric.tone}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.delta}</small>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel" id="allocation">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Allocation</p>
              <h2>Portfolio mix</h2>
            </div>
            <span className="panel-pill">Balanced</span>
          </div>

          <div className="allocation-wrap">
            <AllocationRing />

            <div className="allocation-list">
              {allocation.map((segment) => (
                <div key={segment.label} className="allocation-row">
                  <span className="allocation-dot" style={{ backgroundColor: segment.color }} />
                  <div>
                    <strong>{segment.label}</strong>
                    <small>{segment.value}% exposure</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Goals</p>
              <h2>Progress tracking</h2>
            </div>
          </div>

          <div className="goals-list">
            {goals.map((goal) => (
              <div key={goal.label} className="goal-row">
                <div className="goal-copy">
                  <strong>{goal.label}</strong>
                  <span>{goal.progress}% funded</span>
                </div>
                <div className="progress-bar" aria-hidden="true">
                  <span style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="content-grid" id="transactions">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Activity</p>
              <h2>Recent transactions</h2>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={`${transaction.fund}-${transaction.timestamp}`}>
                    <td>{transaction.fund}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel" id="watchlist">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Watchlist</p>
              <h2>Funds to monitor</h2>
            </div>
          </div>

          <div className="watchlist-list">
            {watchlist.map((item) => (
              <div key={item.ticker} className="watch-card">
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.ticker}</span>
                </div>
                <div className="watch-values">
                  <strong>{item.price}</strong>
                  <span>{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}