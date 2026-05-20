import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateTicket,
  createDeleteTicket,
  createEditTicket,
  createGetTicket,
  createGetTickets,
  createSoftDeleteTicket,
  createUpdateTicketStatus,
} from './api';
import { endpoints, instance } from '../api';
import { TicketStatus } from './types';

vi.mock('../api', () => ({
  instance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  endpoints: {
    ticket: '/ticket',
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('ticket api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetTickets should return correct queryKey and fetch content', async () => {
    const config = createGetTickets();
    expect(config.queryKey).toEqual([endpoints.ticket]);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: 't1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(endpoints.ticket);
    expect(result).toEqual([{ id: 't1' }]);
  });

  it('createGetTicket should return correct queryKey and fetch single ticket', async () => {
    const config = createGetTicket({ id: '123' });
    expect(config.queryKey).toEqual([endpoints.ticket, '123']);

    (instance.get as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/ticket/123');
    expect(result).toEqual({ id: '123' });
  });

  it('createCreateTicket should post to endpoint and return response data', async () => {
    const config = createCreateTicket();
    const body = { ticketType: 'REPAIR', vehicleIds: ['v1'] } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith(endpoints.ticket, body);
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditTicket should put to /ticket/{id} with id stripped from body', async () => {
    const config = createEditTicket();
    const body = { id: '123', ticketType: 'REPAIR', vehicleIds: ['v1'] } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith('/ticket/123', {
      ticketType: 'REPAIR',
      vehicleIds: ['v1'],
    });
    expect(result).toEqual({ id: '123' });
  });

  it('createUpdateTicketStatus should put only ticketStatus to /ticket/{id}/status', async () => {
    const config = createUpdateTicketStatus();
    (instance.put as any).mockResolvedValue({
      data: { ticketStatus: TicketStatus.READY },
    });

    const result = await config.mutationFn({
      id: '123',
      ticketStatus: TicketStatus.READY,
    });

    expect(instance.put).toHaveBeenCalledWith('/ticket/123/status', {
      ticketStatus: TicketStatus.READY,
    });
    expect(result).toEqual({ ticketStatus: TicketStatus.READY });
  });

  it('createDeleteTicket should delete to /ticket/{id}/hard', async () => {
    const config = createDeleteTicket();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/ticket/123/hard');
    expect(result).toBe('ok');
  });

  it('createSoftDeleteTicket should delete to /ticket/{id} without /hard', async () => {
    const config = createSoftDeleteTicket();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/ticket/123');
    expect(result).toBe('ok');
  });
});
