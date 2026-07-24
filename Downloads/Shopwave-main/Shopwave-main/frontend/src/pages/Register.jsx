import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Zap, UserPlus } from 'lucide-react';

const API = 'http://localhost:5001/api';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
        if (form.password.length < 6) { toast.error('Password must be 6+ characters'); return; }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Welcome to ShopWave! 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
        setLoading(false);
    };

    const handleGoogleSignup = async () => {
        setGoogleLoading(true);
        try {
            const r = await axios.post(`${API}/auth/google`, { demo: true });
            localStorage.setItem('sw_token', r.data.token);
            toast.success('Account created with Google! 🎉');
            window.location.href = '/';
        } catch {
            toast.error('Google signup failed');
        }
        setGoogleLoading(false);
    };

    const strength = form.password.length < 4 ? 0 : form.password.length < 6 ? 1 : form.password.length < 8 ? 2 : /[A-Z]/.test(form.password) && /\d/.test(form.password) ? 4 : 3;
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', 'var(--accent)', '#ffd166', '#3b82f6', 'var(--success)'][strength];

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
            {/* Left - Decorative */}
            <div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.95) 0%, rgba(108,99,255,0.95) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 4vw, 60px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '-5%', right: '-5%' }} />
                <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', bottom: '5%', left: '5%' }} />
                <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
                    <div style={{ fontSize: 80, marginBottom: 24, animation: 'float 4s ease-in-out infinite' }}>✨</div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Join ShopWave</h2>
                    <p style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.8, marginBottom: 36 }}>Start your premium<br />shopping journey today</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['🎁 Free ₹200 welcome coupon', '⚡ Instant account activation', '🛡️ Secure & private', '💳 Multiple payment options'].map(f => (
                            <div key={f} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 500, backdropFilter: 'blur(10px)', textAlign: 'left' }}>{f}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right - Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 4vw, 40px)', overflow: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 420, animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={22} fill="#fff" color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ShopWave</span>
                    </div>

                    <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Create Account</h2>
                    <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Start shopping in seconds</p>

                    {/* Google button */}
                    <button onClick={handleGoogleSignup} disabled={googleLoading}
                        style={{ width: '100%', padding: '14px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, background: '#fff', color: '#3c4043', border: '1px solid #dadce0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20, transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.24)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {googleLoading ? 'Connecting...' : 'Sign up with Google'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text3)' }}>or with email</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Pranjal Sharma' },
                            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                        ].map(({ label, key, type, placeholder }) => (
                            <div key={key}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text2)' }}>{label}</label>
                                <input type={type} className="input" value={form[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} required />
                            </div>
                        ))}

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text2)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input type={show ? 'text' : 'password'} className="input" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" required style={{ paddingRight: 44 }} />
                                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {form.password && (
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                        {[1, 2, 3, 4].map(n => (
                                            <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: n <= strength ? strengthColor : 'var(--border)', transition: 'all 0.3s ease' }} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel} password</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text2)' }}>Confirm Password</label>
                            <input type="password" className="input"
                                value={form.confirm} onChange={e => update('confirm', e.target.value)}
                                placeholder="Repeat password" required
                                style={{ borderColor: form.confirm && form.confirm !== form.password ? 'var(--accent)' : '' }}
                            />
                            {form.confirm && form.confirm !== form.password && (
                                <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>Passwords don't match</p>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 15, marginTop: 4 }} disabled={loading}>
                            {loading ? '⏳ Creating account...' : <><UserPlus size={18} /> Create Account</>}
                        </button>

                        <p style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
                            By signing up, you agree to our <a href="#" style={{ color: 'var(--primary-light)' }}>Terms</a> & <a href="#" style={{ color: 'var(--primary-light)' }}>Privacy Policy</a>
                        </p>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text2)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
