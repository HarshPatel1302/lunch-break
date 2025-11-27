import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Home Page', () => {
  it('redirects to login', async () => {
    const HomePage = (await import('../page')).default;
    HomePage();
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});

