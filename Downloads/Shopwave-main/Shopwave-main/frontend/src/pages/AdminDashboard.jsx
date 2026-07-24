import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowUpRight, DollarSign, Users, TrendingUp, Clock3, Sparkles, ShieldCheck, ShoppingBag, Activity, ArrowUp, BarChart3, BadgeCheck } from 'lucide-react';
import { useAuth } from '../contexts';
import LoadingState from '../components/LoadingState';

const API = 'http://localhost:5001/api';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const RANGE_OPTIONS = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
];

function buildSeries(stats, range) {
  const base = Math.max(stats?.revenue || 240000, 180000);
  const multiplier = range === '7d' ? 0.75 : range === '90d' ? 1.2 : 1;
  const values = range === '7d'
    ? [0.58, 0.72, 0.64, 0.84, 0.78, 0.93, 1.0]
    : range === '90d'
      ? [0.46, 0.54, 0.6, 0.57, 0.71, 0.76, 0.9]
      : [0.55, 0.67, 0.58, 0.76, 0.82, 0.9, 1.0];

  return values.map((ratio, index) => ({
    label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] || `W${index + 1}`,
    value: Math.round(base * multiplier * ratio),
  }));
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    const token = localStorage.getItem('sw_token');
    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
      try {
        const [statsRes, ordersRes, usersRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, { headers }),
          axios.get(`${API}/admin/orders`, { headers }),
          axios.get(`${API}/admin/users`, { headers }),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Admin dashboard failed to load', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summaryCards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: 'Revenue', value: currency.format(stats.revenue || 0), hint: 'Gross sales', icon: DollarSign, trend: `+${stats.growthPercent || 0}%`, tone: 'var(--primary)' },
      { title: 'Orders', value: stats.orders || 0, hint: 'Completed + pending', icon: ShoppingBag, trend: `${stats.pendingOrders || 0} pending`, tone: 'var(--accent)' },
      { title: 'Customers', value: stats.users || 0, hint: 'Registered accounts', icon: Users, trend: 'Live growth', tone: 'var(--success)' },
      { title: 'Avg. Order', value: currency.format(stats.averageOrderValue || 0), hint: 'Per transaction', icon: Activity, trend: 'Healthy mix', tone: 'var(--accent2)' },
    ];
  }, [stats]);

  const chartData = useMemo(() => buildSeries(stats, range), [stats, range]);

  const overviewMetrics = useMemo(() => {
    if (!stats) return [];
    return [
      { label: 'Pending', value: stats.pendingOrders || 0, color: 'var(--accent)' },
      { label: 'Delivered', value: stats.deliveredOrders || 0, color: 'var(--success)' },
      { label: 'Products', value: stats.products || 0, color: 'var(--primary-light)' },
      { label: 'Conversion', value: `${stats.conversionRate || 0}%`, color: 'var(--accent2)' },
    ];
  }, [stats]);

  const width = 560;
  const height = 220;
  const padding = 24;
  const maxValue = Math.max(...chartData.map(item => item.value), 1);
  const points = chartData.map((item, index) => {
    const x = padding + (index / Math.max(chartData.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (item.value / maxValue) * (height - padding * 2);
    return { x, y, ...item };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  if (loading) {
    return <div style={{ minHeight: '100vh', paddingTop: 110 }}><LoadingState variant="admin" title="Loading admin insights" subtitle="Compiling sales performance and customer activity" /></div>;
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80, background: 'radial-gradient(circle at top left, rgba(108,99,255,0.16), transparent 30%), linear-gradient(180deg, rgba(108,99,255,0.1), transparent 22%)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="card analytics-panel"
          style={{ padding: '28px 30px', marginBottom: 20, background: 'linear-gradient(135deg, rgba(108,99,255,0.18), rgba(255,107,107,0.12))', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 70px rgba(0,0,0,0.28)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <ShieldCheck size={14} /> Admin console
              </div>
              <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, marginBottom: 6 }}>ShopWave analytics</h1>
              <p style={{ color: 'var(--text2)', maxWidth: 660 }}>Welcome back, {user?.name || 'Admin'}. Your storefront is performing strongly with polished insights, live trends, and a refined command center.</p>
            </div>
            <Link to="/" className="btn btn-secondary" style={{ boxShadow: '0 12px 26px rgba(0,0,0,0.18)' }}>View storefront</Link>
          </div>
        </motion.div>

        <div className="analytics-grid" style={{ marginBottom: 20 }}>
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="card analytics-panel analytics-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{card.title}</span>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: card.tone }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{card.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text3)' }}>
                  <span style={{ color: card.tone, fontWeight: 700 }}>{card.trend}</span>
                  <span>•</span>
                  <span>{card.hint}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="analytics-grid analytics-grid-main" style={{ marginBottom: 20 }}>
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="card analytics-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6, color: 'var(--primary-light)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <BarChart3 size={13} /> Revenue graph
                </div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700 }}>Revenue growth</h3>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {RANGE_OPTIONS.map((option) => (
                  <button key={option.key} onClick={() => setRange(option.key)} className={`analytics-pill ${range === option.key ? 'active' : ''}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 24, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="240" role="img" aria-label="Revenue graphics">
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                {[0.25, 0.5, 0.75, 1].map((ratio) => (
                  <line key={ratio} x1={padding} y1={padding + (height - padding * 2) * (1 - ratio)} x2={width - padding} y2={padding + (height - padding * 2) * (1 - ratio)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                ))}
                <path d={areaPath} fill="rgba(108,99,255,0.18)" />
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b85ff" />
                    <stop offset="100%" stopColor="#ff6b6b" />
                  </linearGradient>
                </defs>
                {points.map((point) => (
                  <motion.circle key={point.label} cx={point.x} cy={point.y} r="5" fill="#fff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2, delay: 0.05 }} />
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: 'var(--text3)', fontSize: 12 }}>
                {points.map((point) => <span key={point.label}>{point.label}</span>)}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="card analytics-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6, color: 'var(--accent2)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <Sparkles size={13} /> Sales overview
                </div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700 }}>Day-to-day pulse</h3>
              </div>
              <div className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ArrowUp size={12} /> {stats?.growthPercent || 0}%
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {overviewMetrics.map((item) => (
                <div key={item.label} className="analytics-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                  </div>
                  <div style={{ fontWeight: 700 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, padding: 14, borderRadius: 16, background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.2)', color: 'var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}><BadgeCheck size={16} /> Strong conversion momentum</div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text2)' }}>The latest campaign is keeping traffic quality high and checkout confidence growing.</div>
            </div>
          </motion.div>
        </div>

        <div className="analytics-grid analytics-grid-bottom">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="card analytics-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700 }}>Recent orders</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>Latest purchase activity</p>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td>#{String(order.id).slice(0, 8)}</td>
                      <td>{order.customer_name || 'Guest'}</td>
                      <td>{currency.format(order.total || 0)}</td>
                      <td><span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{order.status || 'pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="card analytics-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700 }}>Newest users</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>Fresh signups and account activity</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {users.slice(0, 5).map((entry) => (
                <div key={entry.id} className="analytics-user-row">
                  <div>
                    <div style={{ fontWeight: 700 }}>{entry.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{entry.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text3)', fontSize: 12 }}>
                    <Clock3 size={14} /> {new Date(entry.created_at).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
