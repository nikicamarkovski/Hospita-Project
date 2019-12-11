const express = require('express');
const bodyParser = require('body-parser');
const appRouter = require('./mainRouter');
const app = express();
const middleware = require('./middleware/common');
var jwt = require('express-jwt');
var unless = require('express-unless')


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(appRouter);
app.use(jwt({ secret: 'login'}).unless({path: ['/login']}));
app.use(middleware.WrongRoute);
app.use(middleware.errorHandler);


const port =  3356;

    app.listen(port, () => {
        console.log(`API is listenig on port ${port}!`);
    });
    