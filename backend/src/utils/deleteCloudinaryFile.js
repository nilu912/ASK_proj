import cloudinary from '../config/cloudinary.js';

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId,{ invalidate: true });
    console.log('🗑️ Deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};
