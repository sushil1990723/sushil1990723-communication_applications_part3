import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Nav() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the logged-in user data from localStorage
        localStorage.removeItem('logdinuser');
        
        // Redirect to the login page
        navigate('/');
    };

    return (
        <div>
            <div className='container'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/chatlist">Group Chat</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/userlist">Manage Users</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/documentlist">Manage Document</Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link linkdiv" onClick={handleLogout}>Logout</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
