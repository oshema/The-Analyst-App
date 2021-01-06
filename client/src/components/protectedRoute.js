import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom';
import Auth from './auth';

const ProtectedRoute = ({ component: Comp, path, ...rest }) => {

    const [isLogged, setIsLogged] = useState('')
    const [initialized, setInitialized] = useState('')

    useEffect(async () => {

        const auth = await Auth();
        setIsLogged(auth);
        setInitialized(true)
    }, [])

    return (
        <Route
            path={path}
            {...rest}
            render={props => {
                return isLogged ? <Comp user={isLogged} {...props} /> : initialized ? <Redirect to="/login" /> : "";
            }}
        />
    );
};

export default ProtectedRoute;
