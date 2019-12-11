const express = require('express');
const actions = require('./actions');
const routes = express.Router();
const middleware = require('../middleware/common');
routes.get('/patients/:id/terms',[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor], actions.GetAllTerms);
routes.post('/patients/terms' ,[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor] ,actions.CreateTerm);
routes.delete('/patients/:id/terms' ,[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor], actions.DeteleTerm);
routes.patch('/patients/:patient/terms/:id' ,[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor], actions.ChangeTerm);
routes.get('/patients/:patient/terms/:id' , actions.GetSpecificTerm);
routes.get('/patients/terms',[middleware.checkToken,middleware.verifyToken,middleware.checIsPatient] , actions.FutureReservedTerms);

module.exports = routes;

