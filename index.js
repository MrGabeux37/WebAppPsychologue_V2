const express = require('express');
const port = process.env.PORT || 3000;
var routes = require('./web/base/routes.js');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

//to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

//To parse cookies from the HTTP Request
app.use(cookieParser());

app.engine('hbs', exphbs({
  extname:'.hbs',
  layoutsDir: './public/views/layouts',
  partialsDir: './public/views/partials'
}));

app.set('view engine' , 'hbs');

//load routes
app.use('/',routes);

//serves static files
app.use(express.static('public'));

//Puts app online
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
