const endpoint=`http://localhost:3000`
const sendid=document.getElementById('sendid');
sendid.addEventListener('submit',async(e)=>{
    e.preventDefault();
    try{
        const token=localStorage.getItem('token');
        const message=e.target.messageid.value;
        const result=await axios.post(`${endpoint}/message`,{message},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        console.log(result);
    }catch(err){
        console.log(err);
    }
    e.target.reset();
})
const getmessages=async ()=>{
    const token=localStorage.getItem('token');
        try {
            const response = await axios.get(`${endpoint}/getmessages`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
            if (response.status==200) {
                const messageList = document.getElementById('messagesContainer');
                messageList.innerHTML = ''; 
                response.data.data.forEach(message => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${message.user.name}: ${message.chat}`;
                    listItem.className='small bg-light text-dark py-1 px-2 rounded mb-1';
                    messageList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
setInterval(getmessages,1000);
