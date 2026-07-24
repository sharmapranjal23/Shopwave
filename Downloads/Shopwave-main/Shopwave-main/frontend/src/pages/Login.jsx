import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, LogIn, Phone, ArrowLeft, RefreshCw, Mail, Lock } from 'lucide-react';

const API = 'http://localhost:5001/api';

export default function Login() {
    const [tab, setTab] = useState('email'); // 'email' | 'otp' | 'otp-verify'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [demoOtp, setDemoOtp] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();

    // OTP countdown timer
    useEffect(() => {
        if (otpTimer > 0) {
            const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [otpTimer]);

    // Handle OTP box key navigation
    const handleOtpKey = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            document.getElementById(`otp-${idx - 1}`)?.focus();
        }
    };

    const handleOtpChange = (val, idx) => {
        if (!/^\d*$/.test(val)) return;
        const newOtp = [...otp];
        newOtp[idx] = val.slice(-1);
        setOtp(newOtp);
        if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
    };

    // Email + Password Login
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back! 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        }
        setLoading(false);
    };

    // Google Login (Demo Mode)
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const r = await axios.post(`${API}/auth/google`, { demo: true });
            localStorage.setItem('sw_token', r.data.token);
            // Force context refresh
            window.location.href = '/';
        } catch (err) {
            toast.error('Google login failed');
        }
        setLoading(false);
    };

    // Send OTP
    const handleSendOtp = async () => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 10) { toast.error('Enter a valid 10-digit phone number'); return; }
        setLoading(true);
        try {
            const r = await axios.post(`${API}/auth/send-otp`, { phone: cleaned });
            setDemoOtp(r.data.demo_otp);
            setOtpTimer(60);
            setTab('otp-verify');
            toast.success(`OTP sent! Demo OTP: ${r.data.demo_otp}`, { duration: 8000 });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send OTP');
        }
        setLoading(false);
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        const otpStr = otp.join('');
        if (otpStr.length !== 6) { toast.error('Enter complete 6-digit OTP'); return; }
        setLoading(true);
        try {
            const cleaned = phone.replace(/\D/g, '');
            const r = await axios.post(`${API}/auth/verify-otp`, { phone: cleaned, otp: otpStr });
            localStorage.setItem('sw_token', r.data.token);
            toast.success('Logged in successfully! 🎉');
            window.location.href = '/';
        } catch (err) {
            toast.error(err.response?.data?.error || 'Invalid OTP');
            setOtp(['', '', '', '', '', '']);
            document.getElementById('otp-0')?.focus();
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg)',
        }}>
            {/* Left Panel - Decorative */}
            <div style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.98) 0%, rgba(255,107,107,0.95) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 4vw, 60px)', position: 'relative', overflow: 'hidden' }}>
                {/* Orbs */}
                {[200, 150, 100].map((s, i) => (
                    <motion.div key={i} animate={{ scale: [1, 1.06, 1], opacity: [0.12, 0.24, 0.12] }} transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ position: 'absolute', width: s, height: s, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', ...[{ top: '10%', left: '-5%' }, { top: '60%', right: '-5%' }, { bottom: '10%', left: '22%' }][i] }} />
                ))}
                <div style={{ position: 'relative', textAlign: 'center', color: '#fff', zIndex: 1 }}>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ fontSize: 80, marginBottom: 24 }}>🛍️</motion.div>
                    <h2 style={{ fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.04em' }}>ShopWave</h2>
                    <p style={{ fontSize: 17, opacity: 0.88, lineHeight: 1.75, marginBottom: 40 }}>India's most trusted<br />online shopping destination</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {['🚀 50,000+ Premium Products', '🔒 100% Secure Payments', '🚚 Free Delivery Nationwide', '⭐ 2M+ Happy Customers'].map((f, i) => (
                            <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.3, duration: 0.45 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.14)', borderRadius: 14, padding: '11px 16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)' }}>{f}</motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 4vw, 40px)', overflow: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 420, animation: 'fadeIn 0.4s ease' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={22} fill="#fff" color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ShopWave</span>
                    </div>

                    {tab === 'otp-verify' ? (
                        /* ── OTP Verify Screen ── */
                        <div>
                            <button onClick={() => { setTab('otp'); setOtp(['', '', '', '', '', '']); }} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)', background: 'none', fontFamily: 'inherit', fontSize: 14, marginBottom: 24, cursor: 'pointer' }}>
                                <ArrowLeft size={16} /> Back
                            </button>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Enter OTP</h2>
                            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 8 }}>Sent to +91 {phone}</p>

                            {/* Demo OTP hint */}
                            {demoOtp && (
                                <div style={{ background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 24, fontSize: 13 }}>
                                    <span style={{ color: 'var(--text3)' }}>📱 Demo OTP: </span>
                                    <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: 18, letterSpacing: 3 }}>{demoOtp}</span>
                                    <span style={{ color: 'var(--text3)', fontSize: 11, display: 'block', marginTop: 2 }}>*(In production, this is sent via SMS)*</span>
                                </div>
                            )}

                            {/* OTP boxes */}
                            <div style={{ display: 'flex', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i} id={`otp-${i}`}
                                        type="text" inputMode="numeric" maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(e.target.value, i)}
                                        onKeyDown={e => handleOtpKey(e, i)}
                                        style={{
                                            width: 52, height: 60, textAlign: 'center', fontSize: 22, fontWeight: 800,
                                            background: digit ? 'rgba(108,99,255,0.15)' : 'var(--bg3)',
                                            border: `2px solid ${digit ? 'var(--primary)' : 'var(--border)'}`,
                                            borderRadius: 12, color: 'var(--text)', fontFamily: 'inherit', outline: 'none',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--primary-light)'}
                                        onBlur={e => e.target.style.borderColor = digit ? 'var(--primary)' : 'var(--border)'}
                                    />
                                ))}
                            </div>

                            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}
                                onClick={handleVerifyOtp} disabled={loading}>
                                {loading ? '⏳ Verifying...' : '✓ Verify & Login'}
                            </button>

                            <div style={{ textAlign: 'center', fontSize: 14 }}>
                                {otpTimer > 0 ? (
                                    <span style={{ color: 'var(--text3)' }}>Resend OTP in {otpTimer}s</span>
                                ) : (
                                    <button onClick={() => { setTab('otp'); }} style={{ color: 'var(--primary-light)', background: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                                        <RefreshCw size={13} style={{ display: 'inline', marginRight: 4 }} />Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ── Main Login Screen ── */
                        <>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Welcome back</h2>
                            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Sign in to your account</p>

                            {/* Tab switcher with sliding pill */}
                            <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 14, padding: 4, marginBottom: 24, border: '1px solid var(--border)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)', position: 'relative' }}>
                                {[['email', '📧 Email'], ['otp', '📱 Phone OTP']].map(([key, label]) => (
                                    <button key={key} onClick={() => setTab(key)}
                                        style={{ flex: 1, padding: '11px', borderRadius: 10, fontFamily: 'Plus Jakarta Sans, inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'color 0.25s ease', background: 'transparent', color: tab === key ? '#fff' : 'var(--text2)', border: 'none', position: 'relative', zIndex: 1 }}>
                                        {tab === key && <motion.div layoutId="tab-pill" style={{ position: 'absolute', inset: 0, borderRadius: 10, background: 'var(--gradient)', zIndex: -1 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {tab === 'email' ? (
                                /* ── Email Login ── */
                                <>
                                    {/* Google Button */}
                                    <button onClick={handleGoogleLogin} disabled={loading}
                                        style={{
                                            width: '100%', padding: '14px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                                            background: '#fff', color: '#3c4043', border: '1px solid #dadce0',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20,
                                            transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.24)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'}>
                                        {/* Google SVG */}
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        {loading ? 'Connecting...' : 'Continue with Google'}
                                    </button>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                                        <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>or continue with email</span>
                                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                                    </div>

                                    {/* Demo fill */}
                                    <button onClick={() => { setEmail('admin@shopwave.com'); setPassword('admin123'); }}
                                        style={{ width: '100%', padding: '11px', borderRadius: 10, background: 'rgba(108,99,255,0.12)', border: '1px dashed rgba(108,99,255,0.4)', color: 'var(--primary-light)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, marginBottom: 18, transition: 'var(--transition)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                                        ✨ Use Demo Account (admin@shopwave.com)
                                    </button>

                                    <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        {/* Floating label — Email */}
                                        <div className="float-field" style={{ position: 'relative' }}>
                                            <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none', zIndex: 1 }} />
                                            <input type="email" className="input" id="login-email" value={email} onChange={e => setEmail(e.target.value)} placeholder=" " required style={{ paddingLeft: 40 }} />
                                            <label htmlFor="login-email" className="float-label" style={{ left: 40 }}>Email address</label>
                                        </div>
                                        {/* Floating label — Password */}
                                        <div className="float-field" style={{ position: 'relative' }}>
                                            <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none', zIndex: 1 }} />
                                            <input type={show ? 'text' : 'password'} className="input" id="login-pass" value={password} onChange={e => setPassword(e.target.value)} placeholder=" " required style={{ paddingLeft: 40, paddingRight: 40 }} />
                                            <label htmlFor="login-pass" className="float-label" style={{ left: 40 }}>Password</label>
                                            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 50, fontSize: 15, borderRadius: 999 }} disabled={loading}>
                                            {loading ? '⏳ Signing in...' : <><LogIn size={18} /> Sign In</>}
                                        </motion.button>
                                    </form>
                                </>
                            ) : (
                                /* ── Phone OTP ── */
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                        <div style={{ fontSize: 48, marginBottom: 8 }}>📱</div>
                                        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Enter your mobile number to receive a one-time password</p>
                                    </div>

                                    <div style={{ marginBottom: 20 }}>
                                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text2)' }}>Mobile Number</label>
                                        <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface)', transition: 'var(--transition)' }}
                                            onFocus={() => { }} >
                                            <div style={{ padding: '12px 14px', background: 'var(--bg3)', borderRight: '1px solid var(--border)', fontSize: 14, fontWeight: 600, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                                                🇮🇳 +91
                                            </div>
                                            <input
                                                type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                placeholder="98765 43210" maxLength={10}
                                                style={{ flex: 1, padding: '12px 14px', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 16, fontFamily: 'inherit', outline: 'none', letterSpacing: 1 }}
                                            />
                                        </div>
                                        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>📝 Demo: Use any 10-digit number. OTP will be shown on screen.</p>
                                    </div>

                                    <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
                                        onClick={handleSendOtp} disabled={loading || phone.length < 10}>
                                        {loading ? '⏳ Sending...' : <><Phone size={18} /> Send OTP</>}
                                    </button>
                                </div>
                            )}

                            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text2)' }}>
                                Don't have an account?{' '}
                                <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Create one free</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
