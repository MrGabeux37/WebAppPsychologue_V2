var express = require('express');
var router = express.Router();

router.get('/profil_psychologue',async function(req, res){
  res.render('../public/views/psychologue/profil', {layout:'psychologue'});
});
//export this router to use in index.js
module.exports = router;
