import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { JoinToBet } from './localAPI'
import './joinBet.css'

function JoinBet({ team1name, team2name, bet, betId, onGuessAdded }) {

    const [team1Score, setTeam1Score] = useState('')
    const [team2Score, setTeam2Score] = useState('')
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('')
    };

    const createGuess = async (event) => {
        event.preventDefault();
        try {
            const res = await JoinToBet(betId, team1Score, team2Score)
            if (res.data.success) {
                handleClose();
                onGuessAdded(res.data.data)
            }
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }

    // ************ DECORATION ***************
    const useStyles = makeStyles({
        button: {
            color: "#db7eff",
            fontFamily: "poppins",
            fontSize: "12px",
            fontWeight: "600",
            padding: "2px 0",
            marginLeft: "20px",
            border: "1px solid #db7eff",
            "&:hover": {
                background: "linear-gradient(to right,#ff7e89,#ff7eb4, #ff7e89)",
                color: "rgba(255, 255, 255, 0.900)"
            }
        },
        betDialogButton: {
            backgroundColor: "rgba(0, 0, 0, 0.177)",
            color: "white",
            fontFamily: "poppins",
            fontWeight: "300",
            "&:hover": {
                background: "rgba(0, 0, 0, 0.877)",
                color: "#aab6fe"
            }
        }
    })

    const classes = useStyles();

    //****************************************

    return (
        <>
            <Button color="primary" variant="outlined" className={classes.button} onClick={handleClickOpen}>Join Bet</Button>
            <Dialog open={open} onClose={handleClose}>
                <span className="errorJoinBet">{error && error}</span>
                <div className="joinBetWindow">
                    <p className="joinPostBetText">Please enter your score prediction:</p>
                    <div className="joinScoreInputLayout">
                        <input className="joinScoreInput" type="number" name="team1" placeholder={team1name} value={team1Score} onChange={e => setTeam1Score(e.target.value)}></input>
                        <span className="joinScoreDash">-</span>
                        <input className="joinScoreInput" type="number" name="team2" placeholder={team2name} value={team2Score} onChange={e => setTeam2Score(e.target.value)}></input>
                    </div>
                    <div className="joinBetLayout">
                        <p className="joinPostBetText">The bet is fixed on: </p>
                        <span className="joinBetInput">{`${bet}₧`}</span>
                    </div>

                    <div className="joinButtonLayout">
                        <Button className={classes.betDialogButton} onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button className={classes.betDialogButton} onClick={event => createGuess(event)} color="primary">
                            Post new bet
                        </Button>
                    </div>
                </div >
            </Dialog>

        </>
    )
}

export default JoinBet