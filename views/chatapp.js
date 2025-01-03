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