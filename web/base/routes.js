'use stict'

var routeBase = require('./routing/base.js');
var routePsycho = require('./routing/psychologue/routePsycho.js');
var routeClient = require('./routing/routeClient.js');
var routeCalendrierPsycho = require('./routing/psychologue/calendrierPsycho.js');


module.exports = [].concat(routeBase,routePsycho,routeClient,routeCalendrierPsycho);
