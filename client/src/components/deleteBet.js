import React, { useState } from 'react'
import './deleteBet.css'
import { DeleteBetAPI } from './localAPI'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

function DeleteBet({ betId }) {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('')
    };

    const handleBetDelete = async () => {
        try {
            const deleteBet = await DeleteBetAPI(betId)
            if (deleteBet.data.success) {
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
                <div className="popLayout">
                    <div>
                        Are you sure you want to delete this bet?
                    </div>
                    <div className="buttonLayout">
                        <Button className={classes.dialogCancelButton} onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button className={classes.betDeleteButton} onClick={() => handleBetDelete()} color="primary">
                            Delete Bet
                        </Button>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default DeleteBet
