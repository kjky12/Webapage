// server/server.js
var express = require('express');
var app     = express();
var path    = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

//! 패스포트
var flash     = require("connect-flash");
var session    = require("express-session");
var passport   = require("./config/passport"); // 1


// Database
mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGO_DB, {useMongoClient: true});
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open', function () {
   console.log('DB connected!');
});
db.on('error', function (err) {
  console.log('DB ERROR:', err);
});


// Passport // 2
app.use(passport.initialize());
app.use(passport.session()); 

// Custom Middlewares // 3
app.use(function(req,res,next){
 res.locals.isAuthenticated = req.isAuthenticated();
 res.locals.currentUser = req.user;
 next();
})

// Middlewares
/*
Access-Control-Allow-Origin: 요청이 허용되는 url을 route을 제외하고 적습니다. 이외의 url로 부터 오는 요청은 거절됩니다. 단 *은 모든 요청을 허가시킵니다.
Access-Control-Allow-Methods:요청이 허용되는 HTTP verb 목록을 적습니다. 여기에 포함되지 않은 HTTP verb의 요청은 거절됩니다. *을 사용할 수 없습니다.
Access-Control-Allow-Headers: 요청이 허용되는 HTTP header 목록을 적습니다. 여기에 포함되지 않은 HTTP header는 사용할 수 없습니다.  *을 사용할 수 없습니다.
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});




// API
/*
 flash를 초기화 합니다. 이제부터 req.flash라는 함수를 사용할 수 있습니다.
req.flash(문자열, 저장할_값) 의 형태로 저장할_값(숫자, 문자열, 오브젝트등 어떠한 값이라도 가능)을 해당 문자열에 저장합니다.
이때 flash는 배열로 저장되기 때문에 같은 문자열을 중복해서 사용하면 순서대로 배열로 저장이 됩니다.
req.flash(문자열) 인 경우 해당 문자열에 저장된 값들을 배열로 불러옵니다. 저장된 값이 없다면 빈 배열([])을 return합니다.
*/ 
app.use(flash()); 
/*
session은 서버에서 접속자를 구분시키는 역할을 합니다. user1과 user2가 웹사이트를 보고 있는 경우 해당 user들을 구분하여 
서버에서 필요한 값 들(예를 들어 로그인 상태 정보 등등)을 따로 관리하게 됩니다.
 flash에 저장되는 값 역시 user1이 생성한 flash는 user1에게, user2가 생성한 flash는 user2에게 보여져야 하기 때문에 session이 필요합니다.
*/
app.use(session({secret:"MySecret"})); // 


app.use('/api/users', require('./api/users'));
app.use('/api/login', require('./api/login'));


// Angular
app.use(express.static(path.resolve(__dirname, '../dist'))); //1
app.get('*', function (req, res) { //2
  var indexFile = path.resolve(__dirname,'../dist/index.html');
  res.sendFile(indexFile);
});

// Server
var port = 3001;
app.listen(port, function(){
  console.log('listening on port:' + port);
});
