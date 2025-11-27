import { POST, GET, DELETE } from '../employees/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
jest.mock('bcryptjs');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('/api/employees', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('creates employee for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin1', employeeId: 'ADMIN', name: 'Admin', role: 'ADMIN' },
      } as any);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test Employee',
        employeeId: '01',
        role: 'EMPLOYEE',
      });

      // Mock findFirst to return null (no existing employees)
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      
      const req = {
        json: async () => ({
          name: 'Test Employee',
          passcode: 'password123',
        }),
      } as any;

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('employeeId');
      expect(data.employeeId).toMatch(/^\d{2}$/); // Should be 2-digit format like 01
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('returns 401 for non-admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1', employeeId: 'EMP001', name: 'User', role: 'EMPLOYEE' },
      } as any);

      const req = {
        json: async () => ({
          name: 'Test',
          passcode: 'pass',
        }),
      } as any;

      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it('returns 400 for missing fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin1', employeeId: 'ADMIN', name: 'Admin', role: 'ADMIN' },
      } as any);

      // Missing passcode
      const req = {
        json: async () => ({ name: 'Test' }),
      } as any;

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe('GET', () => {
    it('returns employees list for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin1', employeeId: 'ADMIN', name: 'Admin', role: 'ADMIN' },
      } as any);

      (prisma.user.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Employee 1', employeeId: 'EMP001' },
      ]);

      const req = {} as any;
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('DELETE', () => {
    it('deletes employee for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin1', employeeId: 'ADMIN', name: 'Admin', role: 'ADMIN' },
      } as any);

      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      const req = {
        url: 'http://localhost:3000/api/employees?id=1',
      } as any;
      const response = await DELETE(req);

      expect(response.status).toBe(200);
      expect(prisma.user.delete).toHaveBeenCalled();
    });
  });
});

