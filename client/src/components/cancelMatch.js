import React, { useEffect, useState } from 'react'
import { DeleteMatchAPI } from './localAPI'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

function CancelMatch({ matchId }) {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('')
    };

    const handleCancelMatch = async (event) => {
        event.preventDefault();
        try {
            const res = await DeleteMatchAPI(matchId)
            if (res.data.success) {
                window.location.reload();
            }
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }



    // **************** DECORATION *******************

    const useStyles = makeStyles({
        cancelButton: {
            minWidth: '24px',
            height: "22px",
            fontFamily: "poppins",
            fontSize: '10px',
            padding: '0',
            margin: '0',
            "&:hover": {
                background: "white",
                color: "red"
            }
        },
        adminIcon: {
            color: "rgb(255, 175, 208);",
            fontSize: '16px!important'
        }
    })

    const classes = useStyles();

    //************************************************ 
    return (
        <div>
            <IconButton className={classes.cancelButton} onClick={handleClickOpen} color="primary" variant="outlined"><DeleteIcon className={classes.adminIcon} /></IconButton>
            <Dialog open={open} onClose={handleClose}>
                {error && error}
                <Button onClick={handleClose}>no</Button>
                <Button onClick={event => handleCancelMatch(event)}>delete</Button>
            </Dialog>
        </div>
    )
}

export default CancelMatch
