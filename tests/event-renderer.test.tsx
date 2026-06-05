import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { EventRenderer } from '@/components/event-renderer';
import type { CalendarEventType } from '@/lib/store';

vi.mock('@/lib/store', () => ({
  useEventStore: vi.fn(() => ({
    openEventSummary: vi.fn(),
    openEventList: vi.fn(),
  })),
  useDateStore: vi.fn(() => ({
    setDate: vi.fn(),
  })),
}));

vi.mock('@/lib/utils', () => ({
  adjustColor: vi.fn((_color: string, _amount: number) => '#cccccc'),
  getContrastColor: vi.fn(() => '#000000'),
}));

vi.mock('@/components/ui/button', () => ({
  Button: function MockBtn({ children, onClick, ...props }: any) {
    return React.createElement('button', { onClick, ...props }, children);
  },
}));

function makeEvent(overrides: Partial<CalendarEventType> = {}): CalendarEventType {
  return {
    id: 1,
    name: 'Test Event',
    date: dayjs('2026-06-05T10:00:00'),
    endTime: dayjs('2026-06-05T11:30:00'),
    description: '',
    courseId: 1,
    groupId: 1,
    state: 1,
    rooms: ['A1'],
    subject: 'Math',
    reservationType: 1,
    createdAt: dayjs(),
    manager: '',
    authorization: '',
    managerLogin: '',
    authRequired: false,
    color: '#ff0000',
    ...overrides,
  };
}

afterEach(cleanup);

describe('EventRenderer filtering', () => {
  it('shows events matching the day in month view', () => {
    const event = makeEvent({ date: dayjs('2026-06-05T10:00:00') });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events: [event],
    }));
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  it('hides events on a different day in month view', () => {
    const event = makeEvent({ date: dayjs('2026-06-05T10:00:00') });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-06'),
      view: 'month',
      events: [event],
    }));
    expect(screen.queryByText('Test Event')).toBeNull();
  });

  it('shows events matching the hour in week view', () => {
    const event = makeEvent({ date: dayjs('2026-06-05T10:00:00') });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T10:00:00'),
      view: 'week',
      events: [event],
    }));
    expect(screen.getByText('Test Event')).toBeTruthy();
  });

  it('hides events on a different hour in week view', () => {
    const event = makeEvent({ date: dayjs('2026-06-05T10:00:00') });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T11:00:00'),
      view: 'week',
      events: [event],
    }));
    expect(screen.queryByText('Test Event')).toBeNull();
  });

  it('shows events matching the hour in day view', () => {
    const event = makeEvent({ date: dayjs('2026-06-05T14:00:00') });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T14:00:00'),
      view: 'day',
      events: [event],
    }));
    expect(screen.getByText('Test Event')).toBeTruthy();
  });
});

describe('EventRenderer max events', () => {
  it('shows at most 3 events in month view', () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({ id: i, name: `Event ${i}`, date: dayjs('2026-06-05T10:00:00') }),
    );
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events,
    }));
    expect(screen.getByText('Event 0')).toBeTruthy();
    expect(screen.getByText('Event 1')).toBeTruthy();
    expect(screen.getByText('Event 2')).toBeTruthy();
    expect(screen.queryByText('Event 3')).toBeNull();
    expect(screen.queryByText('Event 4')).toBeNull();
  });

  it('shows at most 2 events in week view', () => {
    const events = Array.from({ length: 4 }, (_, i) =>
      makeEvent({ id: i, name: `Event ${i}`, date: dayjs('2026-06-05T10:00:00') }),
    );
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T10:00:00'),
      view: 'week',
      events,
    }));
    expect(screen.getByText('Event 0')).toBeTruthy();
    expect(screen.getByText('Event 1')).toBeTruthy();
    expect(screen.queryByText('Event 2')).toBeNull();
    expect(screen.queryByText('Event 3')).toBeNull();
  });

  it('shows at most 2 events in day view', () => {
    const events = Array.from({ length: 4 }, (_, i) =>
      makeEvent({ id: i, name: `Event ${i}`, date: dayjs('2026-06-05T10:00:00') }),
    );
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T10:00:00'),
      view: 'day',
      events,
    }));
    expect(screen.getByText('Event 0')).toBeTruthy();
    expect(screen.getByText('Event 1')).toBeTruthy();
    expect(screen.queryByText('Event 2')).toBeNull();
    expect(screen.queryByText('Event 3')).toBeNull();
  });
});

describe('EventRenderer hidden events', () => {
  it('shows +N button when events exceed limit in month view', () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({ id: i, name: `E${i}`, date: dayjs('2026-06-05T10:00:00') }),
    );
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events,
    }));
    expect(screen.getByText('+2 más')).toBeTruthy();
  });

  it('hides +N button when events are within limit', () => {
    const events = Array.from({ length: 2 }, (_, i) =>
      makeEvent({ id: i, name: `E${i}`, date: dayjs('2026-06-05T10:00:00') }),
    );
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events,
    }));
    expect(screen.queryByText(/\+.*más/)).toBeNull();
  });
});

describe('EventRenderer empty state', () => {
  it('renders nothing when events array is empty', () => {
    const { container } = render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events: [],
    }));
    expect(container.textContent).toBe('');
  });
});

describe('EventRenderer default colors', () => {
  it('renders events with empty color using default', () => {
    const event = makeEvent({ name: 'NoColor', color: '' });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T10:00:00'),
      view: 'day',
      events: [event],
    }));
    expect(screen.getByText('NoColor')).toBeTruthy();
  });
});

describe('EventRenderer name fallback', () => {
  it('shows dash for empty name', () => {
    const event = makeEvent({ name: '' });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T10:00:00'),
      view: 'day',
      events: [event],
    }));
    expect(screen.getByText('-')).toBeTruthy();
  });
});

describe('EventRenderer time formatting', () => {
  it('shows time in day view', () => {
    const event = makeEvent({ date: dayjs('2026-06-05T08:30:00') });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T08:00:00'),
      view: 'day',
      events: [event],
    }));
    expect(screen.getByText(/8:30/i)).toBeTruthy();
  });
});

describe('EventRenderer store interactions', () => {
  it('calls openEventSummary on event click', async () => {
    const openEventSummary = vi.fn();
    const storeModule = await import('@/lib/store');
    vi.mocked(storeModule.useEventStore).mockReturnValue({
      openEventSummary,
      openEventList: vi.fn(),
    });

    const event = makeEvent({ id: 42 });
    render(React.createElement(EventRenderer, {
      date: dayjs('2026-06-05T10:00:00'),
      view: 'day',
      events: [event],
    }));

    const el = screen.getByTitle('Test Event');
    await userEvent.click(el);
    expect(openEventSummary).toHaveBeenCalledWith(event);
  });
});
