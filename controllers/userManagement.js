var pool = require('../models/connect');
var bcrypt = require('bcryptjs');

module.exports.userLogin = function(email, password, callback){
  var q = "select * from users where email='"+email+"'";
  pool.getConnection(function(error, connection){
    if(error) return callback([false,error]);
    connection.query(q,function(error,results,fields){
      connection.release();
      if(error) return callback([false,error]);
      if (results.length == 0) {
        return callback([false,'Email does not exists in Database']);
      }else {
        if (bcrypt.compareSync(password, results[0].password)) {
          return callback([true,'login successful']);
        }else {
          console.log(results);
          return callback([false,'Password wrong']);
        }
      }
    });
  });
}

module.exports.newUserRegistration = function(name,email,phno,password,callback){
  var q1 = "select * from users where email='"+email+"'";
  pool.getConnection(function(error, connection){
    if(error) return callback([false,error]);
    connection.query(q1,function(error,results,fields){
      connection.release();
      if(error) return callback([false,error]);
      if (results.length == 0) {
        var hash = bcrypt.hashSync(password, 10);
        var q2 = "insert into users (name,email,phno,password) values ('"+name+"','"+email+"','"+phno+"','"+hash+"')";
        pool.getConnection(function(error, connection){
           if(error) return callback([false,error]);
          connection.query(q2,function(error,results,fields){
            connection.release();
            if(error) return callback([false,error]);
            if (results.affectedRows === 1) {
              return callback([true,'Registration successful Please login to your account']);
            }else {
              console.log(results);
              return callback([false,'some error with Database....']);
            }
          });
        });
      }else {
        console.log(results);
        return callback([false,'Email already Registered..']);
      }
    });
  });
}

module.exports.editUserInformation = function(id,name, email, phno, callback){
  var q = "update users set name='"+name+"',phno='"+phno+"' where id="+id+" AND email='"+email+"'";
  pool.getConnection(function(error, connection){
    if(error) return callback([false,error]);
    connection.query(q,function(error,results,fields){
      connection.release();
        if(error) return callback([false,error]);
        if (results.affectedRows === 1) {
          return callback([true,'Update info successful.....']);
        }else {
          console.log(results);
          return callback([false,'some error with Database....']);
        }
    });
  });
}

module.exports.recoverPassword = function(email, phno, callback){
  var q = "select * from users where email='"+email+"' AND phno='"+phno+"'";
  pool.getConnection(function(error, connection){
    if(error) return callback([false,error,false]);
    connection.query(q,function(error,results,fields){
      connection.release();
        if(error) return callback([false,error,false]);
        if (results.length == 1) {
          return callback([true,'please reset your password....',true]);
        }else {
          console.log(results);
          return callback([false,'Invalid credentials....',false]);
        }
    });
  });
}

module.exports.resetPassword = function(email, password, callback){
  var hash = bcrypt.hashSync(password, 10);
  var q = "update users set password='"+hash+"' where email='"+email+"'";
  pool.getConnection(function(error, connection){
    if(error) return callback([false,error,false]);
    connection.query(q,function(error,results,fields){
      connection.release();
        if(error) return callback([false,error,false]);
        if (results.affectedRows === 1) {
          return callback([true,'Password reset successful please login to your account..']);
        }else {
          console.log(results);
          return callback([false,'Invalid credentials',false]);
        }
    });
  });
}
