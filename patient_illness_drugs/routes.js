const express = require('express');
const actions = require('./actions');
const routes = express.Router();
const middleware = require('../middleware/common');

routes.get('/patients/:id/history' ,[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor]  ,actions.GetHistoryOfPatient);
routes.post('/patients/history', [middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor],actions.CreateHistory);
routes.get('/patients/history' , [middleware.checkToken,middleware.verifyToken,middleware.checIsPatient],actions.GetOwnHistory )
module.exports = routes;
