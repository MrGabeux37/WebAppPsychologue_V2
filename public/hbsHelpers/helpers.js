/*
Handlebars.registerHelper('ifEqual', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  else{
    return options.inverse(this);
  }
})
*/


module.exports = {
  ifEqual: function(a, b, options){
    if (a === b) {
      return options.fn(this);
      }
    return options.inverse(this);
  }
}
