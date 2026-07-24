import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist, useCart } from '../contexts';
import { Stars } from '../components/ProductCard';
import StatePanel from '../components/StatePanel';

export default function Wishlist() {
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) return (
        <div style={{ paddingTop: 120, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 20 }}>
            <StatePanel
                title="Your wishlist is empty"
                description="Save products you love and revisit them later whenever you’re ready to buy."
                icon={<Heart size={30} />}
                actionLabel="Explore Products"
                actionHref="/products"
                tone="accent"
            />
        </div>
    );

    return (
        <div style={{ paddingTop: 90, minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 700 }}>My Wishlist</h1>
                    <span style={{ color: 'var(--text3)', fontSize: 14 }}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="products-grid">
                    {wishlist.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <Link to={`/product/${item.product_id}`} style={{ flex: 1 }}>
                                <div style={{ height: 200, background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,107,107,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, position: 'relative' }}>
                                    🛍️
                                    {item.badge && (
                                        <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gradient)', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{item.badge}</div>
                                    )}
                                </div>
                                <div style={{ padding: '16px 16px 8px' }}>
                                    <Stars rating={item.rating} />
                                    <h3 style={{ fontWeight: 600, fontSize: 15, marginTop: 8, marginBottom: 10, lineHeight: 1.4 }}>{item.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                        <span className="price" style={{ fontSize: 18 }}>₹{item.price.toLocaleString()}</span>
                                        {item.original_price > item.price && <span className="price-original">₹{item.original_price.toLocaleString()}</span>}
                                    </div>
                                </div>
                            </Link>
                            <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
                                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => addToCart(item.product_id)}>
                                    <ShoppingCart size={16} /> Add to Cart
                                </button>
                                <button className="btn btn-danger btn-icon" style={{ width: 40, height: 40 }} onClick={() => toggleWishlist(item.product_id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
