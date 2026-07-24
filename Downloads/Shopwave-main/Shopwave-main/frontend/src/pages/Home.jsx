import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Truck, Shield, RefreshCw, Headphones,
    Sparkles, Zap, CheckCircle2, ChevronDown, Star,
    TrendingUp, Award
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5001/api';
const HERO_WORDS = ['Amazing', 'Premium', 'Exclusive', 'Next-Level'];
const MARQUEE_ITEMS = [
    '⚡ Free Delivery Over ₹499', '🔒 Secure Payments', '♻️ 30-Day Returns', '🌟 50,000+ Products',
    '🚀 Same-Day Dispatch', '💎 Premium Quality', '🤝 2M+ Happy Customers', '📦 Easy Tracking',
    '⚡ Free Delivery Over ₹499', '🔒 Secure Payments', '♻️ 30-Day Returns', '🌟 50,000+ Products',
    '🚀 Same-Day Dispatch', '💎 Premium Quality', '🤝 2M+ Happy Customers', '📦 Easy Tracking',
];
const TESTIMONIALS = [
    { name: 'Priya M.', role: 'Designer', quote: 'Shopwave completely changed how I shop online. Fast, beautiful and trustworthy.', rating: 5, avatar: 'PM' },
    { name: 'Rahul K.', role: 'Engineer', quote: 'Received my order next day with perfect packaging. Will never go back to any other platform.', rating: 5, avatar: 'RK' },
    { name: 'Sneha T.', role: 'Entrepreneur', quote: 'The product quality is outstanding and the returns process is genuinely hassle-free.', rating: 5, avatar: 'ST' },
    { name: 'Arjun D.', role: 'Student', quote: "Found a rare book I'd been searching for months. Shopwave truly has everything.", rating: 5, avatar: 'AD' },
];
const WHY_FEATURES = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Same-day dispatch on most orders. Premium express delivery straight to your door.', color: '#ffd166' },
    { icon: Shield, title: 'Safe & Secure', desc: '256-bit encryption, trusted payment gateways, and buyer protection on every order.', color: '#06d6a0' },
    { icon: Award, title: 'Premium Quality', desc: 'Every product curated and quality-checked before it reaches your hands.', color: '#6c63ff' },
];

function useCountUp(target, duration = 1600, shouldStart = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!shouldStart) return;
        let current = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration, shouldStart]);
    return count;
}

function StatCounter({ value, label }) {
    const ref = useRef(null);
    const [started, setStarted] = useState(false);
    const numeric = parseInt(value.replace(/\D/g, ''), 10) || 0;
    const count = useCountUp(numeric, 1600, started);

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const display = value.includes('K') ? `${count >= 1000 ? Math.round(count / 1000) : (count / 1000).toFixed(1)}K+`
        : value.includes('M') ? `${(count / 1000000).toFixed(1)}M+`
            : value.includes('★') ? `${(count / 10).toFixed(1)}★`
                : `${count}+`;

    return (
        <div ref={ref} style={{ minWidth: 100 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em' }}>
                {display}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 3, fontWeight: 500 }}>{label}</div>
        </div>
    );
}

const revealVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const staggerVariants = {
    visible: { transition: { staggerChildren: 0.07 } },
};

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [trending, setTrending] = useState([]);
    const [wordIdx, setWordIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 2700);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const [catsRes, featRes, trendRes] = await Promise.all([
                    axios.get(`${API}/categories`),
                    axios.get(`${API}/products?limit=8`),
                    axios.get(`${API}/products?trending=1&limit=8`),
                ]);
                setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);
                setFeatured(Array.isArray(featRes.data?.products) ? featRes.data.products : []);
                setTrending(Array.isArray(trendRes.data?.products) ? trendRes.data.products : []);
            } catch (err) {
                console.error('Home data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div style={{ background: 'var(--bg)' }}>

            {/* ── Hero ── */}
            <section style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                position: 'relative', overflow: 'hidden', paddingTop: 90,
                background: `
          radial-gradient(ellipse 75% 55% at 8% -5%, rgba(108,99,255,0.32) 0%, transparent 55%),
          radial-gradient(ellipse 55% 45% at 92% 18%, rgba(255,107,107,0.22) 0%, transparent 50%),
          linear-gradient(160deg, rgba(8,8,16,1) 0%, rgba(14,14,24,1) 100%)
        `,
            }}>
                {/* Orbs */}
                <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.22), transparent 70%)', top: '-15%', left: '-10%', filter: 'blur(10px)', pointerEvents: 'none' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.07, 1], opacity: [0.55, 0.9, 0.55] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,107,0.18), transparent 70%)', bottom: '-10%', right: '-8%', filter: 'blur(12px)', pointerEvents: 'none' }}
                />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.88fr', gap: 52, alignItems: 'center' }}>

                        {/* Left */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={revealVariants}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="badge badge-primary"
                                style={{ marginBottom: 22, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px' }}
                            >
                                <span className="glow-dot" style={{ width: 6, height: 6 }} />
                                <Sparkles size={11} /> Premium arrivals · crafted for modern living
                            </motion.div>

                            <h1 style={{
                                fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif',
                                fontSize: 'clamp(38px, 5.6vw, 78px)',
                                fontWeight: 900, lineHeight: 0.96,
                                marginBottom: 24, letterSpacing: '-0.04em',
                            }}>
                                Discover the{' '}<br />
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={HERO_WORDS[wordIdx]}
                                        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                                        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}
                                    >
                                        {HERO_WORDS[wordIdx]}
                                    </motion.span>
                                </AnimatePresence>
                                {' '}way to shop.
                            </h1>

                            <p style={{ fontSize: 'clamp(15px, 1.4vw, 18px)', color: 'var(--text2)', lineHeight: 1.8, marginBottom: 34, maxWidth: 520 }}>
                                Shopwave merges refined essentials, futuristic tech, and elevated design into one beautifully curated experience.
                            </p>

                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                                <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                    <Link to="/products" className="btn btn-primary btn-lg">
                                        Explore collection <ArrowRight size={18} />
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                    <Link to="/products?trending=1" className="btn btn-secondary btn-lg">
                                        <TrendingUp size={16} /> Trending now
                                    </Link>
                                </motion.div>
                            </div>

                            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: '24px 0 0', borderTop: '1px solid var(--border)' }}>
                                {[['50K+', 'Products'], ['2M+', 'Customers'], ['49★', 'Rating']].map(([n, l]) => (
                                    <StatCounter key={l} value={n} label={l} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            style={{ position: 'relative', minHeight: 480 }}
                        >
                            <div style={{ position: 'absolute', inset: '8% 0 0 12%', borderRadius: 40, background: 'linear-gradient(145deg, rgba(108,99,255,0.18), rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', backdropFilter: 'blur(30px)' }} />
                            <motion.div
                                animate={{ y: [0, -12, 0], rotate: [0, -1.2, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ position: 'relative', zIndex: 2, marginTop: 28, marginLeft: 28, padding: 26, borderRadius: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(32px)' }}
                            >
                                <div style={{ padding: 22, borderRadius: 28, background: 'linear-gradient(140deg, rgba(108,99,255,0.24), rgba(255,107,107,0.18))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700 }}>Featured Launch</div>
                                        <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <span className="glow-dot" style={{ width: 5, height: 5 }} /> Live
                                        </div>
                                    </div>
                                    <div style={{ height: 200, borderRadius: 24, background: 'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 55%), linear-gradient(135deg, rgba(6,8,16,0.85), rgba(18,22,34,0.9))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3.5, repeat: Infinity }}>
                                            <div style={{ fontSize: 90, filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.3))' }}>🖥️</div>
                                        </motion.div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                                        {['Ultra-light essentials', 'Limited edition drops'].map(item => (
                                            <div key={item} style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', fontSize: 12, color: 'var(--text2)' }}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating delivery badge */}
                            <motion.div
                                animate={{ y: [0, 10, 0], x: [0, 6, 0] }}
                                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ position: 'absolute', right: 4, bottom: 20, zIndex: 3, padding: '14px 18px', borderRadius: 22, background: 'rgba(8,8,16,0.92)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', width: 220, backdropFilter: 'blur(20px)' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
                                    <CheckCircle2 size={13} style={{ color: 'var(--success)' }} /> Fast dispatch
                                </div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>Free delivery above ₹499</div>
                            </motion.div>

                            {/* Floating new drop badge */}
                            <motion.div
                                animate={{ y: [0, -8, 0], x: [0, 8, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ position: 'absolute', left: 0, top: 26, zIndex: 4, padding: '11px 14px', borderRadius: 18, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 16px 40px rgba(0,0,0,0.28)', backdropFilter: 'blur(20px)' }}
                            >
                                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>New drop</div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 15, marginTop: 3, letterSpacing: '-0.02em' }}>Aurora Set</div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Scroll CTA */}
                    <motion.a
                        href="#features-bar"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        whileHover={{ y: 4 }}
                        style={{ marginTop: 44, display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--text3)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}
                    >
                        <span style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
                            <ChevronDown size={16} />
                        </span>
                        Scroll to explore
                    </motion.a>
                </div>
            </section>

            {/* ── Marquee ── */}
            <div id="features-bar" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', padding: '14px 0', overflow: 'hidden' }}>
                <div className="marquee-outer">
                    <div className="marquee-inner">
                        {MARQUEE_ITEMS.map((item, i) => (
                            <span key={i} style={{ padding: '0 32px', fontSize: 13, fontWeight: 600, color: 'var(--text2)', whiteSpace: 'nowrap', borderRight: '1px solid var(--border)' }}>{item}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Trust bar ── */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                variants={revealVariants}
                style={{ padding: '36px 0' }}
            >
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                        {[
                            [Truck, 'Free Delivery', 'On orders above ₹499'],
                            [Shield, 'Secure Payment', '100% protected'],
                            [RefreshCw, 'Easy Returns', '30-day guarantee'],
                            [Headphones, '24/7 Support', 'Always here for you'],
                        ].map(([Icon, title, sub], i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07, duration: 0.45 }}
                                whileHover={{ y: -3 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', transition: 'var(--transition)' }}
                            >
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(108,99,255,0.14)', border: '1px solid rgba(108,99,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={19} style={{ color: 'var(--primary-light)' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{sub}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── Categories ── */}
            <section className="section" style={{ paddingTop: 20 }}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealVariants} style={{ marginBottom: 36 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <h2 className="section-title">Curated categories</h2>
                                <p className="section-subtitle">A refined collection for every part of your day.</p>
                            </div>
                            <Link to="/products" className="btn btn-secondary btn-sm">All products <ArrowRight size={13} /></Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                        variants={staggerVariants}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 14 }}
                    >
                        {loading
                            ? [...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius)' }} />)
                            : categories.map((cat) => (
                                <motion.div key={cat.id} variants={revealVariants} whileHover={{ y: -7, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                                    <Link
                                        to={`/products?category=${cat.slug}`}
                                        style={{ display: 'block', padding: '26px 16px', borderRadius: 'var(--radius)', textAlign: 'center', background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', border: '1px solid var(--border)', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', transition: 'var(--transition)' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.35)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.28), 0 0 0 1px rgba(108,99,255,0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.18)'; }}
                                    >
                                        <div style={{ fontSize: 38, marginBottom: 10, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>{cat.icon}</div>
                                        <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em' }}>{cat.name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{cat.description}</div>
                                    </Link>
                                </motion.div>
                            ))
                        }
                    </motion.div>
                </div>
            </section>

            {/* ── Featured ── */}
            <section className="section" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealVariants}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, gap: 16, flexWrap: 'wrap' }}>
                        <div>
                            <h2 className="section-title">Featured picks</h2>
                            <p className="section-subtitle">Precision-curated essentials and standout favourites.</p>
                        </div>
                        <Link to="/products" className="btn btn-secondary btn-sm">View all <ArrowRight size={14} /></Link>
                    </motion.div>
                    <div className="products-grid">
                        {loading
                            ? [...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 390, borderRadius: 'var(--radius)' }} />)
                            : featured.map((p, index) => (
                                <motion.div key={p.id}
                                    initial={{ opacity: 0, y: 22 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}>
                                    <ProductCard product={p} />
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* ── Why ShopWave ── */}
            <section className="section">
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealVariants}
                        style={{ textAlign: 'center', marginBottom: 52 }}>
                        <div className="badge badge-primary" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <Sparkles size={11} /> Why ShopWave
                        </div>
                        <h2 className="section-title" style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}>Built for the best experience</h2>
                        <p className="section-subtitle" style={{ maxWidth: 440, margin: '8px auto 0' }}>Every detail engineered for speed, security, and satisfaction.</p>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                        {WHY_FEATURES.map((f, i) => (
                            <motion.div key={f.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ delay: i * 0.1, duration: 0.55 }}
                                whileHover={{ y: -6 }}
                                style={{ padding: '36px 32px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))', border: '1px solid var(--border)', transition: 'var(--transition)', cursor: 'default' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 18, background: `${f.color}22`, border: `1px solid ${f.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    <f.icon size={24} style={{ color: f.color }} />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Promo banner ── */}
            <section style={{ padding: '0 0 100px' }}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealVariants}
                        style={{ borderRadius: 'var(--radius-xl)', padding: 'clamp(36px, 4.5vw, 72px)', background: 'linear-gradient(135deg, rgba(108,99,255,0.3) 0%, rgba(255,107,107,0.2) 100%)', border: '1px solid rgba(255,255,255,0.14)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
                        <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
                        <div style={{ maxWidth: 560, position: 'relative', zIndex: 1 }}>
                            <div className="badge badge-yellow" style={{ marginBottom: 18 }}>🔥 Limited edition drop</div>
                            <h2 style={{ fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif', fontSize: 'clamp(24px, 3.8vw, 46px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.04em', lineHeight: 1.05 }}>Elevated tech for the everyday.</h2>
                            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, marginBottom: 26, lineHeight: 1.7 }}>Get early access to premium gadgets, curated bundles, and exclusive member pricing.</p>
                            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                <Link to="/products?category=electronics" className="btn btn-primary btn-lg" style={{ background: 'rgba(255,255,255,0.95)', color: '#111', boxShadow: '0 12px 32px rgba(0,0,0,0.24)' }}>
                                    <Zap size={18} /> Shop electronics
                                </Link>
                            </motion.div>
                        </div>
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ fontSize: 110, filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.25))', position: 'relative', zIndex: 1 }}>💻</motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Trending ── */}
            <section className="section" style={{ paddingTop: 0, borderTop: '1px solid var(--border)', background: 'linear-gradient(180deg, rgba(255,255,255,0.018), transparent)' }}>
                <div className="container" style={{ paddingTop: 80 }}>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealVariants}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, gap: 16, flexWrap: 'wrap' }}>
                        <div>
                            <h2 className="section-title">Trending now</h2>
                            <p className="section-subtitle">The pieces our customers are loving most right now.</p>
                        </div>
                        <Link to="/products" className="btn btn-secondary btn-sm">Browse all <ArrowRight size={14} /></Link>
                    </motion.div>
                    <div className="products-grid">
                        {loading
                            ? [...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 390, borderRadius: 'var(--radius)' }} />)
                            : trending.map((p, index) => (
                                <motion.div key={p.id}
                                    initial={{ opacity: 0, y: 22 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.5, delay: index * 0.04 }}>
                                    <ProductCard product={p} />
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="section" style={{ background: 'linear-gradient(180deg, rgba(108,99,255,0.06), rgba(255,107,107,0.03))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealVariants}
                        style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="badge badge-yellow" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <Star size={11} fill="currentColor" /> Loved by millions
                        </div>
                        <h2 className="section-title" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>What our customers say</h2>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={t.name}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ delay: i * 0.08, duration: 0.55 }}
                                whileHover={{ y: -5 }}
                                style={{ padding: '28px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                                    {[...Array(t.rating)].map((_, s) => <Star key={s} size={14} fill="#ffd166" color="#ffd166" />)}
                                </div>
                                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
