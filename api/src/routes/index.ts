import { Router } from 'express';
import auth from './auth';
import user from './user';
import instrument from './instrument';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/instruments', instrument);

export default routes;
