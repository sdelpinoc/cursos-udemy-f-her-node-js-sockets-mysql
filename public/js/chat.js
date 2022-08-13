let socket = null;
let user = {};
let room = '';

// HTML references
// const txtName = document.querySelector('#name');
// const btnConnect = document.querySelector('#connect');
const txtAMessage = document.querySelector('#message');
const txtUid = document.querySelector('#uid');
const formSend = document.querySelector('#formSend');
const btnSend = document.querySelector('#send');
// const lblUser = document.querySelector('span');

const lblRoom = document.querySelector('small');
const ulUsersConnected = document.querySelector('#usersConnected');

const ulMessages = document.querySelector('#ulMessages');

const checkUrl = () => {
    // URL

    const params = new URLSearchParams(window.location.search);

    if (!params.has('name')) {
        window.location = 'index.html';
        return;
    }

    if (params.has('room')) {
        room = params.get('room');
    }

    user = {
        name: params.get('name')
    };

    console.log('checkUrl - user: ', user);
}

const connectSocket = () => {
    socket = io();

    socket.on('connect', () => {
        console.log('connect');
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
    });

    // socket.on('createMessage', payload => {
    //     console.log('on - createMessage, payload: ', payload);
    // });

    socket.on('createMessage', drawMessages);

    socket.on('usersConnected', drawUsersList);

    // lblUser.textContent = user.name;
    lblRoom.textContent = room;

    ulMessages.innerHTML = '';
};

const connectChat = () => {
    const { name } = user;

    if (name.length > 0) {
        // console.log(name);
        socket.emit('chatConnect', { name, room }, payload => {
            console.log('chatConnect - payload: ', payload);
        });
    }
};

const createMessage = () => {
    const message = txtAMessage.value;
    let uid = '';

    if (txtUid) {
        uid = txtUid.value;
    }

    if (message.length > 0) {
        // console.log(name);
        socket.emit('createMessage', { message, uid, room }, payload => {
            console.log('emit - createMessage - payload: ', payload);
            txtAMessage.value = '';
            txtAMessage.focus();
        });
    }
};

const drawUsersList = users => {

    ulUsersConnected.innerHTML = `
        <li>
            <a href="javascript:void(0)" class="active"> Room <span>
                    ${room}</span></a>
        </li>
    `;

    users.forEach(user => {

        const li = document.createElement('li');
        const html = `
            <li>
                <a href="javascript:void(0)" data-id="${user.id}"><img src="assets/images/users/1.jpg"
                    alt="user-img" class="img-circle"> <span>${user.name} <small
                        class="text-success">online</small></span></a>
            </li>
        `;

        li.innerHTML = html;

        ulUsersConnected.append(li);
    });

    ulUsersConnected.innerHTML += `<li class="p-20"></li>`;

    const li = ulUsersConnected.querySelectorAll('li');

    for (const element of li) {
        element.addEventListener('click', (e) => {
            console.log(e.target.tagName);
            if (e.target.tagName === 'A' && e.target.dataset.id) {
                console.log(e.target.dataset.id);
            }
        });
    }
};

const drawMessages = newMessage => {

    console.log(newMessage);

    const { userName, message, date } = newMessage;

    const time = new Date(date);
    const messageTime = `${time.getHours()}:${time.getMinutes()}`;

    const li = document.createElement('li');

    let messageClass = 'inverse';
    let liClass = ['animated', 'fadeIn'];

    if (userName === user.name) {
        messageClass = 'info';
        liClass = ['reverse'];
    } else if (userName === 'Admin') {
        messageClass = 'warning';
    }

    li.classList = liClass.join(' ');

    li.innerHTML = `
        ${userName !== 'Admin' ? '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />' : ''}
        </div>
        <div class="chat-content">
            <h5>${userName}</h5>
            <div class="box bg-light-${messageClass}">${message}</div>
        </div>
        <div class="chat-time">${messageTime}</div>
    `;

    ulMessages.append(li);

    const lastLi = ulMessages.querySelector('li:last-child');

    lastLi.scrollIntoView(false);
};

const main = async () => {
    checkUrl();

    connectSocket();

    connectChat();

    // btnConnect.addEventListener('click', connect);
    // btnSend.addEventListener('click', createMessage);

    formSend.addEventListener('submit', (e) => {
        e.preventDefault();

        createMessage();
    });
};

main();