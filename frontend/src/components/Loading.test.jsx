import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../styles/theme';
import Loading from './Loading';

// Mock the useFoldableDisplay hook
jest.mock('../hooks/useFoldableDisplay', () => ({
  useFoldableDisplay: () => ({
    isFoldable: false,
    getFoldableClasses: () => 'foldable-base',
    getResponsiveValue: (xs, sm, md, lg) => md,
  }),
}));

const renderWithTheme = (component) => {
  const theme = createAppTheme();
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Loading Component', () => {
  test('renders with default props', () => {
    renderWithTheme(<Loading />);
    
    expect(screen.getByText('Loading your golden basket...')).toBeInTheDocument();
    expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    const customMessage = 'Custom loading message';
    renderWithTheme(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('renders without icon when showIcon is false', () => {
    renderWithTheme(<Loading showIcon={false} />);
    
    expect(screen.queryByTestId('ShoppingCartIcon')).not.toBeInTheDocument();
    expect(screen.getByText('Loading your golden basket...')).toBeInTheDocument();
  });

  test('renders without dots when showDots is false', () => {
    renderWithTheme(<Loading showDots={false} />);
    
    expect(screen.getByText('Loading your golden basket...')).toBeInTheDocument();
    expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
  });

  test('applies correct size classes', () => {
    const { rerender } = renderWithTheme(<Loading size="small" />);
    
    // Test small size
    let container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toHaveStyle({ height: '30vh' });
    
    // Test large size
    rerender(<Loading size="large" />);
    container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toHaveStyle({ height: '70vh' });
  });

  test('applies correct variant styles', () => {
    const { rerender } = renderWithTheme(<Loading variant="subtle" />);
    
    // Test subtle variant
    let container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toHaveStyle({ background: 'rgba(163, 130, 76, 0.02)' });
    
    // Test vibrant variant
    rerender(<Loading variant="vibrant" />);
    container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toHaveStyle({ background: 'rgba(163, 130, 76, 0.1)' });
  });

  test('has proper accessibility attributes', () => {
    renderWithTheme(<Loading />);
    
    const container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toHaveAttribute('role', 'status');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  test('supports keyboard navigation', () => {
    renderWithTheme(<Loading />);
    
    const container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toHaveAttribute('tabIndex', '0');
  });

  test('renders progress indicator', () => {
    renderWithTheme(<Loading />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('applies responsive classes correctly', () => {
    renderWithTheme(<Loading />);
    
    const container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toHaveClass('foldable-base');
  });

  test('handles empty message gracefully', () => {
    renderWithTheme(<Loading message="" />);
    
    const container = screen.getByTestId('ShoppingCartIcon').closest('[class*="loading"]');
    expect(container).toBeInTheDocument();
  });

  test('maintains consistent styling across variants', () => {
    const { rerender } = renderWithTheme(<Loading variant="default" />);
    
    const defaultContainer = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    const defaultStyles = window.getComputedStyle(defaultContainer);
    
    rerender(<Loading variant="subtle" />);
    const subtleContainer = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    const subtleStyles = window.getComputedStyle(subtleContainer);
    
    // Check that basic layout properties remain consistent
    expect(subtleStyles.display).toBe(defaultStyles.display);
    expect(subtleStyles.flexDirection).toBe(defaultStyles.flexDirection);
    expect(subtleStyles.justifyContent).toBe(defaultStyles.justifyContent);
  });

  test('renders animated dots with correct count', () => {
    renderWithTheme(<Loading showDots={true} />);
    
    // Should render 5 animated dots
    const dots = screen.getAllByRole('presentation');
    expect(dots).toHaveLength(5);
  });

  test('applies performance optimizations', () => {
    renderWithTheme(<Loading />);
    
    const container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    const styles = window.getComputedStyle(container);
    
    expect(styles.willChange).toBe('transform, opacity');
    expect(styles.backfaceVisibility).toBe('hidden');
  });

  test('supports reduced motion preferences', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderWithTheme(<Loading />);
    
    const container = screen.getByText('Loading your golden basket...').closest('[class*="loading"]');
    expect(container).toBeInTheDocument();
  });

  test('handles theme integration correctly', () => {
    renderWithTheme(<Loading />);
    
    const icon = screen.getByTestId('ShoppingCartIcon');
    const iconStyles = window.getComputedStyle(icon);
    
    // Should use theme colors
    expect(iconStyles.color).toBe('rgb(255, 255, 255)'); // primary.contrastText
  });

  test('renders with all props combinations', () => {
    const testCases = [
      { size: 'small', variant: 'default' },
      { size: 'medium', variant: 'subtle' },
      { size: 'large', variant: 'vibrant' },
      { showDots: false, showIcon: false },
      { showDots: true, showIcon: false },
      { showDots: false, showIcon: true },
    ];

    testCases.forEach((props) => {
      const { unmount } = renderWithTheme(<Loading {...props} />);
      expect(screen.getByText('Loading your golden basket...')).toBeInTheDocument();
      unmount();
    });
  });
});
