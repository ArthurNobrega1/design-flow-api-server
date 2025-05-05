import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import AuthMiddleware from '@shared/infra/http/middlewares/AuthMiddleware';
import PostsController from '../controllers/PostsController';

const postsRouter = Router();

postsRouter.use(AuthMiddleware);

/**
 * @swagger
 * /posts/:
 *   post:
 *     summary: Cria uma nova postagem
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Postagem criada com sucesso
 */

postsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      user_id: Joi.string().uuid().required(),
      active: Joi.boolean(),
    },
  }),
  PostsController.create,
);

/**
 * @swagger
 * /posts/:
 *   put:
 *     summary: Atualiza uma postagem existente
 *     tags: [Posts]
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
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Postagem atualizada com sucesso
 */

postsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      title: Joi.string(),
      user_id: Joi.string().uuid(),
      active: Joi.boolean(),
    },
  }),
  PostsController.update,
);

/**
 * @swagger
 * /posts/:
 *   get:
 *     summary: Obtém postagens filtradas
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do post
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Status ativo da postagem
 *     responses:
 *       200:
 *         description: Lista de postagens
 */

postsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid(),
      title: Joi.string(),
      user_id: Joi.string().uuid(),
      active: Joi.boolean(),
    },
  }),
  PostsController.show,
);

/**
 * @swagger
 * /posts/:
 *   delete:
 *     summary: Remove uma postagem
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do post a ser removido
 *     responses:
 *       204:
 *         description: Postagem removida com sucesso
 */

postsRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  PostsController.delete,
);

export default postsRouter;
