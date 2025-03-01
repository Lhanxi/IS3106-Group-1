import React from 'react'
import { useLocation } from 'react-router-dom'

function Home() {
    const location = useLocation()

    return (
        <html>
            <head>
                <title>Home</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
            </head>
            <body>
                <div className="container">
                    <h1>Welcome to the home page.</h1>
                    <p>{location.state && location.state.id ? `You are logged in as ${location.state.id}` : 'You are not logged in.'}</p>
                </div>
            </body>
        </html>
    )
}

export default Home