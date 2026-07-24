import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { SlidersHorizontal, Grid3x3, LayoutList, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';

const API = 'http://localhost:5001/api';

const SORT_OPTIONS = [
    { value: '', label: 'Best Match' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest First' },
];

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const featured = searchParams.get('featured') || '';
    const trending = searchParams.get('trending') || '';
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        axios.get(`${API}/categories`).then(r => setCategories(r.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        if (sort) params.set('sort', sort);
        if (featured) params.set('featured', featured);
        if (trending) params.set('trending', trending);
        params.set('page', page);
        params.set('limit', 12);
        axios.get(`${API}/products?${params}`).then(r => {
            setProducts(r.data.products);
            setTotal(r.data.total);
            setPages(r.data.pages);
            setLoading(false);
        });
    }, [category, search, sort, featured, trending, page]);

    const setParam = (key, val) => {
        const p = new URLSearchParams(searchParams);
        if (val) p.set(key, val); else p.delete(key);
        p.delete('page');
        setSearchParams(p);
    };

    const setPage = (n) => {
        const p = new URLSearchParams(searchParams);
        p.set('page', n);
        setSearchParams(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const Filters = () => (
        <div style={{ minWidth: 220 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Filters</h3>
            {/* Active filters */}
            {(category || search || featured || trending) && (
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>Active Filters</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {category && <span className="badge badge-primary" style={{ cursor: 'pointer', gap: 6 }} onClick={() => setParam('category', '')}>
                            {category} <X size={11} />
                        </span>}
                        {search && <span className="badge badge-primary" style={{ cursor: 'pointer', gap: 6 }} onClick={() => setParam('search', '')}>
                            "{search}" <X size={11} />
                        </span>}
                    </div>
                </div>
            )}

            {/* Categories */}
            <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12, fontWeight: 600 }}>CATEGORIES</p>
                {[{ slug: '', name: 'All Products' }, ...categories].map(cat => (
                    <div key={cat.slug} onClick={() => setParam('category', cat.slug)}
                        style={{
                            padding: '10px 14px', borderRadius: 10, cursor: 'pointer', marginBottom: 4,
                            background: category === cat.slug ? 'rgba(108,99,255,0.2)' : 'transparent',
                            border: `1px solid ${category === cat.slug ? 'rgba(108,99,255,0.4)' : 'transparent'}`,
                            color: category === cat.slug ? 'var(--primary-light)' : 'var(--text2)',
                            fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, fontWeight: category === cat.slug ? 600 : 400,
                            transition: 'var(--transition)',
                        }}>
                        {cat.icon && <span>{cat.icon}</span>} {cat.name}
                    </div>
                ))}
            </div>

            {/* Special Filters */}
            <div>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12, fontWeight: 600 }}>DISCOVER</p>
                {[['featured', '⭐ Featured'], ['trending', '🔥 Trending']].map(([key, label]) => (
                    <div key={key} onClick={() => setParam(key, searchParams.get(key) ? '' : '1')}
                        style={{
                            padding: '10px 14px', borderRadius: 10, cursor: 'pointer', marginBottom: 4,
                            background: searchParams.get(key) ? 'rgba(255,209,102,0.15)' : 'transparent',
                            border: `1px solid ${searchParams.get(key) ? 'rgba(255,209,102,0.3)' : 'transparent'}`,
                            color: searchParams.get(key) ? 'var(--accent2)' : 'var(--text2)',
                            fontSize: 14, fontWeight: searchParams.get(key) ? 600 : 400, transition: 'var(--transition)',
                        }}>{label}</div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ paddingTop: 90, minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 40 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700 }}>
                            {search ? `Search: "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
                        </h1>
                        <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 4 }}>{total} products found</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setFiltersOpen(!filtersOpen)} style={{ display: 'none' }}>
                            <SlidersHorizontal size={16} /> Filters
                        </button>
                        <select
                            value={sort} onChange={e => setParam('sort', e.target.value)}
                            style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>
                    {/* Sidebar */}
                    <div style={{ padding: '24px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', height: 'fit-content', position: 'sticky', top: 90 }}>
                        <Filters />
                    </div>

                    {/* Products */}
                    <div>
                        {loading ? (
                            <LoadingState variant="products" />
                        ) : products.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                                <div style={{ fontSize: 64, marginBottom: 16 }}>😔</div>
                                <h3 style={{ fontSize: 24, marginBottom: 8 }}>No products found</h3>
                                <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Try adjusting your filters or search term</p>
                                <button className="btn btn-primary" onClick={() => setSearchParams({})}>Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="products-grid">
                                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                                {/* Pagination */}
                                {pages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48, flexWrap: 'wrap' }}>
                                        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-secondary btn-sm">
                                            <ChevronLeft size={16} />
                                        </button>
                                        {[...Array(Math.min(pages, 7))].map((_, i) => {
                                            const n = i + 1;
                                            return (
                                                <button key={n} onClick={() => setPage(n)} className="btn btn-sm"
                                                    style={{ background: page === n ? 'var(--gradient)' : 'var(--bg3)', color: page === n ? '#fff' : 'var(--text2)', border: '1px solid var(--border)', minWidth: 40 }}>
                                                    {n}
                                                </button>
                                            );
                                        })}
                                        <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="btn btn-secondary btn-sm">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
