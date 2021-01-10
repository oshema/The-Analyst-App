import React, { useState, useEffect } from 'react';
import './register.css'
import { RegisterAPI } from './localAPI';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect, Link } from 'react-router-dom';
import Auth from './auth';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Button from '@material-ui/core/Button';

function Register() {

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
        },
    });

    const classes = useStyles();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLogged, setIsLogged] = useState('')

    useEffect(async () => {
        const auth = await Auth();
        setIsLogged(auth);
    }, [])

    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await RegisterAPI(name, email, password)
            setIsLogged(res.data.success)
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }

    return (
        <div className="loginImgR">
            <img className="titleImgR" src="img/theAnalyst.png" />
            <form className="loginBoxR" onSubmit={event => formSubmit(event)}>

                <TextField
                    InputProps={{
                        classes: {
                            input: classes.placeholder
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle className={classes.inputIcon} />
                            </InputAdornment>
                        ),
                    }}
                    className={classes.fieldInput}
                    variant="outlined"
                    type="text"
                    label="Name"
                    name="name"
                    placeholder="please enter your name"
                    value={name} onChange={e => setName(e.target.value)}>

                </TextField>
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
                <div className="loginLinksR">
                    <Link style={{ textDecoration: 'none' }} to="/login"><Button color="primary">Back to login..</Button></Link>
                </div>
                <Button className="loginButtonR" type="submit" variant="contained" color="primary">
                    Register
                </Button>
                {error && error}
                {isLogged && <Redirect to="/" />}
            </form >
        </div>
    )
}

export default Register

