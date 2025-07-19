import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Promisify fs functions
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

/**
 * Delete a file from the filesystem
 * @param filePath - Path to the file
 * @returns Promise<boolean> - True if file was deleted, false otherwise
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    // If filePath is a URL, extract the path part
    if (filePath.startsWith('/uploads/')) {
      filePath = path.join(__dirname, '../../uploads', filePath.replace(/^\/uploads\//, ''));
    }

    // Check if file exists
    const exists = await existsAsync(filePath);
    if (!exists) {
      console.log(`File not found: ${filePath}`);
      return false;
    }

    // Delete file
    await unlinkAsync(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
    return false;
  }
};

/**
 * Ensure a directory exists, create it if it doesn't
 * @param dirPath - Path to the directory
 * @returns Promise<boolean> - True if directory exists or was created, false otherwise
 */
export const ensureDirectoryExists = async (dirPath: string): Promise<boolean> => {
  try {
    // Check if directory exists
    const exists = await existsAsync(dirPath);
    if (exists) return true;

    // Create directory recursively
    await mkdirAsync(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Error creating directory: ${dirPath}`, error);
    return false;
  }
};

/**
 * Get file extension from filename or path
 * @param filename - Filename or path
 * @returns string - File extension without dot
 */
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).slice(1).toLowerCase();
};

/**
 * Check if file is an image based on extension
 * @param filename - Filename or path
 * @returns boolean - True if file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
};

/**
 * Check if file is a video based on extension
 * @param filename - Filename or path
 * @returns boolean - True if file is a video
 */
export const isVideoFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext);
};

/**
 * Check if file is a document based on extension
 * @param filename - Filename or path
 * @returns boolean - True if file is a document
 */
export const isDocumentFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext);
};

/**
 * Generate a unique filename with original extension
 * @param originalFilename - Original filename
 * @returns string - Unique filename
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const ext = path.extname(originalFilename);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomString}${ext}`;
};