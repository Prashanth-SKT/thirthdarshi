/** Reserved for web admin only — block this email on the mobile app */
export const ADMIN_EMAIL = 'admin@temple.com';

export function isAdminEmail(email) {
  if (!email || typeof email !== 'string') {return false;}
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
