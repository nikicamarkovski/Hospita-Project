const express = require('express');
const actions = require('./actions');
const routes = express.Router();
const middleware = require('../middleware/common');

routes.get('/patients/diagnose/:desc' ,[middleware.checkToken,middleware.verifyToken], actions.Diagnose);
module.exports = routes;
