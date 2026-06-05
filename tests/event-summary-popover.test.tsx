import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { EventSummaryPopover } from '@/components/event-summary-popover';
import { useFiltersStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import type { CalendarEventType } from '@/lib/store';

vi.mock('@/lib/store', () => ({
  useFiltersStore: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: function MockBtn({ children, onClick, ...props }: any) {
    return React.createElement('button', { onClick, ...props }, children);
  },
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
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
    subject: 'math-101',
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

describe('EventSummaryPopover visibility', () => {
  it('returns null when isOpen is false', () => {
    vi.mocked(useFiltersStore).mockReturnValue({ rooms: [], courses: [], reservationTypes: [] } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    const { container } = render(React.createElement(EventSummaryPopover, {
      isOpen: false,
      onClose: vi.fn(),
      event: makeEvent(),
    }));
    expect(container.innerHTML).toBe('');
  });

  it('renders content when isOpen is true', () => {
    vi.mocked(useFiltersStore).mockReturnValue({ rooms: [], courses: [], reservationTypes: [] } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent({ name: 'Mi Reserva' }),
    }));
    expect(screen.getByText('Detalles de la reserva')).toBeTruthy();
    expect(screen.getByText(/Mi Reserva/)).toBeTruthy();
  });
});

describe('EventSummaryPopover room names', () => {
  it('resolves room IDs to shortnames', () => {
    vi.mocked(useFiltersStore).mockReturnValue({
      rooms: [
        { id: 'A1', name: 'Room A1', shortname: 'A1' },
        { id: 'B2', name: 'Room B2', shortname: 'B2' },
      ],
      courses: [],
      reservationTypes: [],
    } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent({ rooms: ['A1', 'B2'] }),
    }));
    expect(screen.getByText(/A1, B2/)).toBeTruthy();
  });

  it('shows dash for unknown room IDs', () => {
    vi.mocked(useFiltersStore).mockReturnValue({
      rooms: [{ id: 'A1', name: 'Room A1', shortname: 'A1' }],
      courses: [],
      reservationTypes: [],
    } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent({ rooms: ['Z99'] }),
    }));
    expect(screen.getByText(/-/)).toBeTruthy();
  });
});

describe('EventSummaryPopover date formatting', () => {
  it('formats date and time range', () => {
    vi.mocked(useFiltersStore).mockReturnValue({ rooms: [], courses: [], reservationTypes: [] } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent({
        date: dayjs('2026-06-05T08:00:00'),
        endTime: dayjs('2026-06-05T09:30:00'),
      }),
    }));
    expect(screen.getByText(/8:00/i)).toBeTruthy();
    expect(screen.getByText(/9:30/i)).toBeTruthy();
  });
});

describe('EventSummaryPopover auth and details', () => {
  it('shows "Más detalles..." when authenticated', () => {
    vi.mocked(useFiltersStore).mockReturnValue({ rooms: [], courses: [], reservationTypes: [] } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

    render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent(),
      urlParam: 'https://example.com/detalle',
    }));
    expect(screen.getByText('Más detalles...')).toBeTruthy();
  });

  it('shows iframe after clicking "Más detalles..."', async () => {
    vi.mocked(useFiltersStore).mockReturnValue({ rooms: [], courses: [], reservationTypes: [] } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

    render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent({ id: 42 }),
      urlParam: 'https://example.com/detalle',
    }));
    await userEvent.click(screen.getByText('Más detalles...'));
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.src).toContain('ReservaId=42');
  });

  it('shows "URL de reserva no disponible" when urlParam is missing', async () => {
    vi.mocked(useFiltersStore).mockReturnValue({ rooms: [], courses: [], reservationTypes: [] } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

    render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent(),
    }));

    await userEvent.click(screen.getByText('Más detalles...'));
    expect(screen.getByText('URL de reserva no disponible')).toBeTruthy();
  });
});

describe('EventSummaryPopover resets on event change', () => {
  it('resets showDetails when event.id changes', () => {
    vi.mocked(useFiltersStore).mockReturnValue({ rooms: [], courses: [], reservationTypes: [] } as any);
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

    const { rerender } = render(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent({ id: 1 }),
      urlParam: 'https://example.com',
    }));

    rerender(React.createElement(EventSummaryPopover, {
      isOpen: true,
      onClose: vi.fn(),
      event: makeEvent({ id: 2 }),
      urlParam: 'https://example.com',
    }));

    expect(screen.getByText('Más detalles...')).toBeTruthy();
  });
});
