import { Router } from 'express';
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

export default routes;
