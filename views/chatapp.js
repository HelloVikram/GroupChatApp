const endpoint = `http://localhost:3000`
const send = document.getElementById('messageform');

const loadOldMessages= ()=>{
    const localmessages=JSON.parse(localStorage.getItem('messages'))||[];
    const messagecontainer = document.getElementById('messageContainer');
    messagecontainer.textContent='';
    localmessages.forEach(x => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bg-light p-2 m-2 border';
        messageDiv.innerHTML= `<strong>${x.user.name}</strong>:${x.chat}`;
        messagecontainer.appendChild(messageDiv);
    });
    messagecontainer.scrollTop=messagecontainer.scrollHeight;
}
loadOldMessages();
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
    const localmessages=JSON.parse(localStorage.getItem('messages'))||[];
    const messagesid=localmessages.length>0?localmessages[localmessages.length-1].id:0;
    try {
        const response = await axios.get(`${endpoint}/getmessages?lastMessageId=${messagesid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status == 200) {
           const newMessages=response.data.MessageData; 
           const messages=[...localmessages,...newMessages].slice(-10);
           
           localStorage.setItem('messages',JSON.stringify(messages));
           loadOldMessages();
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}
setInterval(getmessages,1000);