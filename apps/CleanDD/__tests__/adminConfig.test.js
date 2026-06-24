import { ADMIN_EMAIL, isAdminEmail } from '../config/adminConfig';

describe('adminConfig', () => {
  it('blocks the reserved admin email', () => {
    expect(isAdminEmail('admin@temple.com')).toBe(true);
    expect(isAdminEmail('  Admin@Temple.com  ')).toBe(true);
  });

  it('allows normal user emails', () => {
    expect(isAdminEmail('user@example.com')).toBe(false);
    expect(isAdminEmail('')).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });

  it('uses the expected admin email constant', () => {
    expect(ADMIN_EMAIL).toBe('admin@temple.com');
  });
});
