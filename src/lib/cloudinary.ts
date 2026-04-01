import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (
  imageSource: string,
  folder: string,
): Promise<string> => {
  const base64Regex = /^data:image\/[a-zA-Z]+;base64,/;
  const isUrl =
    imageSource.startsWith("http://") || imageSource.startsWith("https://");

  if (!base64Regex.test(imageSource) && !isUrl) {
    throw new Error(
      "Payload de imagem inválido. Apenas URIs base64 (data:image/[ext];base64,) ou URLs (http/https) são suportadas.",
    );
  }

  const uploadResult = await cloudinary.uploader.upload(imageSource, {
    folder,
  });
  return uploadResult.secure_url;
};

export default cloudinary;
