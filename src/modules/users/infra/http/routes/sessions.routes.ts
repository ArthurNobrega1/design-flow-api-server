import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();

/**
 * @swagger
 * /sessions/:
 *   post:
 *     summary: Cria uma nova sessão (login)
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sessão criada com sucesso
 */

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string(),
      email: Joi.string(),
      password: Joi.string().required(),
    },
  }),
  SessionsController.create,
);

export default sessionsRouter;
