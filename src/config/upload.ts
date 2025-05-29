import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';
import multer, { FileFilterCallback } from 'multer';
import AppError from '@shared/errors/AppError';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export const MAX_FILE_SIZE = 10;
export const MAX_FILES_COUNT = 4;

export default {
  tmpFolder,
  uploadFolder: path.resolve(tmpFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),

  limits: {
    fileSize: MAX_FILE_SIZE * 1024 * 1024,
    files: MAX_FILES_COUNT,
  },

  fileFilter: (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new AppError('Tipo de arquivo não permitido', 400));
    }
  },
};
