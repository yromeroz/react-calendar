import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { EventListPopover } from '@/components/event-list-popover';
import { useEventStore } from '@/lib/store';
import type { CalendarEventType } from '@/lib/store';

vi.mock('@/lib/store', () => ({
  useEventStore: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  adjustColor: vi.fn(() => '#cccccc'),
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
    name: 'List Event',
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

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventListPopover visibility', () => {
  it('returns null when isOpen is false', () => {
    vi.mocked(useEventStore).mockReturnValue({ openEventSummary: vi.fn() } as any);

    const { container } = render(React.createElement(EventListPopover, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events: [makeEvent()],
      isOpen: false,
      onClose: vi.fn(),
    }));
    expect(container.innerHTML).toBe('');
  });

  it('renders content when isOpen is true', () => {
    vi.mocked(useEventStore).mockReturnValue({ openEventSummary: vi.fn() } as any);

    render(React.createElement(EventListPopover, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events: [makeEvent({ name: 'Visible Event' })],
      isOpen: true,
      onClose: vi.fn(),
    }));
    expect(screen.getByText('Reservas')).toBeTruthy();
    expect(screen.getByText('Visible Event')).toBeTruthy();
  });
});

describe('EventListPopover filtering', () => {
  it('filters events by day in month view', () => {
    vi.mocked(useEventStore).mockReturnValue({ openEventSummary: vi.fn() } as any);

    render(React.createElement(EventListPopover, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events: [
        makeEvent({ id: 1, name: 'Match', date: dayjs('2026-06-05T10:00:00') }),
        makeEvent({ id: 2, name: 'NoMatch', date: dayjs('2026-06-06T10:00:00') }),
      ],
      isOpen: true,
      onClose: vi.fn(),
    }));
    expect(screen.getByText('Match')).toBeTruthy();
    expect(screen.queryByText('NoMatch')).toBeNull();
  });

  it('filters events by hour in week view', () => {
    vi.mocked(useEventStore).mockReturnValue({ openEventSummary: vi.fn() } as any);

    render(React.createElement(EventListPopover, {
      date: dayjs('2026-06-05T10:00:00'),
      view: 'week',
      events: [
        makeEvent({ id: 1, name: 'Match', date: dayjs('2026-06-05T10:30:00') }),
        makeEvent({ id: 2, name: 'NoMatch', date: dayjs('2026-06-05T11:00:00') }),
      ],
      isOpen: true,
      onClose: vi.fn(),
    }));
    expect(screen.getByText('Match')).toBeTruthy();
    expect(screen.queryByText('NoMatch')).toBeNull();
  });
});

describe('EventListPopover click interaction', () => {
  it('calls openEventSummary and onClose on event click', async () => {
    const openEventSummary = vi.fn();
    const onClose = vi.fn();
    vi.mocked(useEventStore).mockReturnValue({ openEventSummary } as any);

    const event = makeEvent({ id: 99, name: 'Clickable' });
    render(React.createElement(EventListPopover, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events: [event],
      isOpen: true,
      onClose,
    }));

    await userEvent.click(screen.getByText('Clickable'));
    expect(openEventSummary).toHaveBeenCalledWith(event);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('EventListPopover name fallback', () => {
  it('shows dash for empty name', () => {
    vi.mocked(useEventStore).mockReturnValue({ openEventSummary: vi.fn() } as any);

    render(React.createElement(EventListPopover, {
      date: dayjs('2026-06-05'),
      view: 'month',
      events: [makeEvent({ name: '' })],
      isOpen: true,
      onClose: vi.fn(),
    }));
    expect(screen.getByText('-')).toBeTruthy();
  });
});
