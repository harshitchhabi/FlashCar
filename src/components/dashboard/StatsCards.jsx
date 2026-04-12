/**
 * StatsCards_24BCI0098.jsx — Dashboard Statistics Cards
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 *
 * Displays user's eco-impact statistics in an animated grid.
 */
import { motion } from 'framer-motion';

// harshitChhabiDefaultStats — default stat display data (24BCI0098)
const harshitChhabiDefaultStats = [
  { value: '₹2,400', label: 'Total Saved', icon: '💰', color: '#f59e0b' },
  { value: '12', label: 'Rides Shared', icon: '🚗', color: '#10b981' },
  { value: '45 kg', label: 'CO₂ Reduced', icon: '🌱', color: '#84cc16' },
  { value: '4.8★', label: 'Your Rating', icon: '⭐', color: '#8b5cf6' },
];

/**
 * class HarshitChhabiStatsCards — Dashboard statistics grid
 * Registration: 24BCI0098
 * @param {Array} stats - Optional custom stats array
 */
export default function StatsCards_24BCI0098({ stats = harshitChhabiDefaultStats }) {
  console.log('StatsCards rendered — Harshit Chhabi 24BCI0098');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
      }}
      id="stats-cards-24BCI0098"
    >
      {stats.map((stat_24BCI0098, index) => (
        <motion.div
          key={stat_24BCI0098.label}
          className="gr-card-solid"
          style={{ textAlign: 'center', padding: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
        >
          <span style={{ fontSize: '1.5rem', display: 'block' }}>{stat_24BCI0098.icon}</span>
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--gr-accent)',
            marginTop: '0.5rem',
          }}>
            {stat_24BCI0098.value}
          </div>
          <p className="gr-text-xs" style={{ marginTop: '0.25rem' }}>
            {stat_24BCI0098.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
