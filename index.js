const express = require('express');
const port = process.env.PORT || 3000;
var routes = require('./web/base/routes.js');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbsHelpers = require('./public/hbsHelpers/helpers');

const app = express();

//to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

//To parse cookies from the HTTP Request
app.use(cookieParser());

app.engine('hbs', exphbs({
  extname:'.hbs',
  layoutsDir: './public/views/layouts',
  partialsDir: './public/views/partials',
  helpers: hbsHelpers
}));


app.set('view engine' , 'hbs');

//serves static files
app.use(express.static('public'));

//load routes
app.use('/',routes);

//respond to page not found
app.use(function(req, res, next){
  res.status(404);
  res.render('../public/views/main/404',{
    layout:"main",
    message:"Page introuvable"
  })

});

//Puts app online
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});
