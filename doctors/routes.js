const routes = require('express').Router();
const actions = require('./actions');
const middleware = require('../middleware/common')
routes.get('/doctors', actions.GetAllDoctors);
routes.put('/doctors' , actions.Update);
routes.get('/doctors/patients',[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor], actions.GetOwnPatients);
routes.post('/doctors',[middleware.checkToken,middleware.verifyToken,middleware.Admin], actions.CreateDoctor);
routes.delete('/doctors/:id',[middleware.checkToken,middleware.verifyToken,middleware.Admin], actions.DeteleDoctor );
module.exports = routes
