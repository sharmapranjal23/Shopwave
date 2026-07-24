import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, Package, ChevronDown, Zap, ShieldCheck } from 'lucide-react';
import { useAuth, useCart, useWishlist } from '../contexts';

const API = 'http://localhost:5001/api';

const NAV_LINKS = [
    ['Home', '/'],
    ['Electronics', '/products?category=electronics'],
    ['Fashion', '/products?category=fashion'],
    ['Deals', '/products?sort=rating'],
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const { count } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchFocus, setSearchFocus] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 28);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setUserOpen(false);
    }, [location]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const r = await axios.get(`${API}/search/suggestions?q=${searchQuery}`);
                    setSuggestions(r.data);
                } catch { setSuggestions([]); }
            } else setSuggestions([]);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSuggestions([]);
        }
    };

    const isActive = (href) => {
        if (href === '/') return location.pathname === '/';
        return location.pathname + location.search === href || location.pathname === href.split('?')[0];
    };

    return (
        <nav style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 900, padding: scrolled ? '8px 0' : '10px 0', transition: 'padding 0.3s ease' }}>
            <div style={{
                width: 'min(1300px, calc(100% - 24px))', margin: '0 auto',
                height: scrolled ? 60 : 72,
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '0 18px', borderRadius: 999,
                background: scrolled ? 'rgba(8,8,16,0.82)' : 'rgba(8,8,16,0.62)',
                border: `1px solid ${scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: scrolled ? '0 24px 56px rgba(0,0,0,0.36), 0 0 0 1px rgba(108,99,255,0.08)' : '0 8px 32px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            }}>

                {/* Logo */}
                <motion.div whileHover={{ scale: 1.02, y: -1 }} transition={{ type: 'spring', stiffness: 280, damping: 18 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
                        <div style={{ width: scrolled ? 32 : 36, height: scrolled ? 32 : 36, borderRadius: 12, background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: 'var(--shadow-glow-sm)' }}>
                            <Zap size={17} fill="#fff" color="#fff" />
                        </div>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif', fontWeight: 900, fontSize: 19, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>ShopWave</span>
                    </Link>
                </motion.div>

                {/* Desktop nav links */}
                <div style={{ display: 'flex', gap: 2, alignItems: 'center', marginLeft: 8 }}>
                    {NAV_LINKS.map(([label, href]) => {
                        const active = isActive(href);
                        return (
                            <motion.div key={label} whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
                                <Link
                                    to={href}
                                    className={`nav-link${active ? ' active' : ''}`}
                                    style={{ fontSize: 14, fontWeight: active ? 700 : 600, color: active ? '#fff' : 'var(--text2)', padding: '8px 12px', borderRadius: 999, transition: 'all 0.22s ease', display: 'block', position: 'relative' }}
                                >
                                    {label}
                                    {active && (
                                        <motion.div
                                            layoutId="nav-active"
                                            style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(108,99,255,0.12)', zIndex: -1 }}
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Search */}
                <div style={{ flex: 1, position: 'relative', maxWidth: 400, marginLeft: 'auto' }} ref={searchRef}>
                    <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                        <input
                            className="input"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocus(true)}
                            onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
                            placeholder="Search products..."
                            style={{ paddingLeft: 38, height: 40, fontSize: 13, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999 }}
                        />
                    </form>
                    <AnimatePresence>
                        {searchFocus && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                transition={{ duration: 0.18 }}
                                style={{ position: 'absolute', top: '115%', left: 0, right: 0, background: 'rgba(10,10,18,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.32)' }}
                            >
                                {suggestions.map((s, i) => (
                                    <motion.div
                                        key={s.slug}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => { navigate(`/product/${s.slug}`); setSearchQuery(''); setSuggestions([]); }}
                                        style={{ padding: '12px 16px', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = ''}
                                    >
                                        <Search size={13} style={{ color: 'var(--text3)', flexShrink: 0 }} />
                                        {s.name}
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action icons */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 8 }}>
                    <motion.div whileHover={{ scale: 1.08, y: -1 }} whileTap={{ scale: 0.93 }}>
                        <Link to="/wishlist" style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', transition: 'all 0.22s ease', color: 'var(--text2)' }} className="icon-btn">
                            <Heart size={17} className={wishlist.length > 0 ? 'heartbeat' : ''} style={{ color: wishlist.length > 0 ? 'var(--accent)' : 'currentColor' }} />
                            {wishlist.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                    style={{ position: 'absolute', top: 1, right: 1, minWidth: 16, height: 16, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}
                                >
                                    {wishlist.length}
                                </motion.span>
                            )}
                        </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.08, y: -1 }} whileTap={{ scale: 0.93 }}>
                        <Link to="/cart" style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: count > 0 ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${count > 0 ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.09)'}`, transition: 'all 0.22s ease' }} className="icon-btn">
                            <ShoppingCart size={17} style={{ color: count > 0 ? 'var(--primary-light)' : 'var(--text2)' }} />
                            {count > 0 && (
                                <motion.span
                                    key={count}
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                    style={{ position: 'absolute', top: 1, right: 1, minWidth: 16, height: 16, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}
                                >
                                    {count}
                                </motion.span>
                            )}
                        </Link>
                    </motion.div>

                    {user ? (
                        <div style={{ position: 'relative' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setUserOpen(!userOpen)}
                                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px 6px 6px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: `1px solid ${userOpen ? 'rgba(108,99,255,0.35)' : 'rgba(255,255,255,0.09)'}`, color: 'var(--text)', transition: 'all 0.22s ease' }}
                            >
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', boxShadow: 'var(--shadow-glow-sm)' }}>
                                    {user.name[0].toUpperCase()}
                                </div>
                                <motion.div animate={{ rotate: userOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown size={13} />
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {userOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: 'rgba(10,10,18,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, width: 230, boxShadow: '0 24px 60px rgba(0,0,0,0.36)', overflow: 'hidden', backdropFilter: 'blur(24px)' }}
                                    >
                                        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                            <div style={{ fontWeight: 800, fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{user.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{user.email}</div>
                                        </div>
                                        {[
                                            ['Orders', '/orders', <Package size={14} />],
                                            ['Wishlist', '/wishlist', <Heart size={14} />],
                                            ['Profile', '/profile', <User size={14} />],
                                            ...(user.role === 'admin' ? [['Admin', '/admin', <ShieldCheck size={14} />]] : []),
                                        ].map(([label, href, icon]) => (
                                            <Link
                                                key={label}
                                                to={href}
                                                style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 18px', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text2)', transition: 'all 0.18s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text2)'; }}
                                            >
                                                <span style={{ color: 'var(--primary-light)' }}>{icon}</span>
                                                {label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={logout}
                                            style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 18px', fontSize: 14, width: '100%', background: 'none', color: 'var(--accent)', fontFamily: 'inherit', transition: 'background 0.18s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = ''}
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
                        </motion.div>
                    )}
                </div>

                {/* Mobile menu button */}
                <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ display: 'none', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}
                    className="mobile-menu-btn"
                >
                    <AnimatePresence mode="wait">
                        {menuOpen
                            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={17} /></motion.div>
                            : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={17} /></motion.div>
                        }
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile menu drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: 'min(1300px, calc(100% - 24px))', margin: '10px auto 0', borderRadius: 24, background: 'rgba(8,8,16,0.96)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 60px rgba(0,0,0,0.36)', backdropFilter: 'blur(28px)', overflow: 'hidden' }}
                    >
                        {/* Mobile search */}
                        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                                <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                                <input className="input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." style={{ paddingLeft: 38, height: 42, fontSize: 14 }} />
                            </form>
                        </div>
                        <div style={{ padding: '10px 14px 14px', display: 'grid', gap: 8 }}>
                            {[...NAV_LINKS, ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([label, href], i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.22 }}
                                >
                                    <Link
                                        to={href}
                                        onClick={() => setMenuOpen(false)}
                                        style={{ padding: '13px 16px', borderRadius: 14, background: isActive(href) ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive(href) ? 'rgba(108,99,255,0.28)' : 'rgba(255,255,255,0.06)'}`, fontWeight: 600, fontSize: 15, display: 'block', color: isActive(href) ? 'var(--primary-light)' : 'var(--text)' }}
                                    >
                                        {label}
                                    </Link>
                                </motion.div>
                            ))}
                            {!user && (
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
