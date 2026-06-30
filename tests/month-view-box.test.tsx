import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import MonthViewBox from '@/components/month-view-box';
import { useDateStore, useEventStore } from '@/lib/store';

vi.mock('@/lib/store', () => ({
  useDateStore: vi.fn(),
  useEventStore: vi.fn(),
}));

vi.mock('@/components/event-renderer', () => ({
  EventRenderer: function MockEventRenderer() {
    return React.createElement('div', { 'data-testid': 'event-renderer' });
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('MonthViewBox null day', () => {
  it('renders empty div when day is null', () => {
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: dayjs('2026-06-01'), setDate: vi.fn() } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [], openPopover: vi.fn() } as any);

    const { container } = render(React.createElement(MonthViewBox, { day: null, rowIndex: 0 }));
    expect(container.querySelector('div')?.textContent).toBe('');
  });

  it('does not render EventRenderer when day is null', () => {
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: dayjs('2026-06-01'), setDate: vi.fn() } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [], openPopover: vi.fn() } as any);

    render(React.createElement(MonthViewBox, { day: null, rowIndex: 0 }));
    expect(screen.queryByTestId('event-renderer')).toBeNull();
  });
});

describe('MonthViewBox day display', () => {
  it('shows the day number', () => {
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: dayjs('2026-06-01'), setDate: vi.fn() } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [], openPopover: vi.fn() } as any);

    render(React.createElement(MonthViewBox, { day: dayjs('2026-06-15'), rowIndex: 2 }));
    expect(screen.getByText('15')).toBeTruthy();
  });

  it('renders EventRenderer for valid day', () => {
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: dayjs('2026-06-01'), setDate: vi.fn() } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [{}], openPopover: vi.fn() } as any);

    render(React.createElement(MonthViewBox, { day: dayjs('2026-06-10'), rowIndex: 1 }));
    expect(screen.getByTestId('event-renderer')).toBeTruthy();
  });
});

describe('MonthViewBox today styling', () => {
  it('applies today class for current day', () => {
    const today = dayjs();
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: today, setDate: vi.fn() } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [], openPopover: vi.fn() } as any);

    render(React.createElement(MonthViewBox, { day: today, rowIndex: 0 }));
    const heading = screen.getByText(today.format('D'));
    expect(heading.className).toContain('bg-blue-600');
  });
});

describe('MonthViewBox outside month styling', () => {
  it('applies gray text for outside-month days', () => {
    const currentMonth = dayjs('2026-06-15');
    const prevMonthDay = dayjs('2026-05-31');
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: currentMonth, setDate: vi.fn() } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [], openPopover: vi.fn() } as any);

    render(React.createElement(MonthViewBox, { day: prevMonthDay, rowIndex: 0 }));
    const heading = screen.getByText('31');
    expect(heading.className).toContain('text-gray-400');
  });

  it('does not apply gray text for current-month days', () => {
    const day = dayjs('2026-06-10');
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: dayjs('2026-06-01'), setDate: vi.fn() } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [], openPopover: vi.fn() } as any);

    render(React.createElement(MonthViewBox, { day, rowIndex: 0 }));
    const heading = screen.getByText('10');
    expect(heading.className).not.toContain('text-gray-400');
  });
});

describe('MonthViewBox click', () => {
  it('calls setDate on click', async () => {
    const setDate = vi.fn();
    const day = dayjs('2026-06-20');
    vi.mocked(useDateStore).mockReturnValue({ userSelectedDate: dayjs('2026-06-01'), setDate } as any);
    vi.mocked(useEventStore).mockReturnValue({ events: [], openPopover: vi.fn() } as any);

    render(React.createElement(MonthViewBox, { day, rowIndex: 0 }));

    const container = screen.getByText('20').closest('.group');
    await userEvent.click(container!);
    expect(setDate).toHaveBeenCalledWith(day);
  });
});
