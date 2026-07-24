import { useAuth } from '../contexts';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, Package, Heart, Calendar } from 'lucide-react';
import StatePanel from '../components/StatePanel';

export default function Profile() {
    const { user, logout } = useAuth();

    if (!user) return (
        <div style={{ paddingTop: 120, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 20 }}>
            <StatePanel
                title="Please login"
                description="Access your profile, saved items, order history, and preferences from one beautifully organized account view."
                icon={<User size={30} />}
                actionLabel="Login"
                actionHref="/login"
                tone="accent"
            />
        </div>
    );

    return (
        <div style={{ paddingTop: 90, minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 800 }}>
                <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 700, marginBottom: 40 }}>My Profile</h1>

                {/* Profile Card */}
                <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
                    {/* Banner */}
                    <div style={{ height: 140, background: 'linear-gradient(135deg, rgba(108,99,255,0.4), rgba(255,107,107,0.4))', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: -40, left: 32, width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient)', border: '4px solid var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#fff' }}>
                            {user.name[0].toUpperCase()}
                        </div>
                    </div>
                    <div style={{ padding: '56px 32px 32px' }}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user.name}</h2>
                        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <span className="badge badge-primary"><Shield size={12} /> {user.role?.toUpperCase()}</span>
                            <span className="badge badge-success">✓ Verified</span>
                        </div>
                    </div>
                </div>

                {/* Info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    {[
                        [User, 'Full Name', user.name],
                        [Mail, 'Email', user.email],
                        [Shield, 'Role', user.role],
                        [Calendar, 'Member Since', new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })],
                    ].map(([Icon, label, value]) => (
                        <div key={label} style={{ padding: '20px 24px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <Icon size={16} style={{ color: 'var(--primary-light)' }} />
                                <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>{label}</span>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{value}</div>
                        </div>
                    ))}
                </div>

                {/* Quick links */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                    {[
                        [Package, 'My Orders', '/orders', 'View all your orders'],
                        [Heart, 'Wishlist', '/wishlist', 'Saved products'],
                    ].map(([Icon, label, href, desc]) => (
                        <Link key={label} to={href} style={{ padding: '20px 24px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, transition: 'var(--transition)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={22} style={{ color: 'var(--primary-light)' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
                                <div style={{ fontSize: 13, color: 'var(--text3)' }}>{desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <button className="btn btn-danger" onClick={logout}>Sign Out</button>
            </div>
        </div>
    );
}
