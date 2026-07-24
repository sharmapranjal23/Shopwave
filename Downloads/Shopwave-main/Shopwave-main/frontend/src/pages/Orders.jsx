import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts';
import { Link } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import StatePanel from '../components/StatePanel';

const API = 'http://localhost:5001/api';

const STATUS_CONFIG = {
    pending: { icon: Clock, color: '#ffd166', label: 'Pending' },
    processing: { icon: Package, color: 'var(--primary-light)', label: 'Processing' },
    shipped: { icon: Truck, color: '#0099cc', label: 'Shipped' },
    delivered: { icon: CheckCircle, color: 'var(--success)', label: 'Delivered' },
    cancelled: { icon: XCircle, color: 'var(--accent)', label: 'Cancelled' },
};

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        axios.get(`${API}/orders`, { headers: { Authorization: `Bearer ${localStorage.getItem('sw_token')}` } })
            .then(r => { setOrders(r.data); setLoading(false); });
    }, [user]);

    if (!user) return (
        <div style={{ paddingTop: 120, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 20 }}>
            <StatePanel
                title="Please login to view orders"
                description="Your purchases, delivery updates, and support history all live in one secure place once you’re signed in."
                icon={<ShoppingBag size={30} />}
                actionLabel="Login"
                actionHref="/login"
                tone="accent"
            />
        </div>
    );

    if (loading) return <LoadingState variant="orders" title="Loading your orders" subtitle="Gathering recent purchases" />;

    return (
        <div style={{ paddingTop: 90, minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 900 }}>
                <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>My Orders</h1>

                {orders.length === 0 ? (
                    <div style={{ padding: '20px 0' }}>
                        <StatePanel
                            title="No orders yet"
                            description="Your first purchase will appear here with live delivery updates and a polished order timeline."
                            icon={<Package size={30} />}
                            actionLabel="Start Shopping"
                            actionHref="/products"
                            tone="success"
                            compact
                        />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {orders.map(order => {
                            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                            const StatusIcon = cfg.icon;
                            return (
                                <div key={order.id} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexWrap: 'wrap', gap: 12 }}>
                                        <div>
                                            <span style={{ fontSize: 12, color: 'var(--text3)' }}>ORDER ID</span>
                                            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, fontFamily: 'monospace' }}>#{order.id.slice(0, 8).toUpperCase()}</div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 12, color: 'var(--text3)' }}>PLACED ON</span>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: 12, color: 'var(--text3)' }}>TOTAL</span>
                                            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{parseFloat(order.total).toLocaleString()}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: `${cfg.color}22`, border: `1px solid ${cfg.color}44`, color: cfg.color, fontSize: 13, fontWeight: 600 }}>
                                            <StatusIcon size={14} /> {cfg.label}
                                        </div>
                                    </div>
                                    {/* Items */}
                                    <div style={{ padding: '16px 24px' }}>
                                        {order.items?.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛍️</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                                                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>Qty: {item.quantity}</div>
                                                    </div>
                                                </div>
                                                <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {order.address && (
                                            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 12 }}>📍 {order.address}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
