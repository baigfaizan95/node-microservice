import { Router } from 'express';

import { getAll } from '@controllers/users.controller';

const route = Router();

route.get('/', getAll);

export default route;
