import { UserProfile } from '../types/auth';

const AUTH_STORAGE_KEY = 'agentic_matrix_auth_user';
const USERS_DB_KEY = 'agentic_matrix_registered_users';
const REMEMBER_ME_KEY = 'agentic_matrix_remember_me';

// Default mock admin user for quick testing
const DEFAULT_USER: UserProfile = {
  id: 'usr-default-01',
  name: 'Alex Rivera',
  email: 'admin@agenticmatrix.ai',
  role: 'Chief Intelligence Architect',
  createdAt: new Date().toISOString()
};

export function getRegisteredUsers(): Array<{ email: string; password: string; name: string; id: string; createdAt: string }> {
  try {
    const data = localStorage.getItem(USERS_DB_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading registered users:', err);
  }
  return [
    {
      id: 'usr-default-01',
      name: 'Alex Rivera',
      email: 'admin@agenticmatrix.ai',
      password: 'Password123!',
      createdAt: new Date().toISOString()
    }
  ];
}

export function saveRegisteredUsers(users: Array<{ email: string; password: string; name: string; id: string; createdAt: string }>) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving registered users:', err);
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading auth state:', err);
  }
  return null;
}

export function setStoredUser(user: UserProfile | null, rememberMe: boolean = true) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  } catch (err) {
    console.error('Error storing user state:', err);
  }
}

export function isRememberMeActive(): boolean {
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  } catch {
    return false;
  }
}
