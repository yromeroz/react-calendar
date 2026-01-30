import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import HeaderLeft from '../components/header/left-side';
import { useDateStore } from '../lib/store';
import { describe, it, beforeEach, expect, vi } from 'vitest';

// Mock UI Button to avoid importing internal helpers and class-variance-authority
vi.mock('../components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
// Mock FloatingMenu to avoid its internal dependencies in this unit test
vi.mock('../components/header/FloatingMenu', () => ({ default: () => <div data-testid="floating-menu" /> }));

describe('HeaderLeft month/year rollover', () => {
  beforeEach(() => {
    // reset minimal store state used by HeaderLeft
    useDateStore.setState({
      userSelectedDate: dayjs('2025-01-15'),
      selectedMonthIndex: 0,
      sidebarViewDate: dayjs('2025-01-15'),
      sidebarMonthIndex: 0,
    } as any);
  });

  it('goes from January 2025 back to December 2024 when clicking previous', () => {
    render(<HeaderLeft />);

    // initial header should show Enero 2025
    expect(screen.getByText(/Enero 2025/i)).toBeTruthy();

    const prevButton = screen.getByTitle('Anterior');
    fireEvent.click(prevButton);

    // after clicking, header should show Diciembre 2024
    expect(screen.getByText(/Diciembre 2024/i)).toBeTruthy();
  });

  it('goes from December 2025 forward to January 2026 when clicking next', () => {
    // set to December 2025
    useDateStore.setState({
      userSelectedDate: dayjs('2025-12-15'),
      selectedMonthIndex: 11,
      sidebarViewDate: dayjs('2025-12-15'),
      sidebarMonthIndex: 11,
    } as any);

    render(<HeaderLeft />);

    expect(screen.getByText(/Diciembre 2025/i)).toBeTruthy();

    const nextButton = screen.getByTitle('Siguiente');
    fireEvent.click(nextButton);

    // after clicking next, header should show Enero 2026
    expect(screen.getByText(/Enero 2026/i)).toBeTruthy();
  });
});