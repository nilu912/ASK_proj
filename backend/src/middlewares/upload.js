import multer from 'multer';

const storage = multer.memoryStorage(); // We'll upload buffer directly to Cloudinary
const upload = multer({ storage });

export default upload;
