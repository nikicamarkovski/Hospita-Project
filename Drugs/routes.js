const express = require('express');
const actions = require('./actions')
const routes = express.Router();

const middleware = require('../middleware/common');

routes.get('/drugs/:name' , [middleware.checkToken,middleware.verifyToken],actions.NumberOfMedications);

module.exports = routes;
