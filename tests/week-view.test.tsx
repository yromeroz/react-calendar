import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import WeekView from '@/components/week-view';
import { useDateStore, useEventStore } from '@/lib/store';

vi.mock('@/lib/store', () => ({
  useDateStore: vi.fn(),
  useEventStore: vi.fn(),
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: function MockScrollArea({ children, className }: any) {
    return React.createElement('div', { className, 'data-testid': 'scroll-area' }, children);
  },
}));

vi.mock('@/components/event-renderer', () => ({
  EventRenderer: function MockEventRenderer() {
    return React.createElement('div', { 'data-testid': 'event-renderer' });
  },
}));

beforeEach(() => {
  vi.mocked(useDateStore).mockReturnValue({
    userSelectedDate: dayjs('2026-06-01'),
    setDate: vi.fn(),
  } as any);
  vi.mocked(useEventStore).mockReturnValue({
    events: [],
    openPopover: vi.fn(),
  } as any);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('WeekView header', () => {
  it('renders 7 day headers', () => {
    render(React.createElement(WeekView));
    const headers = screen.getAllByText(/LUN|MAR|MIÉ|JUE|VIE|SÁB|DOM/i);
    expect(headers).toHaveLength(7);
  });

  it('renders day numbers', () => {
    const monday = dayjs('2026-06-01');
    vi.mocked(useDateStore).mockReturnValue({
      userSelectedDate: monday,
      setDate: vi.fn(),
    } as any);

    render(React.createElement(WeekView));
    expect(screen.getByText('01')).toBeTruthy();
  });
});

describe('WeekView time grid', () => {
  it('renders time labels', () => {
    render(React.createElement(WeekView));
    const labels = screen.getAllByText(/12:00/);
    expect(labels.length).toBe(2);
  });

  it('renders EventRenderer for each cell', () => {
    render(React.createElement(WeekView));
    const renderers = screen.getAllByTestId('event-renderer');
    expect(renderers.length).toBe(7 * 24);
  });
});

describe('WeekView today highlight', () => {
  it('highlights today in header with blue bg', () => {
    vi.mocked(useDateStore).mockReturnValue({
      userSelectedDate: dayjs(),
      setDate: vi.fn(),
    } as any);

    render(React.createElement(WeekView));
    const todayNum = dayjs().format('DD');
    const todayEl = screen.getByText(todayNum);
    expect(todayEl.className).toContain('bg-blue-600');
  });
});

describe('WeekView current time indicator', () => {
  it('renders red time indicator line on today column', () => {
    vi.mocked(useDateStore).mockReturnValue({
      userSelectedDate: dayjs(),
      setDate: vi.fn(),
    } as any);

    const { container } = render(React.createElement(WeekView));
    const indicators = container.querySelectorAll('.bg-red-500');
    expect(indicators.length).toBe(1);
  });
});
