import React, { useState } from 'react'
import './CSS/LoginSignup.css'
const LoginSignup = () => {

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  })
  const login = async () => {
    console.log("LOGIN F", formData);
    let responseData;

    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then((response) => response.json()).then((data) => responseData = data)
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else {
      alert(responseData.errors)
    }
  }

  const signup = async () => {
    console.log("SIGNUP", formData);

    let responseData;

    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then((response) => response.json()).then((data) => responseData = data)
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else {
      alert(responseData.errors)
    }
  }

  const changgeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changgeHandler} type="text" placeholder='Your Name' /> : <></>}
          <input name='email' value={formData.email} onChange={changgeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changgeHandler} type="password" placeholder='Password' />

        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login Here</span></p>
          : <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click Here</span></p>}


        <div className="loginsignup-agree">
          <input type="Checkbox" name='' id='' />
          <p>By continuing,I agree to the terms of use & privacy policy</p>
        </div>
      </div>

    </div>
  )
}

export default LoginSignup
