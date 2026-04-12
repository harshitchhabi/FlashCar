/**
 * LoadingSkeleton.jsx — Shimmer Loading Placeholders
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */

export function SkeletonText({ width = '100%', height = '1rem', style = {} }) {
  return (
    <div
      className="gr-skeleton gr-skeleton-text gr-animate-shimmer"
      style={{ width, height, ...style }}
    />
  );
}

export function SkeletonCircle({ size = 48 }) {
  return (
    <div
      className="gr-skeleton gr-skeleton-circle gr-animate-shimmer"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonRect({ width = '100%', height = '200px', borderRadius = 'var(--gr-radius-md)' }) {
  return (
    <div
      className="gr-skeleton gr-skeleton-rect gr-animate-shimmer"
      style={{ width, height, borderRadius }}
    />
  );
}

// Card skeleton — developed by Harshit Chhabi (24BCI0098)
export default function LoadingSkeleton_24BCI0098({ count = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(count, 3)}, 1fr)`, gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="gr-card-solid" style={{ padding: '1.5rem' }}>
          <SkeletonCircle size={48} />
          <SkeletonText width="60%" style={{ marginTop: '1rem' }} />
          <SkeletonText width="100%" style={{ marginTop: '0.75rem' }} />
          <SkeletonText width="80%" />
          <SkeletonRect height="36px" style={{ marginTop: '1rem' }} />
        </div>
      ))}
    </div>
  );
}
