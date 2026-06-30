import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import dayjs from 'dayjs';
import HeaderLeft from '../components/header/left-side';
import { useDateStore, useViewStore, usePaginateDirectionStore } from '../lib/store';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

vi.mock('../components/ui/button', () => ({
  Button: function Btn(props: any) { return props.children; },
}));
vi.mock('../components/header/FloatingMenu', () => ({
  default: function FM() { return null; },
}));

describe('HeaderLeft month/year rollover', () => {
  afterEach(cleanup);

  it('goes from January 2025 back to December 2024 when clicking previous', () => {
    useViewStore.setState({ selectedView: 'month' });
    usePaginateDirectionStore.setState({ direction: 0 });
    useDateStore.setState({
      userSelectedDate: dayjs('2025-01-15'),
      selectedMonthIndex: 0,
    } as any);

    render(React.createElement(HeaderLeft));

    expect(screen.getByText(/Enero 2025/i)).toBeTruthy();

    const prevButton = screen.getByTitle('Anterior');
    fireEvent.click(prevButton);

    expect(screen.getByText(/Diciembre 2024/i)).toBeTruthy();
  });

  it('goes from December 2025 forward to January 2026 when clicking next', () => {
    useViewStore.setState({ selectedView: 'month' });
    usePaginateDirectionStore.setState({ direction: 0 });
    useDateStore.setState({
      userSelectedDate: dayjs('2025-12-15'),
      selectedMonthIndex: 11,
    } as any);

    render(React.createElement(HeaderLeft));

    expect(screen.getByText(/Diciembre 2025/i)).toBeTruthy();

    const nextButton = screen.getByTitle('Siguiente');
    fireEvent.click(nextButton);

    expect(screen.getByText(/Enero 2026/i)).toBeTruthy();
  });
});
