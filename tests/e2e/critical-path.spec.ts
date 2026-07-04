import { test, expect } from '@playwright/test';

test.describe('Critical Path: Register, Login, Create Event, Dummy Payment', () => {
  const timestamp = Date.now();
  const testUser = {
    name: `User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'Password123!'
  };

  test('User should be able to register, login, create an event, and simulate payment', async ({ page, context }) => {
    // 1. Register
    await page.goto('/register');
    await page.fill('input[type="text"]', testUser.name);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Verifikasi otomatis ter-redirect ke halaman utama/dashboard setelah sukses register/login
    await expect(page).toHaveURL('/dashboard');
    
    // Verifikasi HttpOnly cookie 'jwt' ter-set di context browser
    const cookies = await context.cookies();
    const jwtCookie = cookies.find(c => c.name === 'jwt');
    expect(jwtCookie).toBeDefined();
    expect(jwtCookie?.httpOnly).toBeTruthy();

    // 2. Buat Event (Create Event)
    await page.goto('/events/create');
    await expect(page.locator('h1')).toContainText('Buat Event Baru');
    
    await page.fill('input[name="title"]', 'E2E Test Event Mabar');
    await page.selectOption('select[name="category"]', 'Game');
    await page.fill('input[name="location"]', 'Discord Server');
    // Set tanggal besok
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('input[name="eventDate"]', tomorrow.toISOString().slice(0, 16));
    
    // Buat event berbayar
    await page.fill('input[name="price"]', '50000');
    await page.fill('input[name="maxParticipants"]', '10');
    
    // Submit Event
    await page.click('button[type="submit"]');
    
    // Tunggu redirect ke halaman detail event
    await expect(page).toHaveURL(/\/events\/.+/);
    
    // Cek judul event ter-render
    await expect(page.locator('h1')).toContainText('E2E Test Event Mabar');

    // 3. (Opsional) Uji coba payment flow
    // Dalam pengujian nyata, kita bisa mock axios response dari backend
    // atau gunakan akun lain untuk klik "Bayar & Bergabung".
  });
});
