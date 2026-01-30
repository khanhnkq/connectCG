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
    // --- CẤU HÌNH VALIDATE ---
    const isVideo = file.type.startsWith('video/');

    // Validate file
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 
        'video/mp4', 'video/webm']; // Thêm video ;

    if (file.size > maxSize) {
        throw new Error(`Kích thước file quá lớn (Video tối đa 50MB, Ảnh 5MB). File hiện tại: ${(file.size/1024/1024).toFixed(2)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Định dạng không hỗ trợ (chỉ chấp nhận JPG, PNG, GIF, MP4, WEBM)');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    // --- XỬ LÝ ENDPOINT CHO VIDEO ---
    // Mặc định config là .../image/upload. Nếu upload video phải đổi sang .../video/upload
    let uploadEndpoint = CLOUDINARY_URL;
    if (isVideo) {
        uploadEndpoint = CLOUDINARY_URL.replace("/image/upload", "/video/upload");
    }

    try {
        const response = await axios.post(uploadEndpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data.secure_url;
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
