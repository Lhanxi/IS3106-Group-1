import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const res = await axios.post('http://localhost:5001/api/users/signup', { email, password });
            if (res.data.message === "User already exists") {
                alert("User already exists.");
            } else {
                // Assuming the server sends a success message when registration is successful
                alert("Registration successful!");
                navigate("/home", { state: { id: email } }); // Navigate to home on successful signup
            }
        } catch (error) {
            console.error("Signup Error:", error); // Log full error for debugging
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                // More robust error message check
                alert("Error: " + (error.response.data.message || "An error occurred"));
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                alert("Error: No response from server.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                alert("Error: " + (error.message || "Unknown error"));
            }
        }
    }

    return (
        <div className='container'>
            <head>
                <title>Signup</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
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
