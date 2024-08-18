import '@testing-library/jest-dom';

vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: vi.fn(),
      replace: vi.fn(),
    };
  },
  usePathname: vi.fn().mockReturnValue('/'),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));
