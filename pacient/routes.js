const express = require('express');
const actions = require('./actions');
const routes = express.Router();
const middleware = require('../middleware/common')                  

routes.get('/patients',[middleware.checkToken,middleware.verifyToken],actions.GetAllPatients);
routes.get('/patients/:id',[middleware.checkToken,middleware.verifyToken] , actions.GetSpecificPatient);
routes.post('/patients',[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor] , actions.NewPatient);
routes.delete('/patients/:id',[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor] , actions.DetelePatient);
routes.put('/patients', actions.UpdatePatient);
routes.post('/login' , actions.Login);

module.exports = routes;
