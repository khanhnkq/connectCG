import { describe, it, expect, vi } from 'vitest';
import api, { postApi, reportApi, friendRestApi, authApi, groupApi, commentApi } from '../index';
import postService from '../../services/PostService';
import reportService from '../../services/ReportService';
import FriendService from '../../services/friend/FriendService';

describe('Auto-Generated API Client & Facades', () => {
    it('should export all API instances and main api bundle', () => {
        expect(api).toBeDefined();
        expect(postApi).toBeDefined();
        expect(reportApi).toBeDefined();
        expect(friendRestApi).toBeDefined();
        expect(authApi).toBeDefined();
        expect(groupApi).toBeDefined();
        expect(commentApi).toBeDefined();
    });

    it('should contain expected auto-generated operations on postApi', () => {
        expect(typeof postApi.postGetNewsfeedPosts).toBe('function');
        expect(typeof postApi.postCreatePost).toBe('function');
        expect(typeof postApi.postGetPostById).toBe('function');
        expect(typeof postApi.postUpdatePost).toBe('function');
        expect(typeof postApi.postDeletePost).toBe('function');
        expect(typeof postApi.postReactToPost).toBe('function');
    });

    it('should delegate PostService calls to postApi SDK', async () => {
        const spy = vi.spyOn(postApi, 'postGetPostById').mockResolvedValueOnce({
            data: { id: 999, content: 'Test post' }
        });

        const result = await postService.getPostById(999);
        expect(spy).toHaveBeenCalledWith({ id: 999 });
        expect(result.data.id).toBe(999);

        spy.mockRestore();
    });

    it('should delegate ReportService calls to reportApi SDK', async () => {
        const spy = vi.spyOn(reportApi, 'reportGetReportDetail').mockResolvedValueOnce({
            data: { id: 10, reason: 'Spam' }
        });

        const result = await reportService.getReportById(10);
        expect(spy).toHaveBeenCalledWith({ id: 10 });
        expect(result.data.reason).toBe('Spam');

        spy.mockRestore();
    });

    it('should delegate FriendService calls to friendRestApi SDK', async () => {
        const spy = vi.spyOn(friendRestApi, 'friendrestGetFriendsByUserId').mockResolvedValueOnce({
            data: [{ id: 1, fullName: 'Friend A' }]
        });

        const result = await FriendService.getFriends(42, { page: 0, size: 5 });
        expect(spy).toHaveBeenCalledWith({ userId: 42, page: 0, size: 5, name: undefined, gender: undefined, cityId: undefined });
        expect(result.data).toHaveLength(1);

        spy.mockRestore();
    });

    describe('End-to-End Axios Integration & URL Resolution Proof', () => {
        it('proves postService.getPostById calls axiosClient with normalized /posts/:id and resolves to /api/v1/posts/:id', async () => {
            const axiosClient = (await import('../../config/axiosConfig')).default;
            const requestSpy = vi.spyOn(axiosClient, 'request').mockResolvedValueOnce({
                data: { id: 123, content: 'Verified post data' },
                status: 200,
                statusText: 'OK',
            });

            const response = await postService.getPostById(123);

            expect(requestSpy).toHaveBeenCalledTimes(1);
            const callConfig = requestSpy.mock.calls[0][0];

            // Verify the request URL dispatched to axiosClient is normalized (no duplicate /api/v1)
            expect(callConfig.url).toBe('/posts/123');
            expect(callConfig.method).toBe('GET');

            // Verify Axios resolves full path matching Spring Boot @RequestMapping("/api/v1/posts/{id}")
            const fullUri = axiosClient.getUri(callConfig);
            expect(fullUri).toBe(`${axiosClient.defaults.baseURL}/posts/123`);
            expect(fullUri).not.toContain('/api/v1/api/v1');

            expect(response.data.id).toBe(123);
            requestSpy.mockRestore();
        });

        it('proves postApi.postGetNewsfeedPosts sends query params to normalized /posts endpoint', async () => {
            const axiosClient = (await import('../../config/axiosConfig')).default;
            const requestSpy = vi.spyOn(axiosClient, 'request').mockResolvedValueOnce({
                data: { content: [{ id: 1 }] },
                status: 200,
            });

            await postApi.postGetNewsfeedPosts({ page: 0, size: 10 });

            expect(requestSpy).toHaveBeenCalledTimes(1);
            const callConfig = requestSpy.mock.calls[0][0];

            expect(callConfig.url).toBe('/posts');
            expect(callConfig.params).toEqual({ page: 0, size: 10 });

            const fullUri = axiosClient.getUri(callConfig);
            expect(fullUri).toBe(`${axiosClient.defaults.baseURL}/posts?page=0&size=10`);
            expect(fullUri).not.toContain('/api/v1/api/v1');

            requestSpy.mockRestore();
        });
    });
});
