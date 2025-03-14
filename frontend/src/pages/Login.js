import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate(); // Updated variable name for clarity
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/users/login', {
                email,
                password
            });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); // Store the token in local storage
                navigate("/home"); // Navigate to home on successful login
            } else {
                alert("Login failed: " + res.data.message);
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed: " + (error.response?.data.message || "Unknown error"));
        }
    }

    return (
        <div className='container'>
            <head>
                <title>Login</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
            </head>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' className='form-control' value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter email' />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' className='form-control' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
                </div >
        <input type='submit' className='btn btn-primary' value="Login" />
            </form >
        <br />
            <Link to="/signup" className="btn btn-link">Don't have an account? Sign up here</Link>
            <br />
        </div >
    );
}

export default Login;
