import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../app/page';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

// Mock Firebase
jest.mock('../lib/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  RecaptchaVerifier: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
}));

describe('Home (Login Page)', () => {
  it('renders the ExperienceYourTravel logo heading', () => {
    render(<Home />);
    const heading = screen.getByText('ExperienceYourTravel');
    expect(heading).toBeInTheDocument();
  });

  it('renders the phone number input form', () => {
    render(<Home />);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    expect(phoneInput).toBeInTheDocument();
  });

  it('has an accessible skip button', () => {
    render(<Home />);
    const skipButton = screen.getByRole('button', { name: /Skip for Hackathon Demo/i });
    expect(skipButton).toBeInTheDocument();
  });
});
