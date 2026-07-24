import { motion } from 'framer-motion';

function SkeletonBar({ width = '100%', height = 14, radius = 999 }) {
    return <div className="skeleton" style={{ width, height, borderRadius: radius }} />;
}

function SkeletonCard({ compact = false }) {
    return (
        <div className="card loading-card" style={{ padding: compact ? 16 : 20 }}>
            <div className="skeleton" style={{ width: '100%', height: compact ? 92 : 132, borderRadius: 16, marginBottom: 12 }} />
            <SkeletonBar width="70%" height={14} />
            <div style={{ height: 8 }} />
            <SkeletonBar width="45%" height={12} />
            {compact ? null : <div style={{ height: 12 }} />}
            {compact ? null : <SkeletonBar width="88%" height={12} />}
        </div>
    );
}

export default function LoadingState({ variant = 'page', title = 'Loading', subtitle = 'Just a moment…' }) {
    const baseProps = {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
    };

    if (variant === 'products') {
        return (
            <motion.div {...baseProps} className="loading-shell">
                <div className="loading-shell-sidebar">
                    <div className="card" style={{ padding: 20 }}>
                        <SkeletonBar width="60%" height={14} />
                        <div style={{ height: 14 }} />
                        {[...Array(5)].map((_, idx) => <div key={idx} style={{ marginBottom: 10 }}><SkeletonBar width="100%" height={12} /></div>)}
                    </div>
                </div>
                <div className="loading-shell-grid">
                    {[...Array(8)].map((_, idx) => <SkeletonCard key={idx} />)}
                </div>
            </motion.div>
        );
    }

    if (variant === 'detail') {
        return (
            <motion.div {...baseProps} className="loading-detail-shell">
                <div className="card loading-detail-gallery" style={{ padding: 18 }}>
                    <div className="skeleton" style={{ width: '100%', height: 440, borderRadius: 24 }} />
                </div>
                <div className="loading-detail-meta">
                    <div className="card" style={{ padding: 24 }}>
                        <SkeletonBar width="30%" height={14} />
                        <div style={{ height: 12 }} />
                        <SkeletonBar width="70%" height={24} />
                        <div style={{ height: 14 }} />
                        <SkeletonBar width="52%" height={14} />
                        <div style={{ height: 18 }} />
                        <SkeletonBar width="100%" height={12} />
                        <div style={{ height: 10 }} />
                        <SkeletonBar width="90%" height={12} />
                        <div style={{ height: 10 }} />
                        <SkeletonBar width="75%" height={12} />
                        <div style={{ height: 20 }} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div className="skeleton" style={{ flex: 1, height: 48, borderRadius: 14 }} />
                            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14 }} />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (variant === 'orders') {
        return (
            <motion.div {...baseProps} className="loading-stack">
                {[...Array(3)].map((_, idx) => <SkeletonCard key={idx} compact />)}
            </motion.div>
        );
    }

    if (variant === 'cart') {
        return (
            <motion.div {...baseProps} className="loading-cart-shell">
                <div className="loading-cart-list">
                    {[...Array(2)].map((_, idx) => <div key={idx} className="card" style={{ padding: 18, marginBottom: 12 }}>
                        <div style={{ display: 'flex', gap: 14 }}>
                            <div className="skeleton" style={{ width: 88, height: 88, borderRadius: 16 }} />
                            <div style={{ flex: 1 }}>
                                <SkeletonBar width="65%" height={14} />
                                <div style={{ height: 10 }} />
                                <SkeletonBar width="35%" height={12} />
                                <div style={{ height: 14 }} />
                                <SkeletonBar width="80%" height={12} />
                            </div>
                        </div>
                    </div>)}
                </div>
                <div className="card" style={{ padding: 20, height: 'fit-content' }}>
                    <SkeletonBar width="50%" height={16} />
                    <div style={{ height: 16 }} />
                    <SkeletonBar width="100%" height={12} />
                    <div style={{ height: 10 }} />
                    <SkeletonBar width="82%" height={12} />
                    <div style={{ height: 18 }} />
                    <SkeletonBar width="100%" height={46} />
                </div>
            </motion.div>
        );
    }

    if (variant === 'admin') {
        return (
            <motion.div {...baseProps} className="loading-admin-shell">
                <div className="card" style={{ padding: 24, width: '100%', maxWidth: 420 }}>
                    <SkeletonBar width="45%" height={14} />
                    <div style={{ height: 12 }} />
                    <SkeletonBar width="70%" height={24} />
                    <div style={{ height: 18 }} />
                    <div style={{ display: 'grid', gap: 10 }}>
                        {[...Array(3)].map((_, idx) => <SkeletonBar key={idx} width="100%" height={12} />)}
                    </div>
                    <div style={{ height: 18 }} />
                    <SkeletonBar width="100%" height={46} />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div {...baseProps} className="loading-page-shell">
            <div className="card" style={{ padding: 24, width: '100%', maxWidth: 420 }}>
                <SkeletonBar width="40%" height={14} />
                <div style={{ height: 12 }} />
                <SkeletonBar width="70%" height={24} />
                <div style={{ height: 14 }} />
                <SkeletonBar width="100%" height={12} />
                <div style={{ height: 10 }} />
                <SkeletonBar width="82%" height={12} />
                <div style={{ height: 18 }} />
                <SkeletonBar width="100%" height={46} />
            </div>
        </motion.div>
    );
}
