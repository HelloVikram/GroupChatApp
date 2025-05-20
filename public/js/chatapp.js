const endpoint = `http://localhost:3000`
const send = document.getElementById('messageform');
const userlist = document.getElementById('userList')
const messageform = document.getElementById('messageform');
const messageContainer = document.getElementById('messageContainer');

const socket = io(endpoint);

let currentUser = null;
let senderId = null;
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
senderId = payload.id;
const selectuser = (userId) => {
    currentUser = userId;
    socket.emit('registerPersonalUser', senderId);
    getmessages(currentUser);
}
const getUsers = async () => {
    const token = localStorage.getItem('token');
    try {
        const result = await axios.get(`${endpoint}/getusers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        userlist.innerHTML = '';
        result.data.Users.forEach(element => {
            const user = document.createElement('li');
            user.className = `list-group-item m-2 list-group-item-action`;
            user.textContent = `${element.name}`;
            user.onclick = () => {
                document.querySelectorAll('.list-group-item').forEach(item => {
                    item.classList.remove('active');
                })
                user.classList.add('active');
                selectuser(element.id);
            }
            userlist.appendChild(user);
        });
    } catch (err) {
        console.log(err);
    }
}
getUsers();

messageform.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const message = event.target.messageid.value;
        const result = await axios.post(`${endpoint}/message`, { message, receiverId: currentUser }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const receiverId = currentUser;
        const sender = localStorage.getItem('username');
        socket.emit('sendPersonalMessage', { senderId, sender, receiverId, message, type: 'text' });
        event.target.reset();
    } catch (err) {
        console.log(err)
    }
});

const getmessages = async (currentUser) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${endpoint}/getmessages?receiverId=${currentUser}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status == 200) {
            const messages = response.data.messageData;
            const messageData = messages.map(msg => ({
                name: msg.sender.name,
                chat: msg.chat
            }));
            messageContainer.innerHTML = '';
            messageData.forEach(({ name, chat }) => {
                const msgElement = document.createElement('div');
                let newname = name;
                if (localStorage.getItem('username') == name) {
                    newname = 'You';
                }
                let displayMessage = chat;
                if (chat.includes('cloudinary.com')) {
                    displayMessage = `<a href="${chat}" target="_blank" rel="noopener noreferrer">Download File</a>`;
                }
                msgElement.innerHTML = `<strong>${newname}</strong>: ${displayMessage}`;
                msgElement.className = `p-1 m-2 bg-light border`
                messageContainer.appendChild(msgElement);
            });
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}
//file upload
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${endpoint}/upload?receiverId=${currentUser}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const fileUrl = res.data.fileUrl;

        // Send file URL as a message via socket
        socket.emit('sendPersonalMessage', {
            senderId,
            sender: localStorage.getItem('username'),
            receiverId: currentUser,
            message: fileUrl,
            type: 'file'
        });
        fileInput.value = '';

    } catch (err) {
        console.log('Upload error:', err);
        alert('File upload failed. Please try again.');
    }
});

//io logic
socket.on('sendPersonalMessage', data => {
    const msgElement = document.createElement('div');
    let newname = data.sender;
    let displayMessage = data.message;

    if (localStorage.getItem('username') === newname) {
        newname = 'You';
    }

    // If message is a file, create a download link
    if (data.type === 'file') {
        displayMessage = `<a href="${data.message}" target="_blank" rel="noopener noreferrer">Download File</a>`;
    }

    msgElement.innerHTML = `<strong>${newname}</strong>: ${displayMessage}`;
    msgElement.className = 'p-1 m-2 bg-light border';
    messageContainer.appendChild(msgElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});
