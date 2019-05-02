var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const recursiveReadSync = require('recursive-readdir-sync')
const contains = require("string-contains")
const expressValidator = require('express-validator');


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use('/', express.static(path.join(path.normalize(__dirname), '../../views/app')));
let assetName = process.env.ASSET_NAME;
console.log('ASSET_NAME ', assetName);
//'/' + assetName +'/app', 
app.use('/' + assetName +'/app', express.static(path.join(__dirname, '../../views/dist')));

app.use(expressValidator());

let routesRegisted = [];

try {
  recursiveReadSync('logic/processes').forEach(file => {
    if (!contains(file, '.gitkeep')) {

      let tempArr = file.split('/');
      if (tempArr.length > 2) {
        let routeRoot = tempArr[tempArr.length - 2];
        let r = '/api/' + routeRoot;
        routesRegisted.push(r);
        app.use(r, require('../../' + file)(app))
      }
    }
  });
  console.log('ROUTES => ', routesRegisted)
} catch (err) {
  if (err.errno === 34) {
    console.log('Path does not exist');
  } else {
    //something unrelated went wrong, rethrow
    throw err;
  }
}



/**
 * avoid cors 
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// app.get('/static', (req, res) => {
//   res.sendFile('index.html', {
//     root: path.join(path.normalize(__dirname), '../../views/app')
//   });
// });

// app.get('/app', (req, res) => {
//   res.sendFile('index.html', {
//     root: path.join(path.normalize(__dirname), '../../views/dist')
//   });
// });

/**
 * welcome backend route
 */
app.get('/api/version', (req, res) => {
  res.json({
    message: 'vApp backend is running',
    data: new Date()
  });
});

var url = require('url');
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  let ur = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
  err.url = ur;
  console.log('res url ', ur);
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;