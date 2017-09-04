var express = require('express');
var userManagement = require('../controllers/userManagement');
var router = express.Router();

router.get('/', function(req,res){
  res.render('login',{error:'',success:''});
});

router.post('/', function(req,res){
  var email = req.body.userid.trim();
  var password = req.body.password.trim();
  req.check("userid", "Enter a valid email address.").isEmail();
  req.check('password', 'Password Incorrect').len(8, 30);
  var error = [];
  var errors = req.validationErrors();
  if (errors) {
    res.render('login',{error:errors,success:''});
  }
  else {
    userManagement.userLogin(email, password, function(callback){
          if (callback[0] == true) {
            // res.send("login success....Dashboard come here....");
              res.render('login',{error:'',success:callback[1]});
          }
          else {
            error.push({msg:callback[1]});
            res.render('login',{error:error,success:''});
          }
        });
    }
});

module.exports = router;
