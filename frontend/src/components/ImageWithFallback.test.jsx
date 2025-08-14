import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageWithFallback from './ImageWithFallback';

describe('ImageWithFallback', () => {
  test('renders image when src is provided and valid', () => {
    render(
      <ImageWithFallback
        src="https://example.com/valid-image.jpg"
        alt="Test Image"
        data-testid="test-image"
      />
    );

    const img = screen.getByTestId('test-image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/valid-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Image');
  });

  test('renders fallback when src is not provided', () => {
    render(
      <ImageWithFallback
        alt="Test Image"
        fallbackText="No Image Available"
        data-testid="test-fallback"
      />
    );

    const fallback = screen.getByTestId('test-fallback');
    expect(fallback).toBeInTheDocument();
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  test('renders fallback when image fails to load', () => {
    render(
      <ImageWithFallback
        src="https://example.com/invalid-image.jpg"
        alt="Test Image"
        fallbackText="Image Failed to Load"
        data-testid="test-image"
      />
    );

    const img = screen.getByTestId('test-image');
    fireEvent.error(img);

    expect(screen.getByText('Image Failed to Load')).toBeInTheDocument();
  });

  test('applies custom styles to fallback', () => {
    const customStyles = {
      backgroundColor: 'red',
      color: 'white',
    };

    render(
      <ImageWithFallback
        alt="Test Image"
        fallbackText="Custom Style"
        sx={customStyles}
        data-testid="test-fallback"
      />
    );

    const fallback = screen.getByTestId('test-fallback');
    expect(fallback).toHaveStyle('background-color: red');
  });
});
