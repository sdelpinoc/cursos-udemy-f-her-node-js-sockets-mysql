// const express = require('express');
// const socketIO = require('socket.io');
// const http = require('http');

// const path = require('path');

// const app = express();
// let server = http.createServer(app);

// const publicPath = path.resolve(__dirname, '../public');
// const port = process.env.PORT || 3000;

// app.use(express.static(publicPath));

// // IO = esta es la comunicacion del backend
// module.exports.io = socketIO(server);
// require('../server/sockets/socket');

// server.listen(port, (err) => {

//     if (err) throw new Error(err);

//     console.log(`Servidor corriendo en puerto ${ port }`);

// });

import express from 'express';
// import cors from 'cors';
import http from 'http';
import ServerIo from 'socket.io';

import { socketController } from '../sockets/controller.js';

export default class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // socket.io
        this.server = http.createServer(this.app);
        this.io = new ServerIo(this.server);

        // middlewares
        this.middlewares();

        // sockets
        this.sockets();
    }

    middlewares() {
        // Public directory, we set "the root" directory for our application
        this.app.use(express.static('public'));
    }

    sockets() {
        this.io.on('connection', socket => {
            socketController(socket, this.io);
        });
    }

    listen() {
        // socket.io: this.app -> this.server
        this.server.listen(this.port, () => {
            console.log('Server running in PORT: ', this.port);
        });
    }
}
