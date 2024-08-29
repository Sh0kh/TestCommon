import React, { useState } from 'react';
import '../Style/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const ShowCreatetrue = () => {
    toast.success('Right password!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const ShowCreatedFalse = () => {
    toast.error('Wrong password!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (password === 'KEY_ADMIN') {
      localStorage.setItem('adminKey', password);
      ShowCreatetrue();
      navigate('/foto'); // Redirect to /foto
    } else {
      ShowCreatedFalse();
    }
  };

  return (
    <div className='Login'>
      <div className='Login__wrapper'>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">
            <h3>Password</h3>
            <input
              type="text"
              id="password"
              value={password}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Check</button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Login;
