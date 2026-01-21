import axios from 'axios';
import { CLOUDINARY_URL, UPLOAD_PRESET } from '../config/cloundinaryConfig';

/**
 * Upload ảnh lên Cloudinary
 * @param {File} file - File ảnh cần upload
 * @param {string} folder - Thư mục lưu trữ (mặc định: user/avatar)
 * @returns {Promise<string>} - URL của ảnh đã upload
 */
export const uploadImage = async (file, folder = 'user/avatar') => {
    if (!file) return null;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > maxSize) {
        throw new Error('Kích thước ảnh không được vượt quá 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Chỉ hỗ trợ định dạng JPG, PNG, WebP, GIF');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.secure_url; // URL HTTPS của ảnh
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(error.response?.data?.message || 'Upload thất bại');
    }
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
