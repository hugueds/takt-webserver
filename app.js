var express = require('express')
,app = require('express')()
,path = require('path')
//,favicon = require('serve-favicon')  //Providenciar 
,cookieParser = require('cookie-parser')
,bodyParser = require('body-parser')
,s7 = require('./plc/plc')
,http = require('http').Server(app)
,io = require('socket.io', { forceNew:true, 'multiplex':false })(http);

const PORT = 80;
const index = require('./routes/index');

var clients = {};



s7.connect();

io.on('connection', (socket) => {	

	console.log('A CLIENT HAS CONNECTED! ' + socket.request.connection.remoteAddress.slice(7));

	socket
	.on('plc-reconnect', (data) => {
		console.log(data);
		s7.disconnect();
		s7.connect();
	})

	.on('dec-part', (data) => {
		io.emit('dec-part', data);
		console.log(data);
	})

	.on('serial', (data) => {
		console.log(data);
		io.emit('serial2', data.toString());
	})

	.on('disconnect',  () => {
		;//delete socket;
	});

	io.emit('newConnection', socket.request.connection.remoteAddress.slice(7));
	

	setInterval(() => {
		socket.emit('takt-1', s7.getData());
	}, 1100);
});



app
	.set('views', path.join(__dirname, 'views'))// view engine setup
	.set('view engine', 'ejs')

	// uncomment after placing your favicon in /public
	//.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
	//.use(logger('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }))
	
	.use(cookieParser())
	.use(express.static('public'))
	// catch 404 and forward to error handler

	.use('/', index)

	.use((req, res, next) => {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	})

	// error handler
	.use((err, req, res, next) => {
  	// set locals, only providing error in development
  		res.locals.message = err.message;
  		res.locals.error = req.app.get('env') === 'development' ? err : {};
  	// render the error page
  		res.status(err.status || 500);
  		res.render('error');
});

http.listen(PORT, () => {
	console.log("Server Connected at port "+ PORT + " " +  new Date().toISOString().slice(0,10));
});

module.exports = http;
