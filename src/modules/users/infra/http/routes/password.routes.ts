import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();

/**
 * @swagger
 * /password/forgot:
 *   post:
 *     summary: Envia e-mail para recuperação de senha
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       204:
 *         description: E-mail de recuperação enviado com sucesso
 */

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
    },
  }),
  ForgotPasswordController.create,
);

/**
 * @swagger
 * /password/reset:
 *   post:
 *     summary: Redefine a senha do usuário usando um token
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 format: uuid
 *               password:
 *                 type: string
 *     responses:
 *       204:
 *         description: Senha redefinida com sucesso
 */

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
    },
  }),
  ResetPasswordController.create,
);

export default passwordRouter;
