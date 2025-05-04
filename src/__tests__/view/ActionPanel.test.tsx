import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import ActionPanel from '../../view/ActionPanel';

describe('ActionPanel', () => {
  // Mock functions for button clicks
  const mockOnMove = jest.fn();
  const mockOnShoot = jest.fn();
  const mockOnRestart = jest.fn();

  // Reset mocks before each test
  beforeEach(() => {
    mockOnMove.mockReset();
    mockOnShoot.mockReset();
    mockOnRestart.mockReset();
  });

  test('renders all buttons', () => {
    render(
      <ActionPanel
        canMove={true}
        canShoot={true}
        shootMode={false}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Check that all buttons are rendered
    expect(screen.getByTestId('move-button')).toBeInTheDocument();
    expect(screen.getByTestId('shoot-button')).toBeInTheDocument();
    expect(screen.getByTestId('restart-button')).toBeInTheDocument();
  });

  test('calls onMove when Move button is clicked', () => {
    render(
      <ActionPanel
        canMove={true}
        canShoot={true}
        shootMode={false}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Click the Move button
    fireEvent.click(screen.getByTestId('move-button'));

    // Check that onMove was called
    expect(mockOnMove).toHaveBeenCalledTimes(1);
  });

  test('calls onShoot when Shoot button is clicked', () => {
    render(
      <ActionPanel
        canMove={true}
        canShoot={true}
        shootMode={false}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Click the Shoot button
    fireEvent.click(screen.getByTestId('shoot-button'));

    // Check that onShoot was called
    expect(mockOnShoot).toHaveBeenCalledTimes(1);
  });

  test('calls onRestart when Restart button is clicked', () => {
    render(
      <ActionPanel
        canMove={true}
        canShoot={true}
        shootMode={false}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Click the Restart button
    fireEvent.click(screen.getByTestId('restart-button'));

    // Check that onRestart was called
    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  test('disables Move button when canMove is false', () => {
    render(
      <ActionPanel
        canMove={false}
        canShoot={true}
        shootMode={false}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Check that Move button is disabled
    expect(screen.getByTestId('move-button')).toBeDisabled();

    // Try clicking the disabled button
    fireEvent.click(screen.getByTestId('move-button'));

    // Check that onMove was not called
    expect(mockOnMove).not.toHaveBeenCalled();
  });

  test('disables Shoot button when canShoot is false', () => {
    render(
      <ActionPanel
        canMove={true}
        canShoot={false}
        shootMode={false}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Check that Shoot button is disabled
    expect(screen.getByTestId('shoot-button')).toBeDisabled();

    // Try clicking the disabled button
    fireEvent.click(screen.getByTestId('shoot-button'));

    // Check that onShoot was not called
    expect(mockOnShoot).not.toHaveBeenCalled();
  });

  test('applies active-mode class to Move button when not in shoot mode', () => {
    render(
      <ActionPanel
        canMove={true}
        canShoot={true}
        shootMode={false}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Check that Move button has active-mode class
    expect(screen.getByTestId('move-button')).toHaveClass('active-mode');

    // Check that Shoot button does not have active-mode class
    expect(screen.getByTestId('shoot-button')).not.toHaveClass('active-mode');
  });

  test('applies active-mode class to Shoot button when in shoot mode', () => {
    render(
      <ActionPanel
        canMove={true}
        canShoot={true}
        shootMode={true}
        onMove={mockOnMove}
        onShoot={mockOnShoot}
        onRestart={mockOnRestart}
      />
    );

    // Check that Shoot button has active-mode class
    expect(screen.getByTestId('shoot-button')).toHaveClass('active-mode');

    // Check that Move button does not have active-mode class
    expect(screen.getByTestId('move-button')).not.toHaveClass('active-mode');
  });
});
