const signup=document.querySelector('#signupform');
      signup.addEventListener('submit',async(event)=>{
        event.preventDefault();
        try{
        const name=event.target.username.value;
        const email=event.target.email.value;
        const phone=event.target.phone.value;
        const password=event.target.password.value;
        const obj={name,email,phone,password}
        const result= await axios.post('http://localhost:3000/user/signup',obj);
        if(result.status==200){
          alert('User already exists,Please Login!');
        }
        else{
          alert('Successfuly signed up');
          console.log('Data posted successfull!',result);
        }
        }catch(err){
          console.log('Error in signup ',err)
        }
        event.target.reset();
      })