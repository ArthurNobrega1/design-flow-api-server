import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'fs/promises';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  public async saveFile(file: string): Promise<string> {
    const filePath = path.resolve(uploadConfig.tmpFolder, file);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'designflow',
      resource_type: 'image',
    });

    await unlink(filePath);

    return result.secure_url;
  }

  public async deleteFile(file: string): Promise<void> {
    const publicId = this.extractPublicId(file);

    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  }

  private extractPublicId(url: string): string | null {
    const match = url.match(/\/designflow\/([^/.]+)(\.[a-z]+)?$/i);
    return match ? `designflow/${match[1]}` : null;
  }
}

export default CloudinaryStorageProvider;
