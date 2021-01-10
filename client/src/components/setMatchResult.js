import React, { useEffect, useState } from 'react'
import { DeleteMatchAPI, ConcludeMatchAPI } from './localAPI'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import CheckIcon from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';


function SetMatchResult({ matchData, refresh }) {

    const [noBets, setNoBets] = useState(false)
    const [isFinishSet, setIsFinishSet] = useState(false)
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')
    const [team1Score, setTeam1Score] = useState('')
    const [team2Score, setTeam2Score] = useState('')


    useEffect(() => {
        if (matchData.bets.length < 1)
            setNoBets(true)
        else
            setNoBets(false)

    }, [matchData.bets, refresh])

    useEffect(() => {
        if (matchData.finished) {
            setIsFinishSet(true)
        } else {
            setIsFinishSet(false)
        }
    }, [matchData.finished, refresh])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
        setTeam1Score('');
        setTeam2Score('');
    };

    const handleDeleteMatch = async () => {
        try {
            const res = await DeleteMatchAPI(matchData._id)
            if (res.data.success) {
                window.location.reload();
            }
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }

    const handleFinishedMatch = async () => {
        try {
            if (!team1Score || !team2Score) {
                setError("please enter scores for both teams")
            } else {
                const res = await ConcludeMatchAPI(matchData._id, team1Score, team2Score)
                if (res.data.success) {
                    setIsFinishSet(true)
                    console.log('Final score has been set')
                }
                handleClose();
            }
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }

    // **************** DECORATION *******************

    const useStyles = makeStyles({
        iconButton: {
            height: "22px",
            fontFamily: "poppins",
            fontSize: '5px!important',
            padding: '0',
            margin: '0',
            "&:hover": {
                background: "white",
                color: "red"
            }
        },
        adminIcon: {
            color: "rgb(250, 75, 103);",
            fontSize: '16px!important'
        },
        adminIconGreen: {
            color: "rgb(65, 163, 65);",
            fontSize: '16px!important'
        },

    })

    const classes = useStyles();

    //************************************************ 

    return (
        <>
            {noBets ?
                <>
                    <IconButton className={classes.iconButton} onClick={handleClickOpen}><ClearIcon className={classes.adminIcon} /></IconButton>
                    <Dialog open={open} onClose={handleClose}>
                        {error && error}
                        <Button onClick={handleClose}>No</Button>
                        <Button onClick={() => handleDeleteMatch()}>Delete</Button>
                    </Dialog>
                </>
                :
                isFinishSet ?
                    <>
                        <IconButton className={classes.iconButton} onClick={handleClickOpen}><CheckIcon className={classes.adminIconGreen} /></IconButton>
                        <Dialog open={open} onClose={handleClose}>
                            {error && error}
                            <input type="number" name="team1score" placeholder={matchData.team1} value={team1Score} onChange={e => setTeam1Score(e.target.value)}></input>
                            <input type="number" name="team2score" placeholder={matchData.team2} value={team2Score} onChange={e => setTeam2Score(e.target.value)}></input>
                            <Button onClick={handleClose}>No</Button>
                            <Button onClick={() => handleFinishedMatch()}>Send Final Result</Button>
                        </Dialog>
                    </>
                    :
                    <>
                        <IconButton onClick={handleClickOpen}><EmojiFlagsIcon className={classes.adminIcon} /></IconButton>
                        <Dialog open={open} onClose={handleClose}>
                            {error && error}
                            <input type="number" name="team1score" placeholder={matchData.team1} value={team1Score} onChange={e => setTeam1Score(e.target.value)}></input>
                            <input type="number" name="team2score" placeholder={matchData.team2} value={team2Score} onChange={e => setTeam2Score(e.target.value)}></input>
                            <Button onClick={handleClose}>No</Button>
                            <Button onClick={() => handleFinishedMatch()}>Send Final Result</Button>
                        </Dialog>
                    </>
            }
        </>
    )
}

export default SetMatchResult
