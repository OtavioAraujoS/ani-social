import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (
  imageBase64Path: string,
  folder: string,
): Promise<string> => {
  const base64Regex = /^data:image\/[a-zA-Z]+;base64,/;
  if (!base64Regex.test(imageBase64Path)) {
    throw new Error(
      "Payload de imagem inválido. Apenas URIs completas contendo data:image/[ext];base64, são suportadas.",
    );
  }

  const uploadResult = await cloudinary.uploader.upload(imageBase64Path, {
    folder,
  });
  return uploadResult.secure_url;
};

export default cloudinary;
