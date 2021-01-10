import React, { useState, useEffect } from 'react'
import { UpdateMatchAPI } from './localAPI';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

function EditMatchDate({ matchId, team1, team2, matchDate }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')
    const [team1name, setTeam1name] = useState('')
    const [team2name, setTeam2name] = useState('')
    const [matchStartDate, setMatchStartDate] = useState('')
    const [matchTime, setMatchTime] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
        setTeam1name('');
        setTeam2name('');
        setMatchStartDate('');
        setMatchTime('');
    };

    const handleMatchDate = async () => {

        try {
            const justDate = matchDate.split("T").shift()
            const justTime = matchDate.split("T").pop()
            let team1Update = team1name;
            let team2Update = team2name;
            let dateUpdate = `${matchStartDate}T${matchTime}:00.000Z`

            if (!team1name)
                team1Update = team1;
            if (!team2name)
                team2Update = team2;
            if (!matchStartDate && !matchTime) {
                dateUpdate = matchDate;
            } else if (!matchStartDate) {
                dateUpdate = `${justDate}T${matchTime}:00.000Z`
            } else if (!matchTime) {
                dateUpdate = `${matchStartDate}T${justTime}`
            }
            const res = await UpdateMatchAPI(matchId, team1Update, team2Update, dateUpdate)
            if (res.data.success) {
                window.location.reload();
            }
            handleClose();

        }
        catch (err) {
            setError(err.response.data.err)
        }
    }



    // **************** DECORATION *******************

    const useStyles = makeStyles({
        cancelButton: {
            minWidth: '14px',
            height: "22px",
            fontFamily: "poppins",
            fontSize: '3px',
            padding: '0',
            marginLeft: "25px",
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
            <IconButton color="primary" variant="outlined" className={classes.cancelButton} onClick={handleClickOpen} ><EditIcon className={classes.adminIcon} /></IconButton>
            <Dialog open={open} onClose={handleClose}>
                {error && error}
                <input type="text" name="team1" placeholder={team1} value={team1name} onChange={e => setTeam1name(e.target.value)}></input>
                <input type="text" name="team2" placeholder={team2} value={team2name} onChange={e => setTeam2name(e.target.value)}></input>
                <input type="date" name="matchStartDate" value={matchStartDate} onChange={e => setMatchStartDate(e.target.value)}></input>
                <input type="time" name="matchTime" value={matchTime} onChange={e => setMatchTime(e.target.value)}></input>
                <Button onClick={handleClose}>No</Button>
                <Button onClick={() => handleMatchDate()}>Edit</Button>
            </Dialog>
        </div>
    )
}

export default EditMatchDate
