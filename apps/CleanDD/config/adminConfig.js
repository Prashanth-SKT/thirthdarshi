/** Admin account — login only, never via Sign Up screen */
export const ADMIN_EMAIL = 'admin@temple.com';

export function isAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
