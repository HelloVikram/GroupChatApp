const endpoint=`http://localhost:3000`
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
      alert('Login successful');
      window.location.href='groupchat.html';
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
    if (result.status === 200) {
      alert('User already exists, Please Login!');
    } else {
      alert('Successfully signed up');
      console.log('Data posted successfully!', result);
    }
  } catch (err) {
    console.log('Error in signup', err);
  }
  e.target.reset();
});
