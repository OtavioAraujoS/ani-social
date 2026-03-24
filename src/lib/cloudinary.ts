import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (
  imageBase64Path: string,
  folder: string
): Promise<string> => {
  const uploadResult = await cloudinary.uploader.upload(imageBase64Path, {
    folder,
  });
  return uploadResult.secure_url;
};

export default cloudinary;
