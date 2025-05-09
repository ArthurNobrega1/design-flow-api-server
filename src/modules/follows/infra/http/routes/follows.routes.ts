import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import AuthMiddleware from '@shared/infra/http/middlewares/AuthMiddleware';
import FollowsController from '../controllers/FollowsController';

const followsRouter = Router();

followsRouter.use(AuthMiddleware);

/**
 * @swagger
 * /follows/:
 *   post:
 *     summary: Cria uma nova relação de Seguidor/Seguindo
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               following_id:
 *                 type: string
 *                 format: uuid
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Relação de Seguidor/Seguindo criada com sucesso
 */

followsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      following_id: Joi.string().uuid().required(),
      active: Joi.boolean(),
    },
  }),
  FollowsController.create,
);

/**
 * @swagger
 * /follows/:
 *   put:
 *     summary: Atualiza a relação de Seguidor/Seguindo
 *     tags: [Follows]
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
 *               follower_id:
 *                 type: string
 *                 format: uuid
 *               following_id:
 *                 type: string
 *                 format: uuid
 *               is_accepted:
 *                 type: boolean
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Relação de Seguidor/Seguindo atualizada com sucesso
 */

followsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      is_accepted: Joi.boolean(),
      active: Joi.boolean(),
    },
  }),
  FollowsController.update,
);

/**
 * @swagger
 * /follows/:
 *   get:
 *     summary: Obtém relações de Seguidor/Seguindo filtradas
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da relação de follow
 *       - in: query
 *         name: follower_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do seguidor
 *       - in: query
 *         name: following_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do seguido
 *     responses:
 *       200:
 *         description: Lista de relações de Seguidor/Seguindo
 */

followsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid(),
      follower_id: Joi.string().uuid(),
      following_id: Joi.string().uuid(),
    },
  }),
  FollowsController.show,
);

/**
 * @swagger
 * /follows/:
 *   delete:
 *     summary: Remove uma relação de Seguidor/Seguindo
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da relação de Seguidor/Seguindo a ser removida
 *     responses:
 *       204:
 *         description: Relação de Seguidor/Seguindo removida com sucesso
 */

followsRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  FollowsController.delete,
);

export default followsRouter;
