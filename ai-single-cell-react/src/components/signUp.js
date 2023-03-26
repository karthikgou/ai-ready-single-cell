import React , { useState }from 'react';
import close_icon from '../assets/close_icon_u86.svg';
import close_icon_hover from '../assets/close_icon_u86_mouseOver.svg';

const SIGNUP_API_URL = 'http://localhost:3001/api/signup';


function Signup (props){

  const [hovered, setHovered] = useState(false);

  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Validate input
    if (!username || !password || !confirmPassword) {
      setErrorMessage('Please enter all fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    fetch(SIGNUP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setErrorMessage('');
          console.log(data);
          setIsSignedUp(true);
        } else {
          setErrorMessage(data.message);
        } 
      })
      .catch(error => {
        setErrorMessage("An error occurred during Sign Up.");
      });
};

  return (
    <div className='signup-container comn-container-auth'>
      <div className='clear-icon'>
        <img src={hovered ? close_icon_hover : close_icon} alt="close-icon" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={props.handleAuth} />
      </div>
      {isSignedUp ?
          <div>
          <p>Thank you for signing up!</p>
          <p>Your account has been created successfully.</p>
          <p>Please log in to continue - <span href="#" onClick={props.handleLoginClick} className="span-class-link">Log in</span></p>
        </div> 
        :
      <div className='inner-container-auth'>
          <h1>Sign Up</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod</p>
        
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="username" id="username" value={username} onChange={handleUsernameChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          </div>
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <span href="#" onClick={props.handleLoginClick} className="span-class-link">Log in</span>
        </p>
        </div>
}
</div>
);
};

export default Signup;