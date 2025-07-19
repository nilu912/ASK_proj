/**
 * Generate a unique ID with a specified prefix and format
 * @param prefix - Prefix for the ID (e.g., 'REG', 'DON', 'INQ')
 * @param length - Length of the random part (default: 6)
 * @returns string - Formatted unique ID
 */
export const generateUniqueId = (prefix: string, length: number = 6): string => {
  const date = new Date();
  const dateStr = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');
  
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
  
  return `${prefix}-${dateStr}-${randomPart}`;
};

/**
 * Format date to a readable string
 * @param date - Date object or string
 * @param includeTime - Whether to include time (default: false)
 * @returns string - Formatted date string
 */
export const formatDate = (date: Date | string, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Sanitize a string for use in URLs or filenames
 * @param str - String to sanitize
 * @returns string - Sanitized string
 */
export const sanitizeString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim();
};

/**
 * Truncate a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length (default: 100)
 * @returns string - Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, length: number = 100): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Calculate pagination values
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns object - Pagination values
 */
export const calculatePagination = (page: number, limit: number, total: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const pagination: any = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  pagination.current = page;
  pagination.total = Math.ceil(total / limit);

  return {
    pagination,
    startIndex,
    endIndex,
  };
};

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns boolean - True if date is in the past
 */
export const isDatePast = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkDate < today;
};

/**
 * Check if a date is in the future
 * @param date - Date to check
 * @returns boolean - True if date is in the future
 */
export const isDateFuture = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkDate > today;
};

/**
 * Format currency amount
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns string - Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};