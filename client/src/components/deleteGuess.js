import React, { useState } from 'react'
import './deleteGuess.css'
import { DeleteGuessAPI } from './localAPI'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

function DeleteGuess({ betId, guessId }) {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('')
    };

    const handleGuessDelete = async (event) => {
        event.preventDefault();
        try {
            const deleteGuess = await DeleteGuessAPI(betId, guessId)
            if (deleteGuess.data.success) {
                window.location.reload();
            }
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }

    //**************DECORATION*************

    const useStyles = makeStyles({
        iconButton: {
            width: "28px",
            height: "28px",
            padding: "0px",
            color: "black",
            transition: "1s ease",
            "&:hover": {
                color: "red",
                width: "45px",
                transition: "1s",
            }
        },
        betDeleteButton: {
            backgroundColor: "rgba(0, 0, 0, 0.177)",
            color: "white",
            fontFamily: "poppins",
            fontWeight: "300",
            "&:hover": {
                background: "rgb(231, 76, 76);",
                color: "white"
            }
        },
        dialogCancelButton: {
            backgroundColor: "rgba(0, 0, 0, 0.177)",
            color: "white",
            fontFamily: "poppins",
            fontWeight: "300",
            "&:hover": {
                background: "#aab6fe",
                color: "white"
            }
        }
    })

    const classes = useStyles();

    //************************************ 

    return (
        <div>
            <IconButton onClick={handleClickOpen} className={classes.iconButton}><DeleteIcon /></IconButton>
            <Dialog open={open} onClose={handleClose}>
                {error && <span className="errorLine" >{error}</span>}
                <div className="guessPopLayout">
                    <div>
                        Are you sure you want to delete this guess?
                    </div>
                    <div className="guessButtonLayout">
                        <Button className={classes.dialogCancelButton} onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button className={classes.betDeleteButton} onClick={event => handleGuessDelete(event)} color="primary">
                            Delete Guess
                        </Button>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default DeleteGuess

