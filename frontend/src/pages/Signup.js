// Frontend: React - Signup Component
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:5001/api/users/signup', { email, password });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); // Store the token in local storage
                navigate("/home"); // Navigate to home on successful signup
                alert("Registration successful!");
            } else {
                alert("Signup failed: " + res.data.message);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Signup failed: " + (error.response?.data.message || "Unknown error"));
        }
    }

    return (
        <div className='container'>
            <head>
                <title>Signup</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
            </head>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' className='form-control' value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter email' />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' className='form-control' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
                </div>
                <input type='submit' className='btn btn-primary' value="Sign up" />
            </form>
            <br />
            <Link to='/' className="btn btn-link">Already have an account? Log in here</Link>
            <br />
        </div>
    );
}

export default Signup;
