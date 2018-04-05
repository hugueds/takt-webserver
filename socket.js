const config = require('./config');
const plc = require('./plc/plc');

let socketServer = null;

let clients = [];
let instances = [];

var taktInstances = config.instances;
const MAX_INSTANCES = 12 + 1;
const MAX_TAKT_INSTANCES = 4;

let currentInstance = 0;
let currentTaktInstance = 0;

function Instance(id) {
    this.id = id;
    this.count = 0;
    this.data = {};
}

for (let i = 0; i < MAX_INSTANCES; i++) {
    instances.push(new Instance(i));
}

plc.connect();

setInterval(updateInstances, 100);
setInterval(updateTaktTime, 200);

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



module.exports = {
    start: function (httpServer) {

        const io = require('socket.io', { forceNew: true, 'multiplex': false })(httpServer);

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

        socketServer = io;
        return;
    },
    io: function () {
        return socketServer;
    }
}