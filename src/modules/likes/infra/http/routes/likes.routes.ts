import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AuthMiddleware from '@shared/infra/http/middlewares/AuthMiddleware';
import LikesController from '../controllers/LikesController';

const likesRouter = Router();

likesRouter.use(AuthMiddleware);

/**
 * @swagger
 * /likes/:
 *   post:
 *     summary: Cria uma nova curtida
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: string
 *                 format: uuid
 *               comment_id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Curtida criada com sucesso
 */
likesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      post_id: Joi.string().uuid(),
      comment_id: Joi.string().uuid(),
      active: Joi.boolean(),
    },
  }),
  LikesController.create,
);

/**
 * @swagger
 * /likes/:
 *   put:
 *     summary: Atualiza a curtida
 *     tags: [Likes]
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
 *         description: Curtida atualizada com sucesso
 */
likesRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      active: Joi.boolean(),
    },
  }),
  LikesController.update,
);

/**
 * @swagger
 * /likes/:
 *   get:
 *     summary: Obtém curtidas filtradas
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da curtida
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de quem curtiu
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da postagem curtida
 *       - in: query
 *         name: comment_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do comentário curtido
 *     responses:
 *       200:
 *         description: Lista de curtidas
 */
likesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid(),
      user_id: Joi.string().uuid(),
      post_id: Joi.string().uuid(),
      comment_id: Joi.string().uuid(),
    },
  }),
  LikesController.show,
);

/**
 * @swagger
 * /likes/:
 *   delete:
 *     summary: Remove uma curtida
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da curtida a ser removida
 *     responses:
 *       204:
 *         description: Curtida removida com sucesso
 */
likesRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  LikesController.delete,
);

export default likesRouter;
