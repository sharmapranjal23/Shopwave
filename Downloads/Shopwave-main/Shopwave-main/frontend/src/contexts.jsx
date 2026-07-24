import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5001/api';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('sw_token');
        if (token) {
            axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => setUser(r.data))
                .catch(() => localStorage.removeItem('sw_token'))
                .finally(() => setLoading(false));
        } else setLoading(false);
    }, []);

    const login = async (email, password) => {
        const r = await axios.post(`${API}/auth/login`, { email, password });
        localStorage.setItem('sw_token', r.data.token);
        setUser(r.data.user);
        return r.data;
    };

    const register = async (name, email, password) => {
        const r = await axios.post(`${API}/auth/register`, { name, email, password });
        localStorage.setItem('sw_token', r.data.token);
        setUser(r.data.user);
        return r.data;
    };

    const logout = () => {
        localStorage.removeItem('sw_token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// Cart Context
const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const token = () => localStorage.getItem('sw_token');

    const fetchCart = async () => {
        if (!user) { setCart([]); return; }
        setLoading(true);
        try {
            const r = await axios.get(`${API}/cart`, { headers: { Authorization: `Bearer ${token()}` } });
            setCart(r.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchCart(); }, [user]);

    const addToCart = async (product_id, quantity = 1) => {
        if (!user) { toast.error('Please login to add to cart'); return false; }
        try {
            await axios.post(`${API}/cart`, { product_id, quantity }, { headers: { Authorization: `Bearer ${token()}` } });
            await fetchCart();
            toast.success('Added to cart!');
            return true;
        } catch (e) { toast.error('Failed to add to cart'); return false; }
    };

    const updateQty = async (id, quantity) => {
        try {
            await axios.put(`${API}/cart/${id}`, { quantity }, { headers: { Authorization: `Bearer ${token()}` } });
            setCart(prev => quantity <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity } : i));
        } catch { }
    };

    const removeFromCart = async (id) => {
        try {
            await axios.delete(`${API}/cart/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
            setCart(prev => prev.filter(i => i.id !== id));
            toast.success('Removed from cart');
        } catch { }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`${API}/cart`, { headers: { Authorization: `Bearer ${token()}` } });
            setCart([]);
        } catch { }
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);

    return <CartContext.Provider value={{ cart, loading, addToCart, updateQty, removeFromCart, clearCart, total, count, fetchCart }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

// Wishlist Context
const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useAuth();
    const token = () => localStorage.getItem('sw_token');

    const fetchWishlist = async () => {
        if (!user) { setWishlist([]); return; }
        try {
            const r = await axios.get(`${API}/wishlist`, { headers: { Authorization: `Bearer ${token()}` } });
            setWishlist(r.data);
        } catch { }
    };

    useEffect(() => { fetchWishlist(); }, [user]);

    const toggleWishlist = async (product_id) => {
        if (!user) { toast.error('Please login to add to wishlist'); return; }
        try {
            const r = await axios.post(`${API}/wishlist`, { product_id }, { headers: { Authorization: `Bearer ${token()}` } });
            if (r.data.added) { toast.success('Added to wishlist ❤️'); }
            else { toast.success('Removed from wishlist'); }
            await fetchWishlist();
        } catch { }
    };

    const isWishlisted = (id) => wishlist.some(w => w.product_id === id);

    return <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlist }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
