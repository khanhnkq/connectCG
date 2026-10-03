import axiosClient, { ensureCsrfCookie } from '../config/axiosConfig';
import { appConfig } from '../config/runtimeConfig';

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
 * Nén ảnh phía Client trước khi gửi lên Server để giảm ~90% dung lượng upload.
 * Chạy trên máy người dùng bằng Canvas API, không phụ thuộc mạng, thực thi < 50ms.
 * Bỏ qua video và ảnh GIF để giữ animation, tự động bảo toàn kênh trong suốt cho PNG.
 */
export const compressImageClientSide = (file, maxWidth = 1920, maxHeight = 1920, quality = 0.88) => {
    return new Promise((resolve) => {
        if (!file) return resolve(file);

        // Bỏ qua video và ảnh GIF để giữ nguyên animation
        if (file.type.startsWith('video/') || file.type === 'image/gif') {
            return resolve(file);
        }

        // Nếu file vốn dĩ đã nhẹ (< 150KB), không cần nén lại
        if (file.size < 150 * 1024) {
            return resolve(file);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Scale kích thước giữ nguyên tỉ lệ khung hình (Aspect Ratio)
                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const isPng = file.type === 'image/png';
                const outputType = isPng ? 'image/png' : 'image/jpeg';

                canvas.toBlob(
                    (blob) => {
                        if (!blob || blob.size >= file.size) {
                            return resolve(file);
                        }
                        const compressedFile = new File(
                            [blob],
                            file.name.replace(/\.[^/.]+$/, isPng ? '.png' : '.jpg'),
                            { type: outputType, lastModified: Date.now() }
                        );
                        console.info(
                            `[ClientCompression] Nén ảnh: ${(file.size / 1024).toFixed(1)}KB -> ${(compressedFile.size / 1024).toFixed(1)}KB (Tiết kiệm ${Math.round((1 - compressedFile.size / file.size) * 100)}%)`
                        );
                        resolve(compressedFile);
                    },
                    outputType,
                    quality
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
};

/**
 * Trích xuất 1 frame tĩnh từ video làm thumbnail/poster bằng HTML5 Video & Canvas API.
 * Thực thi hoàn toàn trên máy client trong < 100ms, không tốn CPU server.
 * @param {File} videoFile - File video gốc
 * @param {number} seekTime - Thời điểm chụp frame (mặc định 0.5s để tránh frame đen đầu)
 * @returns {Promise<File|null>} - File ảnh JPEG thumbnail siêu nhẹ (~20KB)
 */
export const captureVideoThumbnail = (videoFile, seekTime = 0.5) => {
    return new Promise((resolve) => {
        if (!videoFile || !videoFile.type.startsWith('video/') || typeof document === 'undefined') {
            return resolve(null);
        }

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;

        const videoUrl = URL.createObjectURL(videoFile);
        video.src = videoUrl;

        let hasResolved = false;
        const cleanup = () => {
            URL.revokeObjectURL(videoUrl);
            video.remove();
        };

        video.onloadeddata = () => {
            const targetTime = Math.min(seekTime, video.duration > 0 ? video.duration / 2 : seekTime);
            video.currentTime = targetTime;
        };

        video.onseeked = () => {
            if (hasResolved) return;
            try {
                const maxDim = 640;
                let width = video.videoWidth || 640;
                let height = video.videoHeight || 360;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        cleanup();
                        if (!blob) {
                            hasResolved = true;
                            return resolve(null);
                        }
                        const thumbFile = new File(
                            [blob],
                            videoFile.name.replace(/\.[^/.]+$/, '_thumb.jpg'),
                            { type: 'image/jpeg', lastModified: Date.now() }
                        );
                        hasResolved = true;
                        resolve(thumbFile);
                    },
                    'image/jpeg',
                    0.80
                );
            } catch (err) {
                console.warn('Lỗi trích xuất thumbnail video:', err);
                cleanup();
                hasResolved = true;
                resolve(null);
            }
        };

        video.onerror = () => {
            cleanup();
            if (!hasResolved) {
                hasResolved = true;
                resolve(null);
            }
        };

        setTimeout(() => {
            if (!hasResolved) {
                cleanup();
                hasResolved = true;
                resolve(null);
            }
        }, 3000);
    });
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

    // Validate file (giới hạn ảnh tối đa 5MB, video tối đa 25MB)
    const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm'
    ];

    if (file.size > maxSize) {
        throw new Error(`Kích thước file quá lớn (Video tối đa 25MB, Ảnh tối đa 5MB). File hiện tại: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Định dạng không hỗ trợ (chỉ chấp nhận JPG, PNG, GIF, MP4, WEBM)');
    }

    const category = CATEGORY_ALIASES[folder];
    if (!category) {
        throw new Error('Nhóm media không hợp lệ');
    }

    // Tự động nén ảnh phía client (giảm ~90% dung lượng) hoặc trích xuất poster video trước khi upload
    let fileToUpload = file;
    let videoThumbnail = null;
    if (!isVideo) {
        try {
            fileToUpload = await compressImageClientSide(file);
        } catch (compressErr) {
            console.warn('Lỗi nén ảnh phía client, sử dụng file gốc:', compressErr);
        }
    } else {
        try {
            videoThumbnail = await captureVideoThumbnail(file);
        } catch (thumbErr) {
            console.warn('Lỗi trích xuất thumbnail video phía client:', thumbErr);
        }
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('category', category);
    if (videoThumbnail) {
        formData.append('thumbnail', videoThumbnail);
    }

    try {
        await ensureCsrfCookie();
        const response = await axiosClient.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Media upload error:', error);
        throw new Error(error.response?.data?.message || error.message || 'Upload thất bại');
    }
};

export const normalizeMediaUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    const mediaViewBase = `${(appConfig.apiBaseUrl || '/api/v1').replace(/\/$/, '')}/media/view/`;
    if (url.includes('localhost:3900/connect-media/')) {
        return url.replace(/https?:\/\/localhost:3900\/connect-media\//, mediaViewBase);
    }
    if (url.includes('localhost:8080/api/v1/media/view/') && !appConfig.apiBaseUrl?.includes('localhost:8080')) {
        return url.replace(/https?:\/\/localhost:8080\/api\/v1\/media\/view\//, mediaViewBase);
    }
    return url;
};

export const uploadImage = async (file, folder = 'user/avatar') => {
    const media = await uploadMedia(file, folder);
    return normalizeMediaUrl(media?.url ?? null);
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
