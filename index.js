var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var login = require('./routes/log');
var register = require('./routes/register');
var app = express();

app.set('port',process.env.PORT||3000);
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(validator());
app.use(express.static('public'));
app.use('/login',login);
app.use('/user',register);

app.listen(app.get('port'),function(){
  console.log('server started on port '+app.get('port'));
});
