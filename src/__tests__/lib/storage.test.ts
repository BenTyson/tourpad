import { describe, it, expect } from 'vitest';
import { generateFileKey, validateFile } from '@/lib/storage';

describe('generateFileKey', () => {
  it('includes category, userId, and file extension', () => {
    const key = generateFileKey('user-123', 'photos', 'concert.jpg');
    expect(key).toMatch(/^photos\/user-123\/\d+-[a-z0-9]+\.jpg$/);
  });

  it('handles uppercase extensions', () => {
    const key = generateFileKey('user-1', 'media', 'image.PNG');
    expect(key.endsWith('.png')).toBe(true);
  });

  it('generates unique keys for same inputs', () => {
    const key1 = generateFileKey('user-1', 'photos', 'a.jpg');
    const key2 = generateFileKey('user-1', 'photos', 'a.jpg');
    expect(key1).not.toBe(key2);
  });

  it('handles filename without extension', () => {
    // When no dot in filename, pop() returns the whole filename as "extension"
    const key = generateFileKey('user-1', 'files', 'noext');
    expect(key).toMatch(/^files\/user-1\/\d+-[a-z0-9]+\.noext$/);
  });
});

describe('validateFile', () => {
  it('accepts valid JPEG by magic bytes', () => {
    // JPEG magic bytes: FF D8 FF
    const buf = Buffer.alloc(100);
    buf[0] = 0xff;
    buf[1] = 0xd8;
    buf[2] = 0xff;
    const result = validateFile(buf, 'photo.jpg');
    expect(result.valid).toBe(true);
    expect(result.contentType).toBe('image/jpeg');
  });

  it('accepts valid PNG by magic bytes', () => {
    // PNG magic bytes: 89 50 4E 47
    const buf = Buffer.alloc(100);
    buf[0] = 0x89;
    buf[1] = 0x50;
    buf[2] = 0x4e;
    buf[3] = 0x47;
    const result = validateFile(buf, 'image.png');
    expect(result.valid).toBe(true);
    expect(result.contentType).toBe('image/png');
  });

  it('rejects file exceeding size limit', () => {
    const buf = Buffer.alloc(6 * 1024 * 1024); // 6MB
    buf[0] = 0xff;
    buf[1] = 0xd8;
    buf[2] = 0xff;
    const result = validateFile(buf, 'big.jpg', 5);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('5MB');
  });

  it('falls back to file extension when magic bytes unknown', () => {
    const buf = Buffer.alloc(100); // all zeros - no known magic bytes
    const result = validateFile(buf, 'song.mp3');
    expect(result.valid).toBe(true);
    expect(result.contentType).toBe('audio/mpeg');
  });

  it('rejects unsupported file type', () => {
    const buf = Buffer.alloc(100);
    const result = validateFile(buf, 'document.txt');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported');
  });

  it('uses custom size limit', () => {
    const buf = Buffer.alloc(2 * 1024 * 1024); // 2MB
    buf[0] = 0xff;
    buf[1] = 0xd8;
    buf[2] = 0xff;
    const result = validateFile(buf, 'photo.jpg', 1);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('1MB');
  });
});
