const plc = require('./plc/plc');
const andonControl = require('./andonControl');
let socketServer = null;
let clients = [];
let instances = [];
let locked = false;

const instanceInterval = setInterval(updateInstances, 1200);

function updateInstances() {
    if (!locked) {
        locked = true;
        plc.getData((err, data) => {
            if (err) return console.error(err);
            instances = data;
            locked = false;
        });
    }
    return;
}

module.exports = {

    start: function (httpServer) {

        const io = require('socket.io')(httpServer, { path: '/pride/socket.io' });
        
        const np = io.of('/pride');

        io.on('connection', (socket) => {

            let client = socket.request.connection.remoteAddress.slice(7);

            if (client == '' || client == '127.0.0.1') {
                client = socket.handshake.headers['x-real-ip'];
                console.log('The Real IP is', client);
            }

            io.emit('newConnection', client);
            clients.push(client);
            console.log('A CLIENT HAS CONNECTED! -> ' + client);

            socket.on('get-takt', (instanceId) => {
                socket.emit('put-takt', instances[instanceId]);
            });

            socket.on('plc-reconnect', (data) => {
                console.log(data);
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

            socket.on('get-wagon-call', (data) => {
                if (!andonControl || !andonControl.bytes) {
                    return;
                }
                const andon = andonControl.bytes.filter(a => a.index == data);
                // socket.emit('wagon-call', andon);
                // socket.emit('wagon-call', andonControl.bytes);
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
    },
    instances: function () {
        return instances;
    }
}
