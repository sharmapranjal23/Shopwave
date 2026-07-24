import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Heart, Package, Search } from 'lucide-react';

// Illustrated empty state SVGs per tone
function EmptyIllustration({ tone }) {
  const configs = {
    default: { color: '#6c63ff', bg: 'rgba(108,99,255,0.12)', emoji: '🛍️' },
    success: { color: '#06d6a0', bg: 'rgba(6,214,160,0.12)', emoji: '✅' },
    accent: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)', emoji: '💔' },
    orders: { color: '#ffd166', bg: 'rgba(255,209,102,0.12)', emoji: '📦' },
    search: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', emoji: '🔍' },
  };
  const c = configs[tone] || configs.default;

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ fontSize: 52, width: 100, height: 100, borderRadius: 32, background: c.bg, border: `1px solid ${c.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 36px ${c.color}22, inset 0 1px 0 rgba(255,255,255,0.15)` }}
    >
      {c.emoji}
    </motion.div>
  );
}

export default function StatePanel({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  tone = 'default',
  compact = false,
}) {
  const toneStyles = {
    default: { bg: 'rgba(108,99,255,0.15)', color: 'var(--primary-light)' },
    success: { bg: 'rgba(6,214,160,0.15)', color: 'var(--success)' },
    accent: { bg: 'rgba(255,107,107,0.15)', color: 'var(--accent)' },
    orders: { bg: 'rgba(255,209,102,0.15)', color: 'var(--accent2)' },
    search: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
  };
  const style = toneStyles[tone] || toneStyles.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`state-card ${compact ? 'state-card-compact' : ''}`}
    >
      {/* Icon / illustration */}
      {icon ? (
        <div className="state-icon-wrap" style={style}>{icon}</div>
      ) : (
        <EmptyIllustration tone={tone} />
      )}

      <div style={{ maxWidth: 520 }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, Outfit, sans-serif', fontSize: compact ? 22 : 28, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.03em' }}>{title}</h2>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: 15 }}>{description}</p>

        {(actionLabel && (actionHref || onAction)) && (
          <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {actionHref ? (
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to={actionHref} className="btn btn-primary">
                  {actionLabel} <ArrowRight size={16} />
                </Link>
              </motion.div>
            ) : (
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" onClick={onAction}>
                {actionLabel} <ArrowRight size={16} />
              </motion.button>
            )}
            {secondaryLabel && secondaryHref && (
              <Link to={secondaryHref} className="btn btn-secondary">{secondaryLabel}</Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
