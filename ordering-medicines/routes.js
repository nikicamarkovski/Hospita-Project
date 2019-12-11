const actions = require('./actions');
const express = require('express');
const routes = express.Router();
const middleware = require('../middleware/common');   

routes.post('/order',[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor] , actions.GetOrder);
routes.delete('/order/:id' ,[middleware.checkToken,middleware.verifyToken, middleware.checkIsDoctor], actions.CancelOrder);
routes.get('/order',[middleware.checkToken,middleware.verifyToken,middleware.checkIsDoctor], actions.GetAllOrders);

module.exports = routes;