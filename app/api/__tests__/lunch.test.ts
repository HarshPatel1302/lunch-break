import { POST, GET } from '../lunch/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    lunchUpdate: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('/api/lunch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('creates lunch update for authenticated user', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1', employeeId: 'EMP001', name: 'Test User', role: 'EMPLOYEE' },
      } as any);

      (prisma.lunchUpdate.create as jest.Mock).mockResolvedValue({
        id: '1',
        userId: 'user1',
        broughtLunch: true,
        foodRequest: null,
      });

      const req = {
        json: async () => ({ broughtLunch: true, foodRequest: null }),
      } as any;

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(prisma.lunchUpdate.create).toHaveBeenCalled();
    });

    it('returns 401 for unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = {
        json: async () => ({ broughtLunch: true }),
      } as any;

      const response = await POST(req);
      expect(response.status).toBe(401);
    });
  });

  describe('GET', () => {
    it('returns lunch updates for authenticated user', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1', employeeId: 'EMP001', name: 'Test User', role: 'EMPLOYEE' },
      } as any);

      (prisma.lunchUpdate.findMany as jest.Mock).mockResolvedValue([
        { id: '1', userId: 'user1', broughtLunch: true },
      ]);

      const req = {
        url: 'http://localhost:3000/api/lunch',
      } as any;
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('returns all updates for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin1', employeeId: 'ADMIN', name: 'Admin', role: 'ADMIN' },
      } as any);

      (prisma.lunchUpdate.findMany as jest.Mock).mockResolvedValue([
        { id: '1', userId: 'user1', broughtLunch: true },
      ]);

      const req = {
        url: 'http://localhost:3000/api/lunch?all=true',
      } as any;
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prisma.lunchUpdate.findMany).toHaveBeenCalled();
    });
  });
});

