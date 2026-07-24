import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Truck, ShieldCheck, Clock3, CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts';
import LoadingState from '../components/LoadingState';
import StatePanel from '../components/StatePanel';

export default function Cart() {
    const { cart, loading, updateQty, removeFromCart, clearCart, total, count } = useCart();
    const [coupon, setCoupon] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponMessage, setCouponMessage] = useState('');
    const prefersReducedMotion = useReducedMotion();

    if (loading) return <LoadingState variant="cart" title="Loading your cart" subtitle="Preparing your selected items" />;

    if (cart.length === 0) return (
        <div style={{ paddingTop: 120, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 20 }}>
            <StatePanel
                title="Your cart feels light"
                description="Curate a few premium picks and we’ll wrap them with fast delivery and smooth checkout."
                icon={<ShoppingBag size={30} />}
                actionLabel="Start Shopping"
                actionHref="/products"
                tone="default"
            />
        </div>
    );

    const delivery = total >= 499 ? 0 : 49;
    const discount = couponApplied ? Math.min(total * 0.1, 199) : 0;
    const discountedSubtotal = Math.max(total - discount, 0);
    const finalTotal = discountedSubtotal + delivery;

    const handleApplyCoupon = () => {
        const code = coupon.trim().toUpperCase();
        if (code === 'WELCOME10') {
            setCouponApplied(true);
            setCouponMessage('Coupon applied successfully');
        } else {
            setCouponApplied(false);
            setCouponMessage('Coupon not found');
        }
    };

    return (
        <div style={{ paddingTop: 90, minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 700 }}>Shopping Cart</h1>
                        <p style={{ color: 'var(--text2)', marginTop: 6 }}>Your curated picks are ready for checkout.</p>
                    </div>
                    <motion.span key={count} initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }} animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }} transition={{ duration: 0.25 }} className="badge badge-yellow" style={{ padding: '8px 12px' }}>
                        {count} item{count !== 1 ? 's' : ''}
                    </motion.span>
                </div>

                <div className="cart-shell">
                    <div>
                        {cart.map(item => (
                            <motion.div key={item.id} layout initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card cart-item-card">
                                <Link to={`/product/${item.slug}`} style={{ flexShrink: 0 }}>
                                    <div className="cart-item-image">🛍️</div>
                                </Link>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Link to={`/product/${item.slug}`}>
                                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                    </Link>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--primary-light)' }}>₹{item.price.toLocaleString()}</span>
                                        {item.original_price > item.price && <span style={{ textDecoration: 'line-through', color: 'var(--text3)', fontSize: 13 }}>₹{item.original_price.toLocaleString()}</span>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                    <div className="quantity-pill">
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateQty(item.id, item.quantity - 1)}>
                                            <Minus size={14} />
                                        </motion.button>
                                        <motion.span key={`${item.id}-${item.quantity}`} initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }} animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>{item.quantity}</motion.span>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateQty(item.id, item.quantity + 1)}>
                                            <Plus size={14} />
                                        </motion.button>
                                    </div>
                                    <motion.span key={`${item.id}-${item.price * item.quantity}`} initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.24 }} style={{ fontWeight: 800, minWidth: 90, textAlign: 'right' }}>
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </motion.span>
                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => removeFromCart(item.id)} className="btn btn-danger btn-icon" style={{ width: 38, height: 38 }}>
                                        <Trash2 size={15} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                        <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={clearCart} className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)', marginTop: 8 }}>
                            <Trash2 size={15} /> Clear Cart
                        </motion.button>
                    </div>

                    <div>
                        <motion.div initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }} animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="card" style={{ padding: 28, position: 'sticky', top: 90, background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700 }}>Order Summary</h3>
                                <span className="badge badge-primary">Fast lane</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)' }}>
                                    <span>Subtotal ({count} items)</span>
                                    <motion.span key={total} initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>₹{total.toLocaleString()}</motion.span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)' }}>
                                    <span>Delivery</span>
                                    <span style={{ color: delivery === 0 ? 'var(--success)' : 'var(--text)' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                                </div>
                                {couponApplied && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--success)' }}>
                                        <span>Coupon discount</span>
                                        <motion.span initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>−₹{discount.toLocaleString()}</motion.span>
                                    </div>
                                )}
                                {delivery > 0 && <p style={{ fontSize: 12, color: 'var(--text3)' }}>Add ₹{(499 - total).toLocaleString()} more for free delivery</p>}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
                                    <span>Total</span>
                                    <motion.span key={finalTotal} initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.24 }} style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{finalTotal.toLocaleString()}</motion.span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} className="input" placeholder="Promo code" style={{ fontSize: 13, height: 40 }} />
                                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={handleApplyCoupon} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>Apply</motion.button>
                            </div>
                            <AnimatePresence mode="wait">
                                {couponMessage && (
                                    <motion.div key={couponMessage} initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }} className={`coupon-success ${couponApplied ? 'coupon-success-ok' : 'coupon-success-error'}`}>
                                        {couponApplied ? <CheckCircle2 size={14} /> : <Sparkles size={14} />} {couponMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                <Link to="/checkout" className="btn btn-primary btn-lg cart-checkout-btn">
                                    Proceed to Checkout <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 14, color: 'var(--text3)' }}>← Continue Shopping</Link>

                            <div className="cart-progress">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text2)', fontSize: 13 }}>
                                    <Truck size={14} /> Free shipping over ₹499
                                </div>
                                <div className="cart-progress-bar"><div style={{ width: `${Math.min((total / 499) * 100, 100)}%` }} /></div>
                            </div>

                            <div className="cart-timeline">
                                {[
                                    { icon: ShieldCheck, label: 'Secure checkout', hint: 'Protected payment' },
                                    { icon: Clock3, label: 'Fast dispatch', hint: 'Within 24 hours' },
                                    { icon: Truck, label: 'Track delivery', hint: 'Live updates' }
                                ].map((step, index) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.label} className="cart-timeline-step">
                                            <div className="cart-timeline-icon"><Icon size={14} /></div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 13 }}>{step.label}</div>
                                                <div style={{ color: 'var(--text3)', fontSize: 12 }}>{step.hint}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, color: 'var(--text3)' }}>
                                {['🔒 Secure', '💳 Easy Pay', '↩️ Free Returns'].map(b => (
                                    <span key={b}>{b}</span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
