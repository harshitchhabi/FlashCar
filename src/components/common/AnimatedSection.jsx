/**
 * AnimatedSection.jsx — Scroll-triggered animation wrapper
 * Uses Framer Motion for smooth fade/slide animations
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { motion } from 'framer-motion';

// Animation variant presets — harshitChhabiAnimationPresets
const harshitChhabiAnimationPresets = {
  fadeUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
};

// Stagger children container
export const StaggerContainer_24BCI0098 = ({ children, staggerDelay = 0.12, className = '', ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    transition={{ staggerChildren: staggerDelay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * AnimatedSection — wraps content with scroll-triggered animation
 * @param {string} variant - 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fadeIn' | 'scaleIn'
 * @param {number} delay - animation delay in seconds
 * @param {number} duration - animation duration in seconds
 */
export default function AnimatedSection_24BCI0098({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className = '',
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;
  const variants = harshitChhabiAnimationPresets[variant] || harshitChhabiAnimationPresets.fadeUp;

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
