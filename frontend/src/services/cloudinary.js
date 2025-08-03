import { Cloudinary } from 'cloudinary-core'

const cloudinaryInstance = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  secure: true
})

// Cloudinary upload function
export const uploadToCloudinary = async (file, uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

export default cloudinaryInstance
