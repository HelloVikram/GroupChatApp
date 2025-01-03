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
    
})
document.addEventListener('DOMContentLoaded',async(e)=>{
    const token=localStorage.getItem('token');
        try {
            const response = await axios.get(`${endpoint}/getmessages`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        console.log(response.data.data);
            if (response.status==200) {
                const messageList = document.getElementById('messagesContainer');
                messageList.innerHTML = ''; 
                response.data.data.forEach(message => {
                    const listItem = document.createElement('li');
                    listItem.textContent = message.chat;
                    messageList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
)