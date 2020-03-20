require('dotenv').config();

const { init } = require('./utils');
const { mongo } = require('./db');

// Initializing express server
init();

// Initializing mongo
mongo();