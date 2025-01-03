const loginform=document.getElementById('loginform');
      loginform.addEventListener('submit',async (e)=>{
        e.preventDefault();
        try{
            const email=e.target.email.value;
            const password=e.target.password.value;
            const obj={email,password};
           const result=await axios.post('http://localhost:3000/user/login',obj);
           if(result.data&&result.data.token){
            localStorage.setItem('token',result.data.token);
           }
           alert(' Login successfull');
        }catch(err){
            console.log('Error in Login form',err);
        }
        e.target.reset();
      })