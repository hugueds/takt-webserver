const config = require('./config');
const plc = require('./plc/plc');
let socketServer = null;
let clients = [];

let instances = [];
let instances2 = [];

let currentInstance = 0;
let currentTaktInstance = 0;

const taktInstances = config.instances;
const MAX_INSTANCES = 18;
const MAX_TAKT_INSTANCES = 4;

const instanceInterval = setInterval(updateInstances, 1325);

function updateInstances() {
    plc.getData((err, data) => {
        if (err) return console.error(err);
        instances2 = data;
    });
    return;
}

function updateTaktTime() {
    if (currentTaktInstance == MAX_TAKT_INSTANCES) {
        currentTaktInstance = 0;
    } else {
        taktInstances[currentTaktInstance].data = plc.getTaktTimeInstance(currentTaktInstance);
        currentTaktInstance += 1;
    }
}

module.exports = {
    start: function (httpServer) {

        const io = require('socket.io')(httpServer);        

        io.on('connection', (socket) => {

            let client = socket.request.connection.remoteAddress.slice(7);

            if (client == '' || client == '127.0.0.1') {
                client = socket.handshake.headers["x-real-ip"];
                console.log('The Real IP is', client);
            }          
            
            io.emit('newConnection', client);
            clients.push(client);
            console.log('A CLIENT HAS CONNECTED! -> ' + client);

            socket.on('get-takt', (instanceId) => {
                socket.emit('put-takt', instances2[instanceId]);                
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

            socket.on('clients', () => {
                console.log('Client List:', clients);
                socket.emit('client list', clients);
            });

            // socket.on('takt-instance', (taktInstance) => {
            //     if (taktInstances[taktInstance]) {
            //         let data = taktInstances[taktInstance].data;
            //         socket.emit('server-takt-instance', data);
            //     }
            // });

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
    },
    clients: function () {
        return clients;
    }
}