import React, { useState } from 'react';
import './howItWorks.css';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

function HowItWorks() {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('')
    };

    return (
        <div>
            <IconButton color="secondary" onClick={() => handleClickOpen()}><span className="howItWorks">How it works?</span></IconButton>
            <Dialog maxWidth="md" scroll="body" fullWidth open={open} onClose={handleClose} className="dialogLayout">
                <div className="info"></div>
                <Button className="cancel" onClick={handleClose} color="primary">
                    Cancel
                </Button>
            </Dialog>
        </div>
    )
}

export default HowItWorks;
