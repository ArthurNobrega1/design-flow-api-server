import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import AuthMiddleware from '@shared/infra/http/middlewares/AuthMiddleware';
import CommentsController from '../controllers/CommentsController';

const commentsRouter = Router();

commentsRouter.use(AuthMiddleware);

/**
 * @swagger
 * /comments/:
 *   post:
 *     summary: Cria um novo comentário
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               post_id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 */

commentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      content: Joi.string().required(),
      post_id: Joi.string().uuid().required(),
      active: Joi.boolean(),
    },
  }),
  CommentsController.create,
);

/**
 * @swagger
 * /comments/:
 *   put:
 *     summary: Atualiza um comentário existente
 *     tags: [Comments]
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
 *               content:
 *                 type: string
 *               post_id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso
 */

commentsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      content: Joi.string(),
      post_id: Joi.string().uuid(),
      active: Joi.boolean(),
    },
  }),
  CommentsController.update,
);

/**
 * @swagger
 * /comments/:
 *   get:
 *     summary: Obtém comentários filtrados
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do comentário
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Lista de comentários
 */

commentsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid(),
      user_id: Joi.string().uuid(),
      post_id: Joi.string().uuid(),
    },
  }),
  CommentsController.show,
);

/**
 * @swagger
 * /comments/:
 *   delete:
 *     summary: Remove um comentário
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do comentário a ser removido
 *     responses:
 *       204:
 *         description: Comentário removido com sucesso
 */

commentsRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  CommentsController.delete,
);

export default commentsRouter;
