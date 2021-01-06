import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { UpdateBetAPI } from './localAPI'
import './editBet.css';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

function EditBet({ betId, team1name, team2name, team1score, team2score, bet, onBetEdit }) {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [newTeam1score, setNewTeam1score] = useState('');
    const [newTeam2score, setNewTeam2score] = useState('');
    const [newBet, setNewBet] = useState('');


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewTeam1score('')
        setNewTeam2score('')
        setNewBet('')
        setError('')
    };

    const handleBetEdit = async (event) => {
        event.preventDefault();

        let betSend = newBet;
        let score1Send = newTeam1score;
        let score2Send = newTeam2score;
        if (!newBet)
            betSend = bet;
        if (!newTeam1score)
            score1Send = team1score;

        if (!newTeam2score)
            score2Send = team2score;

        try {
            const res = await UpdateBetAPI(betId, betSend, score1Send, score2Send)
            if (res.data.success) {
                handleClose();
                const betRes = res.data.data.bet;
                const team1scoreRes = res.data.data.players[0].team1score;
                const team2scoreRes = res.data.data.players[0].team2score;
                const resultRes = res.data.data.players[0].result;
                onBetEdit(betRes, team1scoreRes, team2scoreRes, resultRes)
            }
        }
        catch (err) {
            setError(err.response.data.err)
        }

    }

    //**************DECORATION*************

    const useStyles = makeStyles({
        iconButton: {
            marginLeft: "15px",
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
            <IconButton onClick={handleClickOpen} className={classes.iconButton}><EditIcon /></IconButton>
            <Dialog open={open} onClose={handleClose}>
                {error && <span className="errorLine" >{error}</span>}
                <div className="editPopLayout">
                    <div>
                        Please enter your new guess:
                    </div>
                    <div className="editScoreInputLayout">
                        <input className="editScoreInput" type="number" name="team1" placeholder={team1name} value={newTeam1score} onChange={e => setNewTeam1score(e.target.value)}></input>
                        <span className="editScoreDash">-</span>
                        <input className="editScoreInput" type="number" name="team2" placeholder={team2name} value={newTeam2score} onChange={e => setNewTeam2score(e.target.value)}></input>
                    </div>
                    <p>Place your bet:</p>
                    <div >
                        <input className="editBetInput" type="number" name="bet" placeholder={`${bet} ₧`} value={newBet} onChange={e => setNewBet(e.target.value)}></input>
                    </div>
                    <div className="buttonLayout">
                        <Button className={classes.dialogCancelButton} onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button className={classes.betDeleteButton} onClick={event => handleBetEdit(event)} color="primary">
                            Edit Bet
                        </Button>
                    </div>
                </div>

            </Dialog>
        </div>
    )
}

export default EditBet
