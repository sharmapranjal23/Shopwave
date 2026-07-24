import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Zap, Eye } from 'lucide-react';
import { useCart, useWishlist } from '../contexts';

// Gradient fallback palette
const PALETTES = [
    ['#6c63ff', '#ff6b6b'], ['#06d6a0', '#0099cc'], ['#ffd166', '#ff6b6b'],
    ['#8b5cf6', '#06d6a0'], ['#f59e0b', '#ef4444'], ['#3b82f6', '#8b5cf6'],
];

export function ProductImage({ product, height = 240 }) {
    const [imgError, setImgError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
    const imgUrl = images[0];
    const pair = PALETTES[Math.abs((product.name || '').charCodeAt(0) % PALETTES.length)];

    if (imgUrl && !imgError) {
        return (
            <div style={{ height, position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${pair[0]}33, ${pair[1]}33)` }}>
                {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
                <img
                    src={imgUrl}
                    alt={product.name}
                    onLoad={() => setLoaded(true)}
                    onError={() => setImgError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.65s cubic-bezier(.2,.8,.2,1), opacity 0.35s ease', opacity: loaded ? 1 : 0 }}
                    className="product-img"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.16) 45%, transparent 100%)', transform: 'translateX(-120%)', transition: 'transform 0.85s ease' }} className="product-shine" />
            </div>
        );
    }

    const emoji = getEmoji(product.name);
    return (
        <div style={{ height, background: `linear-gradient(135deg, ${pair[0]}22, ${pair[1]}22)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 8, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))' }}>{emoji}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: pair[0], opacity: 0.85, textAlign: 'center', padding: '0 12px' }}>
                {product.name?.split(' ').slice(0, 3).join(' ')}
            </div>
        </div>
    );
}

function getEmoji(name = '') {
    if (name.includes('Laptop') || name.includes('ProBook')) return '💻';
    if (name.includes('Bud') || name.includes('Audio') || name.includes('Quantum')) return '🎧';
    if (name.includes('Watch')) return '⌚';
    if (name.includes('Monitor')) return '🖥️';
    if (name.includes('Kurta')) return '👗';
    if (name.includes('Sneaker') || name.includes('Shoe')) return '👟';
    if (name.includes('Bag')) return '👜';
    if (name.includes('LED') || name.includes('Strip')) return '💡';
    if (name.includes('Yoga') || name.includes('Mat')) return '🧘';
    if (name.includes('Bottle')) return '💧';
    if (name.includes('Serum') || name.includes('Glow')) return '✨';
    if (name.includes('Perfume')) return '🌸';
    if (name.includes('Book') || name.includes('Habits') || name.includes('Atomic') || name.includes('Deep')) return '📚';
    return '🛍️';
}

export function Stars({ rating, size = 14 }) {
    return (
        <div className="stars" style={{ fontSize: size, display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ color: n <= Math.floor(rating) ? '#ffd166' : n - 0.5 <= rating ? '#ffd166' : 'var(--text3)', opacity: n - 0.5 <= rating && n > Math.floor(rating) ? 0.6 : 1 }}>★</span>
            ))}
        </div>
    );
}

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const [imgIdx, setImgIdx] = useState(0);
    const [hovered, setHovered] = useState(false);
    const wishlisted = isWishlisted(product.id);
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
    const discount = product.original_price > product.price
        ? Math.round((1 - product.price / product.original_price) * 100) : 0;

    // Magnetic hover effect
    const cardRef = useRef(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rotX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 20 });
    const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mx.set((e.clientX - rect.left - rect.width / 2) / rect.width);
        my.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    };

    const handleMouseLeave = () => {
        mx.set(0);
        my.set(0);
        setHovered(false);
        setImgIdx(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => { setHovered(true); if (images.length > 1) setImgIdx(1); }}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 800, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg3)', boxShadow: 'var(--shadow-card)', transition: 'border-color 0.3s ease, box-shadow 0.3s ease', position: 'relative' }}
            whileHover={{ boxShadow: 'var(--shadow-card-hover)', borderColor: 'rgba(108,99,255,0.28)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
            <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
                {/* Image area */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    {images[imgIdx] ? (
                        <div style={{ height: 238, overflow: 'hidden', background: '#111', position: 'relative' }}>
                            <AnimatePresence mode="sync">
                                <motion.img
                                    key={imgIdx}
                                    src={images[imgIdx]}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: hovered ? 1.07 : 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.45, ease: 'easeOut' }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            </AnimatePresence>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.22) 100%)' }} />
                        </div>
                    ) : (
                        <ProductImage product={product} height={238} />
                    )}

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2 }}>
                        {product.badge && (
                            <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ background: 'var(--gradient)', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, display: 'inline-block', boxShadow: '0 6px 16px rgba(108,99,255,0.3)' }}
                            >
                                {product.badge}
                            </motion.span>
                        )}
                        {discount > 0 && (
                            <span style={{ background: 'rgba(6,214,160,0.92)', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, display: 'inline-block' }}>{discount}% OFF</span>
                        )}
                    </div>

                    {/* Wishlist button */}
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                        style={{
                            position: 'absolute', top: 12, right: 12, zIndex: 2,
                            width: 38, height: 38, borderRadius: '50%',
                            background: wishlisted ? 'rgba(255,107,107,0.95)' : 'rgba(8,8,16,0.7)',
                            border: `1px solid ${wishlisted ? 'transparent' : 'rgba(255,255,255,0.22)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: wishlisted ? '#fff' : 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: wishlisted ? '0 8px 20px rgba(255,107,107,0.4)' : '0 8px 20px rgba(0,0,0,0.28)',
                            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    >
                        <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'heartbeat' : ''} />
                    </motion.button>

                    {/* Quick-action overlay — slides up on hover */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 20 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 14px', display: 'flex', gap: 7, pointerEvents: hovered ? 'auto' : 'none', zIndex: 3 }}
                    >
                        <div
                            onClick={e => { e.preventDefault(); e.stopPropagation(); addToCart(product.id); }}
                            style={{ flex: 1, height: 38, borderRadius: 999, background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 8px 20px rgba(108,99,255,0.4)', backdropFilter: 'blur(10px)' }}
                        >
                            <ShoppingCart size={14} /> Add to Cart
                        </div>
                        <div
                            style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                        >
                            <Eye size={14} />
                        </div>
                    </motion.div>

                    {/* Image dots */}
                    {images.length > 1 && (
                        <div style={{ position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 2 }}>
                            {images.map((_, i) => (
                                <div key={i} style={{ width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease' }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ padding: '14px 16px 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                        <Stars rating={product.rating} />
                        <span style={{ fontSize: 12, color: 'var(--text3)' }}>({(product.reviews_count || 0).toLocaleString()})</span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45, marginBottom: 8, color: 'var(--text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', letterSpacing: '-0.01em' }}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 19, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em' }}>₹{product.price.toLocaleString()}</span>
                        {product.original_price > product.price && (
                            <span style={{ textDecoration: 'line-through', color: 'var(--text3)', fontSize: 13 }}>₹{product.original_price.toLocaleString()}</span>
                        )}
                        {discount > 0 && <span className="price-discount">{discount}% off</span>}
                    </div>
                </div>
            </Link>

            {/* Add to cart */}
            <div style={{ padding: '10px 16px 16px' }}>
                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', height: 43, borderRadius: 999, fontSize: 13 }}
                    onClick={() => addToCart(product.id)}
                >
                    <ShoppingCart size={14} /> Add to Cart
                </motion.button>
            </div>
        </motion.div>
    );
}
