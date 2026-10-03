import axiosClient from '../config/axiosConfig';
import { HttpClient } from './generated/http-client';
import { Auth } from './generated/Auth';
import { Post } from './generated/Post';
import { Comment } from './generated/Comment';
import { Group } from './generated/Group';
import { Report } from './generated/Report';
import { FriendRest } from './generated/FriendRest';
import { FriendRequest } from './generated/FriendRequest';
import { FriendSuggestion } from './generated/FriendSuggestion';
import { Chat } from './generated/Chat';
import { UserProfile } from './generated/UserProfile';
import { TungNotification } from './generated/TungNotification';
import { MediaUpload } from './generated/MediaUpload';
import { Hobby } from './generated/Hobby';
import { OnlineStatus } from './generated/OnlineStatus';
import { AdminUserManager } from './generated/AdminUserManager';
import { HealthCheck } from './generated/HealthCheck';

// Shared HTTP client configured with project's axiosClient
// Preserves cookies, CSRF tokens, credentials, and auto token-refresh interceptors
const httpClient = new HttpClient();
httpClient.instance = axiosClient;

// Normalize path to prevent duplicate `/api/v1/api/v1` prefix when axiosClient.baseURL already includes `/api/v1`
const rawRequest = httpClient.request.bind(httpClient);
httpClient.request = async ({ path, ...options }) => {
    let normalizedPath = path;
    const baseURL = (axiosClient.defaults && axiosClient.defaults.baseURL) || '';
    if (/\/api\/v1\/?$/.test(baseURL) && typeof normalizedPath === 'string' && normalizedPath.startsWith('/api/v1')) {
        normalizedPath = normalizedPath.replace(/^\/api\/v1/, '') || '';
    }
    return rawRequest({ path: normalizedPath, ...options });
};

export const authApi = new Auth(httpClient);
export const postApi = new Post(httpClient);
export const commentApi = new Comment(httpClient);
export const groupApi = new Group(httpClient);
export const reportApi = new Report(httpClient);
export const friendRestApi = new FriendRest(httpClient);
export const friendRequestApi = new FriendRequest(httpClient);
export const friendSuggestionApi = new FriendSuggestion(httpClient);
export const chatApi = new Chat(httpClient);
export const userProfileApi = new UserProfile(httpClient);
export const notificationApi = new TungNotification(httpClient);
export const mediaApi = new MediaUpload(httpClient);
export const hobbyApi = new Hobby(httpClient);
export const onlineStatusApi = new OnlineStatus(httpClient);
export const adminUserApi = new AdminUserManager(httpClient);
export const healthCheckApi = new HealthCheck(httpClient);

export const api = {
    auth: authApi,
    post: postApi,
    comment: commentApi,
    group: groupApi,
    report: reportApi,
    friend: friendRestApi,
    friendRequest: friendRequestApi,
    friendSuggestion: friendSuggestionApi,
    chat: chatApi,
    userProfile: userProfileApi,
    notification: notificationApi,
    media: mediaApi,
    hobby: hobbyApi,
    onlineStatus: onlineStatusApi,
    adminUser: adminUserApi,
    healthCheck: healthCheckApi,
};

export default api;
