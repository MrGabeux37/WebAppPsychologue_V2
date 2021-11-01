var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var routes = require('./web/base/routes.js');

app.use('/',routes);

//serves static files
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
