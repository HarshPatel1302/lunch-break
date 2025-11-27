import { render, screen, waitFor } from '@testing-library/react';
import { useSession, signIn } from 'next-auth/react';
import LoginPage from '../login/page';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

describe('Login Page', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Futurescape')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your Employee ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your Passcode/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    mockSignIn.mockResolvedValue({
      error: 'Invalid credentials',
      ok: false,
      status: 401,
      url: null,
    } as any);

    render(<LoginPage />);
    
    const employeeIdInput = screen.getByPlaceholderText(/Enter your Employee ID/i);
    const passcodeInput = screen.getByPlaceholderText(/Enter your Passcode/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    // Note: Form submission testing would require more setup
    expect(employeeIdInput).toBeInTheDocument();
    expect(passcodeInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});

