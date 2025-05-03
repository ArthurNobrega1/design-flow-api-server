import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
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
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);

export default routes;
