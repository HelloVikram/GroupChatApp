const endpoint = `http://localhost:3000`
const send = document.getElementById('messageform');
send.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const message = e.target.messageid.value;
        const result = await axios.post(`${endpoint}/message`, { message }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(result);
    } catch (err) {
        console.log(err);
    }
    e.target.reset();
})
const getmessages = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${endpoint}/getmessages`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status == 200) {
            const messagecontainer = document.getElementById('messageContainer');
            messagecontainer.textContent='';
            response.data.MessageData.forEach(x => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'bg-light p-2 m-2 border';
                messageDiv.innerHTML= `<strong>${x.user.name}</strong>:${x.chat}`;
                messagecontainer.appendChild(messageDiv);
            });
            messagecontainer.scrollTop=messagecontainer.scrollHeight;
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}
setInterval(getmessages,1000);