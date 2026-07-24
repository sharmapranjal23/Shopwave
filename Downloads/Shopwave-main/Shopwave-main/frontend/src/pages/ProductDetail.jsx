import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingCart, Heart, Truck, Shield, Plus, Minus, Share2, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useCart, useWishlist, useAuth } from '../contexts';
import { Stars } from '../components/ProductCard';
import toast from 'react-hot-toast';
import LoadingState from '../components/LoadingState';

const API = 'http://localhost:5001/api';

const PALETTES = [
    ['#6c63ff', '#ff6b6b'], ['#06d6a0', '#0099cc'], ['#ffd166', '#ff6b6b'],
    ['#8b5cf6', '#06d6a0'], ['#f59e0b', '#ef4444'], ['#3b82f6', '#8b5cf6'],
];

function getCategoryEmoji(name = '') {
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
    if (name.includes('Book') || name.includes('Habits') || name.includes('Work') || name.includes('Atomic') || name.includes('Deep')) return '📚';
    return '🛍️';
}

// ── Product Image Gallery ──────────────────────────────────────────────
function ProductGallery({ images, product, pair }) {
    const [active, setActive] = useState(0);
    const [imgError, setImgError] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const mainImg = images[active];
    const hasImage = mainImg && !imgError[active];

    const prev = () => setActive(a => (a - 1 + images.length) % images.length);
    const next = () => setActive(a => (a + 1) % images.length);

    useEffect(() => { setLoaded(false); }, [active]);

    return (
        <div>
            <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{
                borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative',
                border: '1px solid var(--border)', background: `linear-gradient(135deg, ${pair[0]}22, ${pair[1]}22)`,
                height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.28)',
            }}>
                {product.badge && (
                    <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, background: 'var(--gradient)', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{product.badge}</div>
                )}

                {hasImage ? (
                    <>
                        {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
                        <motion.img
                            src={mainImg} alt={product.name}
                            onLoad={() => setLoaded(true)}
                            onError={() => { setImgError(e => ({ ...e, [active]: true })); }}
                            animate={prefersReducedMotion ? undefined : { scale: zoomed ? 1.08 : 1 }}
                            transition={{ duration: 0.35 }}
                            onMouseEnter={() => setZoomed(true)}
                            onMouseLeave={() => setZoomed(false)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease', cursor: 'zoom-in' }}
                        />
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 100, animation: 'float 4s ease-in-out infinite' }}>{getCategoryEmoji(product.name)}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: pair[0], marginTop: 12 }}>{product.name.split(' ').slice(0, 3).join(' ')}</div>
                    </div>
                )}

                {images.length > 1 && (
                    <>
                        <button onClick={prev} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(10,10,15,0.72)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', zIndex: 2 }}>
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={next} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(10,10,15,0.72)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', zIndex: 2 }}>
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
            </motion.div>

            {images.length > 1 && (
                <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 6 }}>
                    {images.map((img, i) => (
                        <motion.button key={i} whileHover={{ y: -2, scale: 1.02 }} onClick={() => setActive(i)}
                            style={{ minWidth: 74, width: 74, height: 74, borderRadius: 12, overflow: 'hidden', border: `2px solid ${i === active ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', transition: 'border-color 0.2s', padding: 0, background: '#111', flexShrink: 0 }}>
                            <img src={img} alt={`view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductDetail() {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [addingReview, setAddingReview] = useState(false);
    const [related, setRelated] = useState([]);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        setLoading(true);
        let currentProduct = null;
        axios.get(`${API}/products/${slug}`).then(r => {
            currentProduct = r.data;
            setProduct(currentProduct);
            return axios.get(`${API}/products?limit=8`);
        }).then(r => {
            setRelated(r.data.products?.filter(p => p.id !== currentProduct?.id) || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [slug]);

    const handleAddToCart = () => addToCart(product.id, qty);

    const handleReview = async () => {
        if (!user) { toast.error('Please login to write a review'); return; }
        setAddingReview(true);
        try {
            await axios.post(`${API}/reviews`, { product_id: product.id, rating: reviewRating, comment: reviewText }, { headers: { Authorization: `Bearer ${localStorage.getItem('sw_token')}` } });
            toast.success('Review submitted!');
            setReviewText('');
            const r = await axios.get(`${API}/products/${slug}`);
            setProduct(r.data);
        } catch { toast.error('Failed to submit review'); }
        setAddingReview(false);
    };

    if (loading) return <div style={{ paddingTop: 100, minHeight: '100vh' }}><div className="container"><LoadingState variant="detail" /></div></div>;

    if (!product) return (
        <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 64 }}>😕</div>
            <h2 style={{ marginBottom: 16 }}>Product not found</h2>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
    );

    const pair = PALETTES[Math.abs(product.name.charCodeAt(0) + product.name.charCodeAt(1)) % PALETTES.length];
    const discount = product.original_price > product.price ? Math.round((1 - product.price / product.original_price) * 100) : 0;
    const wishlisted = isWishlisted(product.id);
    const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');

    return (
        <div style={{ paddingTop: 90, minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 40 }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: 'var(--text3)' }}>
                    <Link to="/" style={{ color: 'var(--text3)' }}>Home</Link>
                    <span>/</span>
                    <Link to="/products" style={{ color: 'var(--text3)' }}>Products</Link>
                    {product.category_name && <><span>/</span><Link to={`/products?category=${product.category_slug}`} style={{ color: 'var(--text3)' }}>{product.category_name}</Link></>}
                    <span>/</span>
                    <span style={{ color: 'var(--text)' }}>{product.name}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 60, marginBottom: 80, alignItems: 'start' }}>
                    <ProductGallery images={images} product={product} pair={pair} />

                    <motion.div initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }} animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                            {product.category_name && <span className="badge badge-primary">{product.category_name}</span>}
                            {product.badge && <span className="badge badge-accent">{product.badge}</span>}
                            {discount > 0 && <span className="badge badge-success">{discount}% OFF</span>}
                        </div>

                        <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <Stars rating={product.rating} size={18} />
                            <span style={{ fontSize: 16, fontWeight: 600 }}>{product.rating}</span>
                            <span style={{ color: 'var(--text3)', fontSize: 14 }}>({product.reviews_count?.toLocaleString()} reviews)</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
                            <span style={{ fontFamily: 'Outfit', fontSize: 40, fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{product.price.toLocaleString()}</span>
                            {product.original_price > product.price && <span style={{ textDecoration: 'line-through', color: 'var(--text3)', fontSize: 18 }}>₹{product.original_price.toLocaleString()}</span>}
                            {discount > 0 && <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: 15 }}>Save ₹{(product.original_price - product.price).toLocaleString()}</span>}
                        </div>

                        <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>{product.description}</p>

                        {/* Qty */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>Quantity:</span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text)' }}>
                                    <Minus size={16} />
                                </button>
                                <span style={{ padding: '0 20px', fontWeight: 700, fontSize: 16 }}>{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text)' }}>
                                    <Plus size={16} />
                                </button>
                            </div>
                            <span style={{ fontSize: 13, color: 'var(--success)' }}>✓ In Stock ({product.stock})</span>
                        </div>

                        {/* CTA */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAddToCart}>
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button onClick={() => toggleWishlist(product.id)} className="btn btn-lg"
                                style={{ background: wishlisted ? 'rgba(255,107,107,0.2)' : 'var(--surface2)', color: wishlisted ? 'var(--accent)' : 'var(--text)', border: `1px solid ${wishlisted ? 'rgba(255,107,107,0.4)' : 'var(--border)'}` }}>
                                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                                <Share2 size={18} />
                            </button>
                        </div>

                        <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ position: 'sticky', top: 96, padding: '20px', borderRadius: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 24px 60px rgba(0,0,0,0.24)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--text2)', fontSize: 13 }}><Sparkles size={14} style={{ color: 'var(--accent2)' }} /> Premium protection included</div>
                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                                {[[Truck, 'Free Delivery', 'var(--success)'], [Shield, 'Secure Payment', '#3b82f6']].map(([Icon, label, color], i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text2)' }}>
                                        <Icon size={15} style={{ color }} /> {label}
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text3)' }}>✓ 30-day return • ✓ Free shipping over ₹799 • ✓ Warranty support</div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '30px 32px', marginBottom: 80 }}>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Specifications</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                        {[
                            ['Material', 'Premium alloy & glass'],
                            ['Performance', 'Fast, silent, efficient'],
                            ['Design', 'Minimal and modern'],
                            ['Warranty', '2-year manufacturer support'],
                        ].map(([label, value], index) => (
                            <motion.div key={label} initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.06 }} style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>{value}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }} style={{ marginBottom: 80 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700 }}>Related products</h2>
                        <Link to="/products" className="btn btn-secondary btn-sm">Browse all <ArrowRight size={14} /></Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                        {related.slice(0, 4).map((item, index) => (
                            <motion.div key={item.id} initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -6, scale: 1.01 }}>
                                <Link to={`/product/${item.slug}`} style={{ display: 'block', padding: 14, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ height: 140, borderRadius: 16, background: 'linear-gradient(135deg, rgba(108,99,255,0.16), rgba(255,107,107,0.16))', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>{getCategoryEmoji(item.name)}</div>
                                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.name}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text3)' }}>₹{item.price.toLocaleString()}</div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '40px', marginBottom: 80 }}>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>Customer Reviews</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40 }}>
                        <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ fontFamily: 'Outfit', fontSize: 60, fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{product.rating}</div>
                            <Stars rating={product.rating} size={20} />
                            <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 8 }}>{product.reviews_count?.toLocaleString()} reviews</p>
                        </div>
                        <div>
                            {product.reviews?.length === 0 ? (
                                <p style={{ color: 'var(--text3)', fontStyle: 'italic' }}>No reviews yet. Be the first!</p>
                            ) : product.reviews?.map((r, index) => (
                                <motion.div key={r.id} initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.05 }} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff' }}>{r.user_name?.[0]}</div>
                                            <span style={{ fontWeight: 600, fontSize: 14 }}>{r.user_name}</span>
                                        </div>
                                        <Stars rating={r.rating} />
                                    </div>
                                    <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
                                    <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{new Date(r.created_at).toLocaleDateString()}</p>
                                </motion.div>
                            ))}

                            <div style={{ marginTop: 24 }}>
                                <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Write a Review</h4>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button key={n} onClick={() => setReviewRating(n)} style={{ fontSize: 24, background: 'none', color: n <= reviewRating ? '#ffd166' : 'var(--text3)', transition: 'color 0.2s', cursor: 'pointer' }}>★</button>
                                    ))}
                                </div>
                                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={3} className="input" style={{ resize: 'vertical', marginBottom: 12 }} />
                                <button className="btn btn-primary" onClick={handleReview} disabled={addingReview || !reviewText.trim()}>
                                    {addingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
