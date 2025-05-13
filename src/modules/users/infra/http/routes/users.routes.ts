import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import AuthMiddleware from '@shared/infra/http/middlewares/AuthMiddleware';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();

/**
 * @swagger
 * /users/:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               fullname:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               birthday:
 *                 type: string
 *               permission:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      bio: Joi.string().allow(null),
      birthday: Joi.string().allow(null),
      email: Joi.string().required(),
      username: Joi.string().required(),
      fullname: Joi.string().required(),
      password: Joi.string().required(),
      permission: Joi.string().allow(null),
      active: Joi.boolean(),
    },
  }),
  UsersController.create,
);

/**
 * @swagger
 * /users/:
 *   put:
 *     summary: Atualiza as informações de um usuário
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               fullname:
 *                 type: string
 *               bio:
 *                 type: string
 *               birthday:
 *                 type: string
 *               permission:
 *                 type: string
 *               is_private:
 *                 type: boolean
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Informações do usuário atualizadas com sucesso
 */

usersRouter.put(
  '/',
  AuthMiddleware,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      bio: Joi.string().allow(null),
      birthday: Joi.string().allow(null),
      email: Joi.string(),
      username: Joi.string(),
      fullname: Joi.string(),
      permission: Joi.string(),
      is_private: Joi.boolean(),
      active: Joi.boolean(),
    },
  }),
  UsersController.update,
);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Obtém informações de usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Nome de usuário
 *       - in: query
 *         name: birthday
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de nascimento do usuário
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: E-mail do usuário
 *       - in: query
 *         name: fullname
 *         schema:
 *           type: string
 *         description: Nome completo do usuário
 *       - in: query
 *         name: permission
 *         schema:
 *           type: string
 *         description: Permissão do usuário
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Status ativo do usuário
 *     responses:
 *       200:
 *         description: Informações do usuário
 */

usersRouter.get(
  '/',
  AuthMiddleware,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid(),
      birthday: Joi.string(),
      email: Joi.string(),
      username: Joi.string(),
      fullname: Joi.string(),
      permission: Joi.string(),
    },
  }),
  UsersController.show,
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 */

usersRouter.get('/me', AuthMiddleware, UsersController.me);

/**
 * @swagger
 * /users/:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do usuário a ser removido
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 */

usersRouter.delete(
  '/',
  AuthMiddleware,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  UsersController.delete,
);

export default usersRouter;
