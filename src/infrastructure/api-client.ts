import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const MEMBERS_URL = '/members';
export const MEMBERSHIP_PLANS_URL = '/membership-plans';
export const PAYMENTS_URL = '/payments';
export const CHECK_IN_URL = '/check-in';
