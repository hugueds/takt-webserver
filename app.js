const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const favicon = require('serve-favicon'); //Providenciar 
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const s7 = require('./plc/plc');
const http = require('http').Server(app);
const io = require('socket.io', { forceNew: true, 'multiplex': false })(http);
const index = require('./routes/index');
const MAX_INSTANCES = 8;

var instances = [];
for (let i = 0; i < MAX_INSTANCES; i++)
    instances.push(new Instance(i));

var currentInstance = 0;

// Criar chain para requisitar dados de todo o PLC, um pouco de cada vez
// Fazer com que o usuario possa escolher qual instancias quer que apareça
// 


var active = 0;

console.log(app.settings.env)

var PORT = process.env.PORT || process.env.DEV_PORT;
PORT = parseInt(PORT);

var clients = [];


io.on('connection', (socket) => {

    clients.push(socket);

    console.log('A CLIENT HAS CONNECTED! -> ' + socket.request.connection.remoteAddress.slice(7));

    socket.on('plc-reconnect', (data) => {
        s7.disconnect();
        s7.connect();
    })

    .on('disconnect', (socket) => {
        var idx = clients.indexOf(socket);
        if (idx > -1) clients.splice(idx, 1);
    });

    io.emit('newConnection', socket.request.connection.remoteAddress.slice(7));

});


setInterval(() => {    
    if (currentInstance < MAX_INSTANCES)
    {
        instances[currentInstance].data = s7.getData(currentInstance);
        currentInstance += 1;
    }
    else 
        currentInstance = 0;    

    console.log("DATA FROM PLC ->   " + instances[currentInstance].data);

}, 100);


setInterval(() => {
    io.emit('takt-1', s7.getData(active));
}, 1100);

setInterval(() => {
    active == 1 ? active = 0 : active = 1;
}, 10000);


app.set('views', path.join(__dirname, 'views')) // view engine setup
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/', index);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

http.listen(PORT, (err) => {
    if (err) return console.error(err);
    console.log("Server Connected at port " + PORT + " " + new Date().toISOString().slice(0, 10));
});

function Instance(id){
    this.id = id;
    this.count = 0;
    this.data = undefined;
}

module.exports = http;