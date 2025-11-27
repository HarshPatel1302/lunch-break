// Prisma client is mocked in jest.setup.js
// This test verifies the mock is working
describe('Prisma Client Mock', () => {
  it('has prisma mock available', () => {
    const { prisma } = require('../prisma');
    expect(prisma).toBeDefined();
    expect(prisma).toHaveProperty('user');
    expect(prisma).toHaveProperty('lunchUpdate');
  });
});

