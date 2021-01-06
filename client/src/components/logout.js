import React from 'react';
import { LogoutAPI } from './localAPI'
import './logout.css';
import { Link } from 'react-router-dom';

function Logout() {

    const logout = async () => {
        try {
            const res = await LogoutAPI();
        }
        catch (err) {
            console.log(err.response.data.err)
        }

    }

    return (
        <Link to='/login'>
            <button className="logoutButton" onClick={() => logout()}>logout</button>
        </Link>
    )
}

export default Logout