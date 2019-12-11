const routes = require('express').Router();
const actions = require('./actions');

routes.get('/doctors', actions.GetAllDoctors);
routes.put('/doctors' , actions.Update);
module.exports = routes

