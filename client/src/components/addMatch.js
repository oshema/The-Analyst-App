import React, { useState } from 'react'
import { CreateMatchAPI } from './localAPI'
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

function AddMatch({ matches, setMatches }) {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')
    const [team1name, setTeam1name] = useState('')
    const [team2name, setTeam2name] = useState('')
    const [matchDate, setMatchDate] = useState('')
    const [matchTime, setMatchTime] = useState('')


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
        setTeam1name('');
        setTeam2name('');
        setMatchDate('');
        setMatchTime('');
    };

    const handleCreateMatch = async () => {
        if (!(team1name && team2name && matchDate && matchTime)) {
            setError("Please fill all the areas")
        } else {
            const gameTime = `${matchDate}T${matchTime}:00.000Z`

            const dateValidation = new Date()
            dateValidation.setHours(dateValidation.getHours() + 2);
            if (gameTime < dateValidation.toISOString()) {
                setError("You cannot create game which already started")
            } else {
                try {
                    const res = await CreateMatchAPI(team1name, team2name, gameTime)
                    if (res.data.success) {
                        setMatches([...matches, res.data.data])
                    }
                    handleClose();
                }
                catch (err) {
                    setError(err)
                }
            }
        }

    }

    // ************** DECORATION ****************
    const useStyles = makeStyles({

        addMatchIcon: {
            marginLeft: "10px",
            color: "white",
            padding: "10px",
        },
        adminIcon: {
            color: "rgb(255, 175, 208);",
        }
    })

    const classes = useStyles();
    // *****************************************
    return (
        <div>
            <IconButton className={classes.addMatchIcon} onClick={handleClickOpen}><AddCircleOutlineIcon className={classes.adminIcon} fontSize="large" /></IconButton>
            <Dialog open={open} onClose={handleClose}>
                {error && error}
                <input type="text" name="team1" placeholder="team1" value={team1name} onChange={e => setTeam1name(e.target.value)}></input>
                <input type="text" name="team2" placeholder="team2" value={team2name} onChange={e => setTeam2name(e.target.value)}></input>
                <input type="date" name="matchStartDate" min={new Date().toISOString().split('T')[0]} value={matchDate} onChange={e => setMatchDate(e.target.value)}></input>
                <input type="time" name="matchTime" value={matchTime} onChange={e => setMatchTime(e.target.value)}></input>
                <Button onClick={handleClose}>No</Button>
                <Button onClick={() => handleCreateMatch()}>Create</Button>
            </Dialog>
        </div>
    )
}

export default AddMatch
