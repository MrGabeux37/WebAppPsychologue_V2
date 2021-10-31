var express = require('express');
var app = express();

var routes = require('./web/base/routes.js');

app.use('/',routes);

//serves static files
app.use(express.static('public'));

app.listen(3000);
