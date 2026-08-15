import axiosClient from '../config/axiosConfig';

const CATEGORY_ALIASES = {
    'user/avatar': 'avatar',
    'user/cover': 'cover',
    posts: 'post',
    comments: 'comment',
    'group/img': 'group',
    'chat/images': 'chat',
    'chat/avatar': 'chat',
};

/**
 * Upload ảnh/video qua backend media API. Storage credential không xuất hiện ở frontend.
 * @param {File} file - File ảnh cần upload
 * @param {string} folder - Thư mục lưu trữ (mặc định: user/avatar)
 * @returns {Promise<string>} - URL của ảnh đã upload
 */
export const uploadMedia = async (file, folder = 'user/avatar') => {
    if (!file) return null;
    // --- CẤU HÌNH VALIDATE ---
    const isVideo = file.type.startsWith('video/');

    // Validate file
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm']; // Thêm video ;

    if (file.size > maxSize) {
        throw new Error(`Kích thước file quá lớn (Video tối đa 50MB, Ảnh 5MB). File hiện tại: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Định dạng không hỗ trợ (chỉ chấp nhận JPG, PNG, GIF, MP4, WEBM)');
    }

    const category = CATEGORY_ALIASES[folder];
    if (!category) {
        throw new Error('Nhóm media không hợp lệ');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
        const response = await axiosClient.post('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Media upload error:', error);
        throw new Error(error.response?.data?.message || error.message || 'Upload thất bại');
    }
};

export const uploadImage = async (file, folder = 'user/avatar') => {
    const media = await uploadMedia(file, folder);
    return media?.url ?? null;
};

/**
 * Upload avatar người dùng
 * @param {File} file - File ảnh avatar
 * @returns {Promise<string>} - URL của avatar
 */
export const uploadAvatar = async (file) => {
    return uploadImage(file, 'user/avatar');
};

/**
 * Upload ảnh cover
 * @param {File} file - File ảnh cover
 * @returns {Promise<string>} - URL của cover
 */
export const uploadCover = async (file) => {
    return uploadImage(file, 'user/cover');
};

/**
 * Upload ảnh bài đăng
 * @param {File} file - File ảnh bài đăng
 * @returns {Promise<string>} - URL của ảnh
 */
export const uploadPostImage = async (file) => {
    return uploadImage(file, 'posts');
};
/**
 * Upload ảnh bìa nhóm
 * @param {File} file - File ảnh bìa nhóm
 * @returns {Promise<string>} - URL của ảnh bìa nhóm
 */
export const uploadGroupCover = async (file) => {
    return uploadImage(file, 'group/img');
};

export const uploadPostMedia = async (file) => {
    return uploadImage(file, 'posts'); // Lưu vào folder 'posts'
};

/**
 * Upload hình ảnh chat
 * @param {File} file - File hình ảnh chat
 * @returns {Promise<string>} - URL của hình ảnh
 */
export const uploadChatImage = async (file) => {
    return uploadImage(file, 'chat/images');
};
