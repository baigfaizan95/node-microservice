import { init } from '@utils';
import sequelize from '@sequelize';
import mongo from '@mongo';

import routes from '@routes';

require('dotenv').config();

// Initializing express server
const app = init();

// Routes
app.use('/v1', routes);

// Initializing mongo
mongo();

// Checking sequelize connection
sequelize.checkConnection();
