import { Router } from 'express';
import users from '@routes/users';

const route = Router();

route.use('/users', users);

export default route;
