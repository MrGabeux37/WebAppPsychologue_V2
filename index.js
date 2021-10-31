var express = require('express');
var app = express();

var routes = require('./web/base/routes.js');

app.use('/things',routes);

app.listen(3000);
