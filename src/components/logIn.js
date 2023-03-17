import React, { useState, useEffect } from 'react';
import close_icon from '../assets/close_icon_u86.svg';
import close_icon_hover from '../assets/close_icon_u86_mouseOver.svg';
import { getCookie} from '../utils/utilFunctions';

const LOGIN_API_URL = "http://localhost:3001";

function LoginPage (props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  // const [flagToStore, setFlagToStore] = useState(false);

  // const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // console.log("remmember me: " + rememberMe);
    // setFlagToStore(true);
    // console.log("saveCreds: " + flagToStore);
    // Validate input
    if (!username || !password) {
      setErrorMessage('*Please enter both username and password');
      return;
    }


    fetch(LOGIN_API_URL + "/api/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    }).then(response => response.json())
    .then(data => {
      if(data.status === 200) {
        setIsLoggedIn(true);
      } else {
        setErrorMessage(data.message);
      }
    }).catch(error => {
      setErrorMessage("An error occurred during login");
    });
  };
  
  useEffect(() => {
    const jwtToken = getCookie('jwtToken');

    if (jwtToken) {
          fetch(LOGIN_API_URL + "/protected", {
            method: 'GET',
            credentials: 'include', // send cookies with the request
            headers: { 'Authorization': `Bearer ${jwtToken}`},
          }) 
          .then((response) => response.json())
          .then((data) => {
            setUsername(data.authData.username);
            setPassword(data.authData.password);
            setRememberMe(true);
          })
          .catch((error) => console.error(error));
    }
  }, [rememberMe]);


  const [hovered, setHovered] = useState(false);

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  return (
    <div className='login-container comn-container-auth'>
      <div className='clear-icon'>
        <img src={hovered ? close_icon_hover : close_icon} alt="close-icon" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={props.handleAuth} />
      </div>
      {isLoggedIn ? 
        <div>
          <h1>Logged In successfully!!!</h1>
          <p>Please close this window to continue...</p>
        </div>
        :
      <div className='inner-container-auth'>

        <h1>Log in</h1>
        <p>Please enter your username and password to log in.</p>
        
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="username" id="username" value={username} onChange={handleUsernameChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          </div>
          <div className='checkbox'>
            <input type="checkbox" id="remember-me" checked={rememberMe} onChange={handleCheckboxChange} />
            <label htmlFor="remember-me">Remember Me</label>
            <span className='span-class-link'>Forgot Login Details?</span>
          </div>
          <button type="submit" >Login</button>
        </form>

        <p>
          Don't have an account? <span href="#" onClick={props.handleSignUpClick} className="span-class-link">Signup</span>

        </p>
      </div>
      }
    </div>
  );
};

export default LoginPage;
