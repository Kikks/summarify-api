import { RANDOM_IMAGE_URLS } from 'src/api/lib/constants';
import cloudinary from 'src/clients/cloudinary';

const generateImage = async () => {
  const imageUrl = RANDOM_IMAGE_URLS[Math.floor(Math.random() * RANDOM_IMAGE_URLS.length)];
  const response = await cloudinary.uploader.upload(imageUrl);
  return response.secure_url;
};

export { generateImage };
