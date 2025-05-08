import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import filesRouter from '@modules/files/infra/http/routes/files.routes';
import postsRouter from '@modules/posts/infra/http/routes/posts.routes';
import commentsRouter from '@modules/comments/infra/http/routes/comments.routes';
import likesRouter from '@modules/likes/infra/http/routes/likes.routes';
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
routes.use('/files', filesRouter);
routes.use('/posts', postsRouter);
routes.use('/comments', commentsRouter);
routes.use('/likes', likesRouter);

export default routes;
