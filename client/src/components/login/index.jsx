import React from 'react';
import { useState, useEffect } from 'react';
import { usePostLoginMutation, usePostSignupMutation } from '@/state/api';
import Button from 'react-bootstrap/Button';

const Login = ({setUser,setSecret}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [triggerLogin, resultLogin] = usePostLoginMutation();
  const [triggerSignup, resultSignup] = usePostSignupMutation();

  const handleLogin = () =>{
    triggerLogin({username, password})
  }

  const handleRegister = () =>{
    triggerSignup({username,password})
  }

  useEffect(()=>{
    console.log(resultLogin)
    if(resultLogin.data?.username && resultLogin.data?.password){
      setUser(username)
      setSecret(password)
    }
    if(resultSignup.data?.username && resultSignup.data?.password){
      setUser(username)
      setSecret(password)
    }
  },[resultLogin, resultSignup])//eslint-disable-line

  return <div className='login-page'>
    <div className='login-container'>
    <h2 className='title'>Chat App with ChatGPT</h2>
    <p className='register-change' onClick={()=>setIsRegister(!isRegister)}>
      {isRegister ? "Already a user?":"Are you a new user?"}
    </p>
    <div>
      <input className='login-input'
      type='text'
      placeholder='Username'
      value={username}
      onChange={(e)=>{setUsername(e.target.value)}}/>
       <input className='login-input'
      type='password'
      placeholder='Password'
      value={password}
      onChange={(e)=>{setPassword(e.target.value)}}/>
    </div>
    <div className='login-actions'>
      {isRegister?(
        <Button type='primary' onClick={handleRegister}>
          Register
        </Button>
      ) : (
        <Button type='primary' onClick={handleLogin}>
          Login
        </Button>
      )}
    </div>
    </div>
  </div>;
};

export default Login;
