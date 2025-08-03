import cloudinary from '../config/cloudinary.js';

export const streamUpload = (fileBuffer, folder = 'ASK_WEB', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType, 
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }

        console.log('Cloudinary result:', result);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};


// import cloudinary from '../config/cloudinary.js';

// export const streamUpload = (fileBuffer, folder = 'ASK_WEB') => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder },
//       (error, result) => {
//         if (error) {
//           console.error('Cloudinary upload error:', error);
//           return reject(error);
//         }

//         console.log('Cloudinary result:', result);
//         resolve(result);
//       }
//     );

//     stream.end(fileBuffer);
//   });
// };
