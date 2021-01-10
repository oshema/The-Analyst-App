import React, { useState, useEffect } from 'react';
import './login.css'
import { LoginAPI } from './localAPI'
import { makeStyles } from '@material-ui/core/styles';
import { Redirect, Link } from 'react-router-dom';
import Auth from './auth';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Button from '@material-ui/core/Button';

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLogged, setIsLogged] = useState("")

    useEffect(async () => {
        const auth = await Auth();
        setIsLogged(auth);
    }, [])

    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await LoginAPI(email, password)
            setIsLogged(res.data.success)
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }

    //*************** DECORATION ****************
    const useStyles = makeStyles({
        inputIcon: {
            color: "#3f51b5",
        },
        placeholder: {
            "&::placeholder": {
                color: "#3513b3",
            }
        },
        fieldInput: {
            width: "310px",
            marginBottom: "20px"
        }
    });
    const classes = useStyles();
    //****************************************** 

    return (
        <div className="loginImg">
            <img className="titleImg" src="img/theAnalyst.png" />
            <form className="loginBox" onSubmit={event => formSubmit(event)}>
                <TextField
                    InputProps={{
                        classes: {
                            input: classes.placeholder
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                <AlternateEmailIcon className={classes.inputIcon} />
                            </InputAdornment>
                        ),
                    }}
                    className={classes.fieldInput}
                    variant="outlined"
                    type="text"
                    label="Email"
                    name="email"
                    placeholder="please enter your email"
                    value={email} onChange={e => setEmail(e.target.value)}>

                </TextField>
                <TextField
                    InputProps={{
                        classes: {
                            input: classes.placeholder
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKeyIcon className={classes.inputIcon} />
                            </InputAdornment>
                        ),
                    }}
                    className={classes.fieldInput}
                    variant="outlined"
                    type="password"
                    label="Password"
                    name="password"
                    placeholder="please enter your password"
                    value={password} onChange={e => setPassword(e.target.value)}>
                </TextField>
                <div className="loginLinks">
                    <div>
                        <Link style={{ textDecoration: 'none' }} to="/register"><Button color="primary">register</Button></Link>
                    </div>
                </div>
                <Button className="loginButton" type="submit" variant="contained" color="primary">
                    Log In
                </Button>

                {error && error}
                {isLogged && <Redirect to="/" />}
            </form >
        </div>
    )
}

export default Login
