require('dotenv').config();

import { init } from "@utils";
import sequelize from '@sequelize';
import mongo from '@mongo';

import routes from '@routes';

// Initializing express server
const app = init();

// Routes
app.use('/v1', routes);

// Initializing mongo
mongo();

// Checking sequelize connection
sequelize.checkConnection();
