import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import IndexController from '../controllers/IndexController';

const indexController = new IndexController();
const routes = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota principal da API
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: API Online
 */

routes.get('/', indexController.show);

routes.use('/users', usersRouter);

export default routes;
