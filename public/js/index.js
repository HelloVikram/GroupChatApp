const endpoint = `http://localhost:3000`
const loginform = document.getElementById('loginform');
loginform.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const email = e.target.querySelector('#email-login').value;
    const password = e.target.querySelector('#password-login').value;
    const obj = { email, password };
    const result = await axios.post(`${endpoint}/user/login`, obj);
    if (result.data && result.data.token) {
      localStorage.setItem('token', result.data.token);
      const username = result.data.username; 
      console.log(username);
      localStorage.setItem('username', username); 
      alert('Login successful');
      window.location.href = 'chatselector.html';
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 404 || err.response.status === 401 || err.response.status === 500)
        alert(err.response.data.message);
    }
    console.log('Error in Login form', err);
  }
  e.target.reset();
});


const signup = document.querySelector('#signupform');
signup.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const name = e.target.querySelector('#username-signup').value;
    const email = e.target.querySelector('#email-signup').value;
    const phone = e.target.querySelector('#phone-signup').value;
    const password = e.target.querySelector('#password-signup').value;
    const obj = { name, email, phone, password };
    const result = await axios.post(`${endpoint}/user/signup`, obj);
     if (result.data.success) {
      alert('Signup successful! Redirecting to login...');
      e.target.reset();
    
      document.getElementById('signupFormContainer').style.display = 'none';
      document.getElementById('loginFormContainer').style.display = 'block';
     }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400 || err.response.status === 409) {
        alert(err.response.data.message || 'User already exists');
      } else {
        alert('Signup failed. Please try again.');
      }
    }
    console.log('Error in signup', err);
  }
});
