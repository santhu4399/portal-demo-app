var express = require('express');
var userManagement = require('../controllers/userManagement');
var router = express.Router();

router.get('/register', function(req,res){
  res.render('register',{error:'',success:''});
});

router.post('/register', function(req,res){
  var name = req.body.name.trim();
  var email = req.body.userid.trim();
  var phno = req.body.phno.trim();
  var password = req.body.password.trim();
  var conformpassword = req.body.conformpassword.trim();
  req.check("name", "Name can not be empty").notEmpty();
  req.check("userid", "Enter a valid email address").isEmail();
  req.check("phno", "Enter a valid 10 digit mobile number").matches(/^\d{10}/g);
  req.check('password', 'pasword length should be minimum 8 characters').notEmpty().len(8, 30);
  req.check('password', 'passwords does not match with conform field').equals(conformpassword);
  var error = [];
  var errors = req.validationErrors();
  if (errors) {
    res.render('register',{error:errors,success:''});
  }
  else {
        userManagement.newUserRegistration(name, email, phno, password,function(callback){
          if (callback[0] == true) {
            res.render('login',{error:'',success:callback[1]});
          }else {
            error.push({msg:callback[1]});
            res.render('register',{error:error,success:''});
          }
        });
      }
});

router.get('/update',function(req, res){
  res.render('update',{error:'',success:''});
});

router.post('/update', function(req, res){
  var id = req.body.id.trim();
  var name = req.body.name.trim();
  var email = req.body.userid.trim();
  var phno = req.body.phno.trim();
  req.check("id", "id should be interger value").notEmpty().matches(/^\d+/g);
  req.check("name", "Name can not be empty").notEmpty();
  req.check("userid", "Enter a valid email address").isEmail();
  req.check("phno", "Enter a valid 10 digit mobile number").matches(/^\d{10}/g);
  var error = [];
  var errors = req.validationErrors();
  if (errors) {
    res.render('update',{error:errors,success:''});
  }
  else {
  userManagement.editUserInformation(id, name, email, phno, function(callback){
    if (callback[0] === true) {
      res.render('login',{error:'',success:callback[1]});
    }else {
      console.log(callback);
      error.push({msg:callback[1]});
      res.render('update',{error:error,success:''});
    }
  });
  }
});

router.get('/forgotpassword',function(req, res){
  res.render('forgotpass',{error:'',success:'',varified:false});
});

router.post('/forgotpassword',function(req, res){
    var email = req.body.userid.trim();
    var phno = req.body.phno.trim();
    req.check("userid", "Enter a valid email address").isEmail();
    req.check("phno", "Enter a valid 10 digit mobile number").matches(/^\d{10}/g);
    var error = [];
    var errors = req.validationErrors();
    if (errors) {
      res.render('forgotpass',{error:errors,success:'',varified:false});
    }
    else {
      userManagement.recoverPassword(email, phno, function(callback){
        if (callback[0] == true) {
          res.render('forgotpass',{error:'',success:callback[1],varified:callback[2]});
        }else {
          console.log(callback);
          error.push({msg:callback[1]});
          res.render('forgotpass',{error:error,success:'',varified:callback[2]});
        }
      });
    }
});

router.post('/resetpassword',function(req, res){
  var email = req.body.userid.trim();
  var password = req.body.password.trim();
  var conformpassword = req.body.conformpassword.trim();
  req.check('password', 'pasword length should be minimum 8 charecters').notEmpty().len(8, 30);
  req.check('password', 'passwords does not match with conform field').equals(conformpassword);
  var error = [];
  var errors = req.validationErrors();
  if (errors) {
    res.render('forgotpass',{error:errors,success:'',varified:true});
  }else {
          userManagement.resetPassword(email, password,function(callback){
            if (callback[0] == true) {
              res.render('login',{error:'',success:callback[1]});
            }else {
              console.log(callback);
              error.push({msg:callback[1]});
              res.render('forgotpass',{error:error,success:'',varified:callback[2]});
            }
          });
        }
});
module.exports = router;
