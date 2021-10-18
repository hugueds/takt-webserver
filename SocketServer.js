const io = require('socket.io');

class SocketServer {

    constructor() {
        this.clients = [];
    }

    connect(httpServer) {

        this.server = io(httpServer, { path: '/pride/socket.io' });

        this.server.on('connection', (socket) => {

            let client = socket.request.connection.remoteAddress.slice(7);

            if (client == '' || client == '127.0.0.1') {
                client = socket.handshake.headers['x-real-ip'];
                console.log('The Real IP is', client);
            }

            console.log('A new client has connected:', client);
            this.server.emit('newConnection', client);

        });
    }

    emit(topic, value) {
        this.server.emit(topic, value);
    }

    handleConnection(socket) {

    }


}


module.exports = new SocketServer();
