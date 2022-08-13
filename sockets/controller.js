import Socket from 'socket.io';

import Chat from '../models/chat.js';

const chat = new Chat();

const socketController = (socket = new Socket(), io) => {
    console.log('User connected: ', socket.id);

    socket.on('chatConnect', ({ name, room }, callback = () => { }) => {

        if (!name) {
            return callback({
                error: true,
                msg: 'Name is obligatory'
            });
        }

        const chatRoom = room || 'global';

        chat.addUser(socket.id, name, chatRoom);

        socket.join(chatRoom);
        socket.broadcast.to(chatRoom).emit('createMessage', chat.createMessage('Admin', `User ${name} connected to the ${chatRoom} chat room`));

        io.to(room).emit('usersConnected', chat.getUsersByRoom(chatRoom));
        // callback(chat.usersArray);
    });

    socket.on('createMessage', ({ message, uid }, callback = () => { }) => {
        // console.log('createMessage - chat.usersArray: ', chat.usersArray);
        // console.log('createMessage - socket.id: ', socket.id);
        const { name, room } = chat.getUserById(socket.id);

        if (uid) {
            socket.broadcast.to(uid).emit('createMessage', chat.createMessage(name, message));
        } else {
            io.to(room).emit('createMessage', chat.createMessage(name, message));
        }

        io.to(room).emit('usersConnected', chat.getUsersByRoom(room));

        callback(chat.createMessage(name, message));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);

        const deleteUser = chat.deleteUser(socket.id);

        // Get the room and then send the notificacions
        socket.broadcast.to(deleteUser.room).emit('createMessage', chat.createMessage('Admin', `User ${deleteUser.name} has left the ${deleteUser.room} chat room `));

        io.to(deleteUser.room).emit('usersConnected', chat.getUsersByRoom(deleteUser.room));
    });
};

export {
    socketController
};
