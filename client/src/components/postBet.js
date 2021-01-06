import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { CreateBetAPI } from './localAPI'
import './postBet.css'

function PostBet(props) {

    const { matchId, team1, team2, gameStart, onBetAdded } = props
    const [open, setOpen] = useState(false);
    const [team1Score, setTeam1Score] = useState('')
    const [team2Score, setTeam2Score] = useState('')
    const [bet, setBet] = useState('')
    const [error, setError] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('')
        setTeam1Score('')
        setTeam2Score('')
        setBet('')
    };

    const createBet = async (event) => {
        event.preventDefault();
        try {
            const res = await CreateBetAPI(matchId, team1Score, team2Score, bet, team1, team2, gameStart)
            if (res.data.success) {
                handleClose();
                onBetAdded(res.data.data)
            }
        }
        catch (err) {
            setError(err.response.data.err)
        }
    }

    // **************** DECORATION *******************

    const useStyles = makeStyles({
        betButton: {
            height: "22px",
            marginRight: "5px",
            fontFamily: "poppins",
            "&:hover": {
                background: "#c0264d",
                color: "white"
            }
        },
        betDialogButton: {
            backgroundColor: "rgba(255, 255, 255, 0.177)",
            color: "white",
            fontFamily: "poppins",
            fontWeight: "300",
            "&:hover": {
                background: "rgba(255, 255, 255, 0.877)",
                color: "#dc004e"
            }
        }
    })

    const classes = useStyles();

    //************************************************ 

    return (
        <div>
            <Button className={classes.betButton} color="secondary" variant="outlined" onClick={handleClickOpen}>
                BET
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <span className="error">{error && error}</span>
                <div className="betWindow">
                    <p className="postBetText">Please enter your score prediction:</p>
                    <div className="scoreInputLayout">
                        <input className="scoreInput" type="number" name="team1" placeholder={team1} value={team1Score} onChange={e => setTeam1Score(e.target.value)}></input>
                        <span className="scoreDash">-</span>
                        <input className="scoreInput" type="number" name="team2" placeholder={team2} value={team2Score} onChange={e => setTeam2Score(e.target.value)}></input>
                    </div>
                    <p className="postBetText">Place your bet:</p>
                    <div className="betInputLayout">
                        <input className="betInput" type="number" name="bet" placeholder="₧" value={bet} onChange={e => setBet(e.target.value)}></input>
                    </div>

                    <div className="buttonLayout">
                        <Button className={classes.betDialogButton} onClick={handleClose} color="secondary">
                            Cancel
                    </Button>
                        <Button className={classes.betDialogButton} onClick={event => createBet(event)} color="secondary">
                            Post new bet
                    </Button>
                    </div>
                </div >
            </Dialog>

        </div>
    )
}

export default PostBet
