import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { useCart, useAuth } from '../contexts';
import toast from 'react-hot-toast';
import StatePanel from '../components/StatePanel';

const API = 'http://localhost:5001/api';

export default function Checkout() {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [placing, setPlacing] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('home');
    const prefersReducedMotion = useReducedMotion();
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'card',
        cardNumber: '4242 4242 4242 4242',
        cardExpiry: '12/26',
        cardCVV: '123',
    });

    const delivery = total >= 499 ? 0 : 49;
    const finalTotal = total + delivery;

    const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleOrder = async () => {
        setPlacing(true);
        try {
            const address = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
            const r = await axios.post(`${API}/orders`, {
                items: cart.map(i => ({ product_id: i.product_id, name: i.name, price: i.price, quantity: i.quantity })),
                total: finalTotal, address, payment_method: form.paymentMethod,
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('sw_token')}` } });
            setOrderId(r.data.order_id);
            setStep(3);
        } catch { toast.error('Failed to place order'); }
        setPlacing(false);
    };

    if (!user) return (
        <div style={{ paddingTop: 120, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 20 }}>
            <StatePanel
                title="Please login to checkout"
                description="Secure your order with a personal account and keep your order history, delivery details, and preferences in one place."
                icon={<ShieldCheck size={30} />}
                actionLabel="Login"
                onAction={() => navigate('/login')}
                tone="accent"
            />
        </div>
    );

    const InputField = ({ label, field, type = 'text', placeholder }) => (
        <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text2)' }}>{label}</label>
            <input type={type} className="input" value={form[field] || ''} onChange={e => update(field, e.target.value)} placeholder={placeholder} />
        </div>
    );

    return (
        <div style={{ paddingTop: 90, minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 900 }}>
                <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, flexWrap: 'wrap' }}>
                    {[['1', 'Address', MapPin], ['2', 'Payment', CreditCard], ['3', 'Confirm', CheckCircle]].map(([n, label, Icon], i) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: i === 2 ? '0 0 auto' : 1, minWidth: 0 }}>
                            <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: step >= parseInt(n) ? 'var(--gradient)' : 'var(--bg3)', border: `1px solid ${step >= parseInt(n) ? 'transparent' : 'var(--border)'}`, color: step >= parseInt(n) ? '#fff' : 'var(--text3)' }}>
                                {step > parseInt(n) ? '✓' : <Icon size={16} />}
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 14, color: step >= parseInt(n) ? 'var(--text)' : 'var(--text3)' }}>{label}</span>
                            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? 'var(--primary)' : 'var(--border)', margin: '0 12px', minWidth: 12 }} />}
                        </div>
                    ))}
                </motion.div>

                {step === 3 ? (
                    <motion.div initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} style={{ textAlign: 'center', padding: '70px 24px', background: 'linear-gradient(135deg, rgba(108,99,255,0.14), rgba(255,107,107,0.12))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <motion.div animate={prefersReducedMotion ? undefined : { scale: [0.9, 1.08, 1] }} transition={{ duration: 0.65 }} style={{ width: 108, height: 108, borderRadius: '50%', background: 'rgba(6,214,160,0.2)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 48 }}>🎉</motion.div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 34, fontWeight: 800, marginBottom: 10 }}>Order placed successfully</h2>
                        <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 8 }}>Your order has been confirmed and is being prepared with care.</p>
                        <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 28 }}>Order ID: <strong style={{ color: 'var(--primary-light)' }}>#{orderId?.slice(0, 8).toUpperCase()}</strong></p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>View Orders</button>
                            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>Continue Shopping</button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="checkout-shell">
                        <motion.div initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }} animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="card" style={{ padding: 32, background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.025))' }}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }} transition={{ duration: 0.24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                            <MapPin size={18} style={{ color: 'var(--primary-light)' }} />
                                            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700 }}>Delivery Address</h2>
                                        </div>
                                        <div className="address-options">
                                            {[
                                                { id: 'home', title: 'Home', detail: 'B-12, Rosewood, Mumbai' },
                                                { id: 'work', title: 'Work', detail: 'Orbit Tower, Pune' },
                                                { id: 'other', title: 'Other', detail: 'Add a new location' }
                                            ].map(address => (
                                                <button key={address.id} onClick={() => setSelectedAddress(address.id)} className={`address-option ${selectedAddress === address.id ? 'active' : ''}`}>
                                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{address.title}</div>
                                                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{address.detail}</div>
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <InputField label="Full Name" field="name" placeholder="Your name" />
                                                <InputField label="Email" field="email" type="email" placeholder="email@example.com" />
                                            </div>
                                            <InputField label="Phone" field="phone" placeholder="+91 98765 43210" />
                                            <InputField label="Address" field="address" placeholder="House no, Street, Area" />
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 16 }}>
                                                <InputField label="City" field="city" placeholder="Mumbai" />
                                                <InputField label="State" field="state" placeholder="Maharashtra" />
                                                <InputField label="Pincode" field="pincode" placeholder="400001" />
                                            </div>
                                        </div>
                                        <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="btn btn-primary btn-lg checkout-action" onClick={() => {
                                            if (!form.name || !form.address || !form.city) { toast.error('Fill all required fields'); return; }
                                            setStep(2);
                                        }}>
                                            Continue to Payment <ArrowRight size={18} />
                                        </motion.button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }} transition={{ duration: 0.24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                            <CreditCard size={18} style={{ color: 'var(--primary-light)' }} />
                                            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700 }}>Payment Method</h2>
                                        </div>
                                        <div className="payment-options">
                                            {[['card', '💳 Card'], ['upi', '📱 UPI'], ['cod', '💵 COD']].map(([v, label]) => (
                                                <button key={v} onClick={() => update('paymentMethod', v)} className={`payment-option ${form.paymentMethod === v ? 'active' : ''}`}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                        {form.paymentMethod === 'card' && (
                                            <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
                                                <InputField label="Card Number" field="cardNumber" placeholder="1234 5678 9012 3456" />
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                    <InputField label="Expiry" field="cardExpiry" placeholder="MM/YY" />
                                                    <InputField label="CVV" field="cardCVV" placeholder="123" />
                                                </div>
                                                <div className="checkout-note">
                                                    <ShieldCheck size={14} /> Pre-filled demo card. No real charges.
                                                </div>
                                            </div>
                                        )}
                                        {form.paymentMethod === 'upi' && (
                                            <div style={{ marginTop: 18 }}>
                                                <InputField label="UPI ID" field="upiId" placeholder="yourname@upi" />
                                            </div>
                                        )}
                                        {form.paymentMethod === 'cod' && (
                                            <div className="checkout-note" style={{ marginTop: 18 }}>
                                                <Truck size={14} /> Pay when your order arrives at your doorstep.
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                                            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                                            <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="btn btn-primary btn-lg checkout-action" onClick={handleOrder} disabled={placing}>
                                                {placing ? 'Placing order...' : 'Place Order'}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }} animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="card" style={{ padding: 24, height: 'fit-content', position: 'sticky', top: 90, background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.025))' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700 }}>Order Summary</h3>
                                <span className="badge badge-primary"><Sparkles size={12} /> Premium</span>
                            </div>
                            <div style={{ maxHeight: 280, overflow: 'auto', marginBottom: 18 }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                                        <span style={{ color: 'var(--text2)', flex: 1, marginRight: 8 }}>{item.name} × {item.quantity}</span>
                                        <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)' }}>
                                    <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text2)' }}>
                                    <span>Delivery</span><span style={{ color: delivery === 0 ? 'var(--success)' : '' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
                                    <span>Total</span>
                                    <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="checkout-note" style={{ marginTop: 16 }}>
                                <ShieldCheck size={14} /> Secure checkout with encrypted payment processing.
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
