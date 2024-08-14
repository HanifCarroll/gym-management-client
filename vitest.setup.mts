import '@testing-library/jest-dom';

// Mock useRouter:
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: vi.fn(),
      replace: vi.fn(),
    };
  },
  usePathname: vi.fn().mockReturnValue('/'),
}));
