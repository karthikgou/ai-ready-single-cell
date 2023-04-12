import React , { useState }from 'react';
import {NavLink} from "react-router-dom"


const SIGNUP_API_URL = `http://${process.env.REACT_APP_HOST_URL}:3001/api/signup`;


function Signup (props){


  const [isSignedUp, setIsSignedUp] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');


  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check for errors
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Please enter an email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username) {
      newErrors.username = 'Please enter a username';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter a password';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    // Submit the form if there are no errors
    if (Object.keys(newErrors).length === 0) {
        fetch(SIGNUP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
            }),
        // credentials: "include"
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 200) {
            setIsSignedUp(true);
          } else {
            setErrorMessage(data.message);
          } 
        })
        .catch(error => {
          setErrorMessage("An error occurred during Sign Up.");
        });
    }
  };

  return (
    <div className='signup-container comn-container-auth'>
      {isSignedUp ?
          <div>
            <p>Thank you for signing up!</p>
            <p>Your account has been created successfully.</p>
            <p>Please log in to continue - <NavLink to="/login" className="span-class-link">Log in</NavLink></p>
        </div> 
        :
      <div className='inner-container-auth'>
          <h1>Sign Up</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod</p>
        
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} className="form-input" onChange={handleChange}  placeholder="Email"/>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="username" value={formData.username} className="form-input" onChange={handleChange} placeholder="Username" />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} className="form-input" onChange={handleChange} placeholder="Password" />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} className="form-input" onChange={handleChange} placeholder="Confirm Password"/>
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className='btn-widget'>Signup</button>
        </form>
        <p>
          Already have an account? <NavLink to="/login" className="span-class-link">Log in</NavLink>
        </p>
        </div>
}
</div>
);
};

export default Signup;