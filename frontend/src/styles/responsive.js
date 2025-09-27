// Centralized Responsive System
// This replaces scattered media queries throughout components

// Breakpoints (Material-UI standard)
export const BREAKPOINTS = {
  xs: 0,      // 0px and up
  sm: 600,    // 600px and up
  md: 900,    // 900px and up
  lg: 1200,   // 1200px and up
  xl: 1536,   // 1536px and up
};

// Media Query Helpers
export const mediaQueries = {
  xs: `@media (min-width: ${BREAKPOINTS.xs}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  
  // Max-width queries
  maxSm: `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  maxMd: `@media (max-width: ${BREAKPOINTS.md - 1}px)`,
  maxLg: `@media (max-width: ${BREAKPOINTS.lg - 1}px)`,
  
  // Range queries
  smOnly: `@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  mdOnly: `@media (min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
};

// Responsive Value Helper
export const responsive = (values) => {
  if (typeof values === 'object') {
    return values;
  }
  return values;
};

// Responsive Spacing Scale
export const spacing = {
  xs: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
  sm: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  md: { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 },
  lg: { xs: 4, sm: 6, md: 8, lg: 10, xl: 12 },
  xl: { xs: 6, sm: 8, md: 10, lg: 12, xl: 16 },
};

// Responsive Typography Scale
export const typography = {
  h1: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem', xl: '4rem' },
  h2: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem', xl: '2.5rem' },
  h3: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem', xl: '2.25rem' },
  h4: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem', xl: '2rem' },
  h5: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.5rem', xl: '1.75rem' },
  h6: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.5rem' },
  body1: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem', xl: '1.375rem' },
  body2: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem' },
};

// Responsive Layout Helpers
export const layout = {
  container: {
    xs: '100%',
    sm: '100%',
    md: '900px',
    lg: '1200px',
    xl: '1400px',
  },
  sidebar: {
    xs: '100%',
    sm: '280px',
    md: '320px',
    lg: '360px',
    xl: '400px',
  },
  card: {
    xs: '100%',
    sm: 'calc(50% - 16px)',
    md: 'calc(33.333% - 16px)',
    lg: 'calc(25% - 16px)',
    xl: 'calc(20% - 16px)',
  },
};

// Responsive Display Helpers
export const display = {
  hidden: {
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
  visible: {
    xs: 'block',
    sm: 'block',
    md: 'block',
    lg: 'block',
    xl: 'block',
  },
  mobileOnly: {
    xs: 'block',
    sm: 'block',
    md: 'none',
    lg: 'none',
    xl: 'none',
  },
  desktopOnly: {
    xs: 'none',
    sm: 'none',
    md: 'block',
    lg: 'block',
    xl: 'block',
  },
};

// Responsive Grid Helpers
export const grid = {
  columns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  gap: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
  },
};

// CSS-in-JS Helper for Material-UI sx prop
export const createResponsiveStyles = (styles) => {
  return styles;
};

// Export everything for easy importing
export default {
  BREAKPOINTS,
  mediaQueries,
  responsive,
  spacing,
  typography,
  layout,
  display,
  grid,
  createResponsiveStyles,
};
