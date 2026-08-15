import type { PortfolioMetric, TransactionRow, WatchlistItem } from '../types';

export const portfolioMetrics: PortfolioMetric[] = [
  { label: 'Portfolio Value', value: '$124,820', delta: '+8.4% this month', tone: 'positive' },
  { label: 'Invested Capital', value: '$96,500', delta: '+$4,200 added', tone: 'neutral' },
  { label: 'XIRR', value: '18.7%', delta: '+1.9% vs last quarter', tone: 'positive' },
  { label: 'Active SIPs', value: '12', delta: '2 due this week', tone: 'warning' },
];

export const recentTransactions: TransactionRow[] = [
  { fund: 'Bluechip Growth Fund', type: 'Buy', amount: '$2,500', timestamp: 'Today, 09:20' },
  { fund: 'Flexi Cap Fund', type: 'SIP', amount: '$1,000', timestamp: 'Yesterday, 18:40' },
  { fund: 'Index Tracker Fund', type: 'Rebalance', amount: '$4,800', timestamp: 'Tue, 14:15' },
  { fund: 'Liquid Reserve Fund', type: 'Transfer', amount: '$9,000', timestamp: 'Mon, 11:05' },
];

export const watchlist: WatchlistItem[] = [
  { name: 'Horizon Equity Fund', ticker: 'HEQ', price: '$146.82', change: '+1.8%' },
  { name: 'Alpha Infra Fund', ticker: 'AIF', price: '$93.14', change: '+0.9%' },
  { name: 'Core Debt Fund', ticker: 'CDF', price: '$18.30', change: '-0.1%' },
  { name: 'Emerging Tech Fund', ticker: 'ETF', price: '$208.40', change: '+2.4%' },
];

export const allocation = [
  { label: 'Equity', value: 56, color: '#f97316' },
  { label: 'Debt', value: 24, color: '#0ea5e9' },
  { label: 'Gold', value: 10, color: '#eab308' },
  { label: 'Cash', value: 10, color: '#22c55e' },
];

export const goals = [
  { label: 'Retirement', progress: 72 },
  { label: 'Home Down Payment', progress: 48 },
  { label: "Children's Education", progress: 61 },
];