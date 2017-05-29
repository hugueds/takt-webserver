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
const PORT = process.env.PORT || process.env.DEV_PORT;
const MAX_INSTANCES = 8;
const MAX_TAKT_INSTANCES = 4;

var instances = [];

var taktInstances = [
    { id: 0, name: 'FA 0', data: {} },
    { id: 1, name: 'ML0', data: {} },
    { id: 2, name: 'ML1', data: {} },
    { id: 3, name: 'ML2', data: {} }
];

function Instance(id) {
    this.id = id;
    this.count = 0;
    this.data = {};
}

for (let i = 0; i < MAX_INSTANCES; i++)
    instances.push(new Instance(i));

var currentInstance = 0;
var currentTaktInstance = 0;

var active = 0;

var clients = [];

io.on('connection', (socket) => {

    clients.push(socket);

    console.log('A CLIENT HAS CONNECTED! -> ' + socket.request.connection.remoteAddress.slice(7));

    socket.on('get-takt', (instanceId) => {
        var data = instances[instanceId].data;
        socket.emit('put-takt', data);
    });

    socket.on('plc-reconnect', (data) => {
        s7.disconnect();
        s7.connect();
    });

    socket.on('disconnect', (socket) => {
        var idx = clients.indexOf(socket);
        if (idx > -1) clients.splice(idx, 1);
    });

    io.emit('newConnection', socket.request.connection.remoteAddress.slice(7));

    socket.on('takt-instance', (taktInstance) => {
        var data = taktInstances[taktInstance].data;
        socket.emit('server-takt-instance', data);
    });

    socket.on('ping', (data) => {
        console.log(data.toString());
        socket.emit('pong', 'pong');
    });

});


function updateInstances() {
    setInterval(() => {
        if (currentInstance == MAX_INSTANCES) {
            currentInstance = 0;
        }
        else {
            instances[currentInstance].data = s7.getData(currentInstance);
            currentInstance += 1;
        }

    }, 110);
}

function updateTaktTime() {
    setInterval(() => {
        if (currentTaktInstance == MAX_TAKT_INSTANCES) {
            currentTaktInstance = 0;
        }
        else {
            taktInstances[currentTaktInstance].data = s7.getTaktTimeInstance(currentTaktInstance);
            currentTaktInstance += 1;
        }
    }, 250)
}

updateInstances();
updateTaktTime();


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

http.listen(parseInt(PORT), (err) => {
    if (err) return console.error(err);
    console.log('Ambiente -> ' + app.settings.env);
    console.log("Server Connected at port " + PORT + " " + new Date().toISOString().slice(0, 10));
});



module.exports = http;
