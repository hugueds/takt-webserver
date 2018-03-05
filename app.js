#!/usr/bin/env node

const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const plc = require('./plc/plc');
const http = require('http').Server(app);
const io = require('socket.io', { forceNew: true, 'multiplex': false })(http);
const index = require('./routes/index');
const configInstance = require('./routes/config');
const config = require('./config');
const PORT = process.env.PORT || process.env.DEV_PORT;
const MAX_INSTANCES = 12 + 1;
const MAX_TAKT_INSTANCES = 4;

let instances = [];

plc.connect();

var taktInstances = config.instances;

function Instance(id) {
    this.id = id;
    this.count = 0;
    this.data = {};
}

for (let i = 0; i < MAX_INSTANCES; i++) {
    instances.push(new Instance(i));
}


let currentInstance = 0;
let currentTaktInstance = 0;

var active = 0;

var clients = [];


io.on('connection', (socket) => {

    let client = socket.request.connection.remoteAddress.slice(7);
    io.emit('newConnection', client);
    clients.push(client);
    console.log('A CLIENT HAS CONNECTED! -> ' + client);

    socket.on('get-takt', (instanceId) => {
        if (instances[instanceId]) {
            let data = instances[instanceId].data
            socket.emit('put-takt', data);
        }
    });

    socket.on('plc-reconnect', (data) => {
        plc.disconnect();
        plc.connect();
    });

    socket.on('disconnect', (socket) => {
        let idx = clients.indexOf(client);
        if (idx > -1) {
            clients.splice(idx, 1);
        }
    });

    socket.on('takt-instance', (taktInstance) => {
        if (taktInstances[taktInstance]) {
            let data = taktInstances[taktInstance].data;
            socket.emit('server-takt-instance', data);
        }
    });

    socket.on('ping', (data) => {
        console.log(data.toString());
        socket.emit('pong', 'pong');
    });

});


setInterval(updateInstances, 125);
setInterval(updateTaktTime, 250);

function updateInstances() {
    if (currentInstance == MAX_INSTANCES) {
        currentInstance = 0;
    } else {
        instances[currentInstance].data = plc.getData(currentInstance);
        currentInstance++;
    }
}

function updateTaktTime() {
    if (currentTaktInstance == MAX_TAKT_INSTANCES) {
        currentTaktInstance = 0;
    } else {
        taktInstances[currentTaktInstance].data = plc.getTaktTimeInstance(currentTaktInstance);
        currentTaktInstance += 1;
    }
    // plc.getAndons();
    return null;
    
}

app.set('views', path.join(__dirname, 'views')) // view engine setup
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/config', configInstance);
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
    console.log("Server Connected at port " + PORT + " " + new Date().toLocaleString());
});

http.on('error', onError);

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }



module.exports = http;