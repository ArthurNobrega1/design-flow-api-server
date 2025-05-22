import { Router } from 'express';

import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';
import AuthMiddleware from '@shared/infra/http/middlewares/AuthMiddleware';
import multer from 'multer';
import FilesController from '../controllers/FilesController';

const upload = multer(uploadConfig);

const filesRouter = Router();

filesRouter.use(AuthMiddleware);

/**
 * @swagger
 * /files/:
 *   post:
 *     summary: Cria um novo arquivo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               post_id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Arquivo criado com sucesso
 */
filesRouter.post(
  '/',
  upload.array('files'),
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.string().uuid(),
      post_id: Joi.string().uuid(),
      active: Joi.boolean(),
    },
  }),
  FilesController.create,
);

/**
 * @swagger
 * /files/:
 *   put:
 *     summary: Atualiza um arquivo existente
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Arquivo atualizado com sucesso
 */

filesRouter.put(
  '/',
  AuthMiddleware,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      active: Joi.boolean(),
    },
  }),
  FilesController.update,
);

/**
 * @swagger
 * /files/:
 *   get:
 *     summary: Obtém arquivos filtrados
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do arquivo
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         description: URL da imagem
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do dono do avatar
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da postagem
 *     responses:
 *       200:
 *         description: Lista de arquivos
 */
filesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid(),
      path: Joi.string(),
      user_id: Joi.string().uuid(),
      post_id: Joi.string().uuid(),
    },
  }),
  FilesController.show,
);

/**
 * @swagger
 * /files/:
 *   delete:
 *     summary: Remove um arquivo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do arquivo a ser removido
 *     responses:
 *       204:
 *         description: Arquivo removido com sucesso
 */
filesRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  FilesController.delete,
);

export default filesRouter;
