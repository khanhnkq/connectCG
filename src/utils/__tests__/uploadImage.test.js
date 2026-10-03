import { describe, it, expect } from 'vitest';
import { normalizeMediaUrl } from '../uploadImage';
import { appConfig } from '../../config/runtimeConfig';

describe('normalizeMediaUrl', () => {
    it('should return null or non-string inputs as is', () => {
        expect(normalizeMediaUrl(null)).toBeNull();
        expect(normalizeMediaUrl(undefined)).toBeUndefined();
        expect(normalizeMediaUrl('')).toBe('');
    });

    it('should normalize local minio URL to dynamic apiBaseUrl endpoint', () => {
        const rawUrl = 'http://localhost:3900/connect-media/avatar-123.jpg';
        const normalized = normalizeMediaUrl(rawUrl);
        const expectedBase = `${appConfig.apiBaseUrl.replace(/\/$/, '')}/media/view/`;
        expect(normalized).toBe(`${expectedBase}avatar-123.jpg`);
    });

    it('should preserve external cdn URLs untouched', () => {
        const externalUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
        expect(normalizeMediaUrl(externalUrl)).toBe(externalUrl);
    });
});
