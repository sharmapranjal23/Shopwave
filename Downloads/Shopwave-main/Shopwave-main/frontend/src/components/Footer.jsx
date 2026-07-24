import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

// Inline social SVG icons (lucide-react doesn't export branded icons)
const IconTwitterX = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const IconInstagram = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);
const IconGithub = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
);
const IconLinkedin = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);

const SOCIAL_LINKS = [
    { Icon: IconTwitterX, href: '#', label: 'X / Twitter', color: '#e7e9ea' },
    { Icon: IconInstagram, href: '#', label: 'Instagram', color: '#e1306c' },
    { Icon: IconGithub, href: '#', label: 'GitHub', color: '#c9d1d9' },
    { Icon: IconLinkedin, href: '#', label: 'LinkedIn', color: '#0a66c2' },
];


const FOOTER_LINKS = [
    { title: 'Shop', links: [['Electronics', '/products?category=electronics'], ['Fashion', '/products?category=fashion'], ['Home & Living', '/products?category=home-living'], ['Sports', '/products?category=sports'], ['Beauty', '/products?category=beauty'], ['Books', '/products?category=books']] },
    { title: 'Account', links: [['My Profile', '/profile'], ['Orders', '/orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart'], ['Login', '/login'], ['Register', '/register']] },
    { title: 'Support', links: [['FAQ', '#'], ['Shipping Info', '#'], ['Returns', '#'], ['Track Order', '#'], ['Contact Us', '#']] },
];

const PAYMENT_ICONS = ['🅥', '🅜', '💳', '📱', '🔒'];

export default function Footer() {
    const year = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) { setSubscribed(true); setEmail(''); }
    };

    return (
        <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', marginTop: 80 }}>

            {/* Newsletter Section */}
            <div style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(255,107,107,0.05))' }}>
                <div className="container" style={{ padding: '56px 28px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}
                    >
                        <div style={{ maxWidth: 460 }}>
                            <div className="badge badge-primary" style={{ marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <Mail size={11} /> Newsletter
                            </div>
                            <h3 style={{ fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif', fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 900, marginBottom: 10, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                                Get early access to premium drops.
                            </h3>
                            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>
                                Exclusive deals, new arrivals, and insider pricing — straight to your inbox.
                            </p>
                        </div>
                        <div style={{ flex: 1, minWidth: 280, maxWidth: 420 }}>
                            {subscribed ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderRadius: 'var(--radius)', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.25)', color: 'var(--success)', fontWeight: 700 }}
                                >
                                    ✓ You're on the list! Check your inbox soon.
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10 }}>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                                        <input
                                            className="input"
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Your email address"
                                            required
                                            style={{ paddingLeft: 40, height: 48, fontSize: 14, borderRadius: 'var(--radius-sm)' }}
                                        />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="btn btn-primary"
                                        style={{ height: 48, borderRadius: 'var(--radius-sm)', flexShrink: 0, padding: '0 20px' }}
                                    >
                                        <ArrowRight size={16} />
                                        <span style={{ display: 'none' }}>Subscribe</span>
                                    </motion.button>
                                </form>
                            )}
                            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 10 }}>No spam. Unsubscribe anytime. We respect your privacy.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main footer grid */}
            <div className="container" style={{ padding: '64px 28px 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>

                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.55 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow-sm)' }}>
                                <Zap size={20} fill="#fff" color="#fff" />
                            </div>
                            <span style={{ fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif', fontWeight: 900, fontSize: 21, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>ShopWave</span>
                        </div>
                        <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.8, marginBottom: 22 }}>
                            Your premium destination for top-quality products. Shop with confidence, delivered with care.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {SOCIAL_LINKS.map(({ Icon, href, label, color }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    title={label}
                                    whileHover={{ y: -4, scale: 1.12 }}
                                    whileTap={{ scale: 0.92 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                    style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', transition: 'color 0.2s, border-color 0.2s, background 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = color + '66'; e.currentTarget.style.color = color; e.currentTarget.style.background = color + '18'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--surface)'; }}
                                >
                                    <Icon size={15} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Link columns */}
                    {FOOTER_LINKS.map(({ title, links }, ci) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: (ci + 1) * 0.07, duration: 0.55 }}
                        >
                            <h4 style={{ fontWeight: 800, fontSize: 14, marginBottom: 18, color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>{title}</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                                {links.map(([label, href]) => (
                                    <li key={label}>
                                        <Link
                                            to={href}
                                            style={{ color: 'var(--text3)', fontSize: 14, transition: 'color 0.18s, padding-left 0.18s', display: 'inline-block' }}
                                            onMouseEnter={e => { e.target.style.color = 'var(--primary-light)'; e.target.style.paddingLeft = '4px'; }}
                                            onMouseLeave={e => { e.target.style.color = 'var(--text3)'; e.target.style.paddingLeft = '0px'; }}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.28, duration: 0.55 }}
                    >
                        <h4 style={{ fontWeight: 800, fontSize: 14, marginBottom: 18, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Contact</h4>
                        {[
                            [MapPin, '123 Market St, Mumbai 400001'],
                            [Phone, '+91 98765 43210'],
                            [Mail, 'support@shopwave.in'],
                        ].map(([Icon, text]) => (
                            <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                    <Icon size={14} style={{ color: 'var(--primary-light)' }} />
                                </div>
                                <span style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Trust bar */}
                <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '20px 0', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
                    <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>Secure payments via</span>
                    {['Visa', 'Mastercard', 'UPI', 'Razorpay', 'Net Banking'].map(p => (
                        <span key={p} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text2)', fontWeight: 600 }}>{p}</span>
                    ))}
                    <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 4 }}>🔒 256-bit SSL</span>
                </div>

                {/* Bottom bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ color: 'var(--text3)', fontSize: 13 }}>© {year} ShopWave. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                            <a key={l} href="#" style={{ color: 'var(--text3)', fontSize: 13, transition: 'color 0.18s' }}
                                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text3)'}
                            >{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
