var express = require('express')                                                                                                                                                                                      
,app = require('express')()
,path = require('path')
,favicon = require('serve-favicon')
,cookieParser = require('cookie-parser')
,bodyParser = require('body-parser')

,s7 = require('./plc/plc')
,http = require('http').Server(app)
,io = require('socket.io',{ forceNew:true, 'multiplex':false })(http);

require('./plc/plc_connection');
var clients = {};

var index = require('./routes/index');
app.use('/', index);


io.on('connection', function (socket) {
	var currentUID = null;

	console.log('A CLIENT HAS CONNECTED!');

	setInterval(function(){
		socket.emit('takt-1', s7.getData());
	}
	, 1100);

	socket.on('serial', function(data){
		io.emit('serial', data.toString());
	});

	socket.on('disconnect', function () {
		delete socket;
	});

});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(8080, function(){
	console.log("Server Connected at port 8080");
});

module.exports = http;
