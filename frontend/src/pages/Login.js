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
            navigate("/home", { state: { id: email } }); // Navigate to home on successful signup
            if (res.data.message === "User exists") {
                navigate("/home", { state: { id: email } }); // Navigate on successful login
            } else if (res.data.message === "User does not exist") {
                alert("User has not registered an account.");
            }
        } catch (error) {
            alert("Wrong email or password."); // Generic error alert
            console.error(error); // Log error details for debugging
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
