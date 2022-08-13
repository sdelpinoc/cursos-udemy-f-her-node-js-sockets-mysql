class User {
    constructor(id, name, room) {
        this.id = id;
        this.name = name;
        this.room = room;
    }
}

export default class Chat {
    constructor() {
        this.users = {};
    }

    get usersArray() {
        return Object.values(this.users);
    }

    addUser(id, name, room) {
        const user = new User(id, name, room);

        this.users[user.id] = user;
    }

    getUserById(id) {
        return (this.users[id]) ? this.users[id] : null;
    }

    deleteUser(id) {
        const deletedUser = { ...this.users[id] };

        delete this.users[id];

        return deletedUser;
    }

    getUsersByRoom(room = '') {
        const usersArray = Object.values(this.users);

        return usersArray.filter(user => user.room === room);
    }

    createMessage(userName, message) {
        return {
            userName,
            message,
            date: new Date().getTime()
        };
    };
}
