var express = require('express');
var router = express.Router();

/*
 This simply loads the pages. Nothing else.
*/
// FORMAT THE DATE
function formatDate(d){
  var date = new Date(d)
  var dd = date.getDate(); 
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear(); 
  if(dd<10){dd='0'+dd} 
  if(mm<10){mm='0'+mm};
  return d = dd+'/'+mm+'/'+yyyy
}

// Shift 



router.get('/add', function (req, res) {
    res.render('shift', { title:"Add shift" ,user: req.user });
});


router.get('/all', function(req, res){
    res.render('allshifts', {title:"All Shifts", user: req.user});
});

router.get('/location',function(req,res){
    res.render('location');
});


module.exports = router;
