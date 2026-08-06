export type AuthMode = 'login' | 'signup';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export type UserProfile = {
  username: string;
  email?: string;
  full_name?: string;
  disabled?: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type PortfolioMetric = {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'neutral' | 'warning';
};

export type TransactionRow = {
  fund: string;
  type: string;
  amount: string;
  timestamp: string;
};

export type WatchlistItem = {
  name: string;
  ticker: string;
  price: string;
  change: string;
};