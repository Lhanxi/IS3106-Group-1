import React from 'react';
import { jwtDecode } from 'jwt-decode';

function Home() {
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;

    return (
        <div className="container">
            <head>
                <title>Home</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
            </head>
            <h1>Welcome to the home page.</h1>
            Display all user info: {user ? JSON.stringify(user) : 'No user info available.'}
            <p>{user ? `You are logged in as ${user.email}` : 'You are not logged in.'}</p>
        </div>
    );
}

export default Home;
