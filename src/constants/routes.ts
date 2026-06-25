export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  CATEGORIES: '/categories',
  DASHBOARD: '/dashboard',
  ENTERTAINMENT: '/entertainment',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
