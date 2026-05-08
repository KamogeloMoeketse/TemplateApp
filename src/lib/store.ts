import { TravelForm } from '@/types/travel-form';
import { SEED_FORMS } from './mock-data';

const FORMS_KEY = 'travel_forms';
const SESSION_KEY = 'travel_session';

function isClient() {
  return typeof window !== 'undefined';
}

export function getForms(): TravelForm[] {
  if (!isClient()) return [];
  const raw = localStorage.getItem(FORMS_KEY);
  if (!raw) {
    localStorage.setItem(FORMS_KEY, JSON.stringify(SEED_FORMS));
    return SEED_FORMS;
  }
  return JSON.parse(raw) as TravelForm[];
}

export function saveForm(form: TravelForm): void {
  if (!isClient()) return;
  const forms = getForms();
  const idx = forms.findIndex((f) => f.id === form.id);
  if (idx >= 0) {
    forms[idx] = form;
  } else {
    forms.push(form);
  }
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
}

export function deleteForm(id: string): void {
  if (!isClient()) return;
  const forms = getForms().filter((f) => f.id !== id);
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
}

export function getFormById(id: string): TravelForm | undefined {
  return getForms().find((f) => f.id === id);
}

export function generateTripNo(): string {
  const year = new Date().getFullYear();
  const forms = getForms();
  const count = forms.length + 1;
  return `TRIP-${year}-${String(count).padStart(3, '0')}`;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Session helpers
export interface SessionUser {
  id: string;
  username: string;
  name: string;
  role: string;
  department?: string;
}

export function getSession(): SessionUser | null {
  if (!isClient()) return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as SessionUser;
}

export function setSession(user: SessionUser): void {
  if (!isClient()) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (!isClient()) return;
  localStorage.removeItem(SESSION_KEY);
}
