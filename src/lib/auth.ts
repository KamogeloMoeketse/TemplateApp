import { MOCK_USERS } from './mock-data';
import { setSession, clearSession, getSession, SessionUser } from './store';

export function login(username: string, password: string): SessionUser | null {
  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return null;
  const session: SessionUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    department: user.department,
  };
  setSession(session);
  return session;
}

export function logout(): void {
  clearSession();
}

export { getSession };
