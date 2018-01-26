// server/server.js
var express = require('express');
var app     = express();
var path    = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

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
app.use('/api/users', require('./api/users')); //*


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
