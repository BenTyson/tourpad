import { describe, it, expect } from 'vitest';
import {
  registrationSchema,
  loginSchema,
  bookingSchema,
  profileUpdateSchema,
  validateData,
  sanitizeHtml,
  validateFileUpload,
} from '@/lib/validation';

describe('sanitizeHtml', () => {
  it('escapes HTML angle brackets', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    );
  });

  it('escapes quotes', () => {
    expect(sanitizeHtml('"hello" & \'world\'')).toBe(
      '&quot;hello&quot; & &#x27;world&#x27;'
    );
  });

  it('escapes forward slashes', () => {
    expect(sanitizeHtml('a/b/c')).toBe('a&#x2F;b&#x2F;c');
  });

  it('returns empty string unchanged', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('leaves safe text unchanged', () => {
    expect(sanitizeHtml('Hello world 123')).toBe('Hello world 123');
  });
});

describe('validateData', () => {
  it('returns success with valid data', () => {
    const result = validateData(loginSchema, {
      email: 'test@example.com',
      password: 'secret',
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ email: 'test@example.com', password: 'secret' });
  });

  it('returns errors for invalid data', () => {
    const result = validateData(loginSchema, {
      email: 'not-an-email',
      password: '',
    });
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it('returns generic error for non-Zod errors', () => {
    // Pass a schema that will throw a non-Zod error
    const badSchema = {
      parse: () => {
        throw new Error('not a zod error');
      },
    };
    const result = validateData(badSchema as any, {});
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(['Validation failed']);
  });
});

describe('registrationSchema', () => {
  const validRegistration = {
    email: 'artist@example.com',
    password: 'StrongPass1!xy',
    name: 'Test Artist',
    userType: 'artist' as const,
  };

  it('accepts valid registration', () => {
    const result = registrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      password: 'Short1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      password: 'nouppercase1!xy',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without lowercase', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      password: 'NOLOWERCASE1!XY',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without number', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      password: 'NoNumberHere!xy',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without special character', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      password: 'NoSpecialChar1xy',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      email: 'not-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid user type', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      userType: 'admin',
    });
    expect(result.success).toBe(false);
  });

  it('rejects name shorter than 2 chars', () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      name: 'A',
    });
    expect(result.success).toBe(false);
  });
});

describe('bookingSchema', () => {
  const validBooking = {
    artistId: 'artist-123',
    hostId: 'host-456',
    eventDate: '2026-06-15T19:00:00.000Z',
    duration: 120,
  };

  it('accepts valid booking', () => {
    const result = bookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it('rejects duration under 30 minutes', () => {
    const result = bookingSchema.safeParse({ ...validBooking, duration: 15 });
    expect(result.success).toBe(false);
  });

  it('rejects duration over 8 hours', () => {
    const result = bookingSchema.safeParse({ ...validBooking, duration: 500 });
    expect(result.success).toBe(false);
  });

  it('rejects missing artistId', () => {
    const result = bookingSchema.safeParse({ ...validBooking, artistId: '' });
    expect(result.success).toBe(false);
  });

  it('accepts optional message', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      message: 'Looking forward to playing!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects message over 500 chars', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      message: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe('profileUpdateSchema', () => {
  it('accepts partial update', () => {
    const result = profileUpdateSchema.safeParse({ name: 'New Name' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL in website', () => {
    const result = profileUpdateSchema.safeParse({ website: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('accepts valid social links', () => {
    const result = profileUpdateSchema.safeParse({
      socialLinks: {
        instagram: 'https://instagram.com/artist',
      },
    });
    expect(result.success).toBe(true);
  });
});

describe('validateFileUpload', () => {
  it('accepts valid image file', () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    const result = validateFileUpload(file);
    expect(result.valid).toBe(true);
  });

  it('rejects unsupported file type', () => {
    const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
    const result = validateFileUpload(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not allowed');
  });

  it('rejects files over 50MB', () => {
    const file = new File(['data'], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 51 * 1024 * 1024 });
    const result = validateFileUpload(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('50MB');
  });

  it('accepts video file', () => {
    const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' });
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 });
    const result = validateFileUpload(file);
    expect(result.valid).toBe(true);
  });

  it('accepts audio file', () => {
    const file = new File(['data'], 'song.mp3', { type: 'audio/mpeg' });
    Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 });
    const result = validateFileUpload(file);
    expect(result.valid).toBe(true);
  });
});
