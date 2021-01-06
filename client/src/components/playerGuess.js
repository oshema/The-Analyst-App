import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import DeleteGuess from './deleteGuess';
import EditGuess from './editGuess'
import IconButton from '@material-ui/core/IconButton';
import './playerGuess.css'

function PlayerGuess({ currentUser,
    guessUserId,
    username,
    team1score,
    team2score,
    result,
    betStatus,
    betId,
    guessId,
    team1name,
    team2name,
    isPrizeCollected,
    winnerPlayer }) {

    const [ableEditGuess, setAbleEditGuess] = useState(false)
    const [teamScore1, setTeamScore1] = useState(team1score)
    const [teamScore2, setTeamScore2] = useState(team2score)
    const [winningGuess, setWinningGuess] = useState(false)
    const [isDrew, setIsDrew] = useState(false)

    useEffect(() => {
        if (currentUser == guessUserId && betStatus == 'open') {
            setAbleEditGuess(true)
        }
        else {
            setAbleEditGuess(false)
        }
    }, [])

    useEffect(() => {
        setTeamScore1(team1score);
        setTeamScore2(team2score);
    }, [team1score, team2score])

    useEffect(() => {
        if (isPrizeCollected) {
            if (winnerPlayer) {
                setIsDrew(false)
                if (winnerPlayer == guessUserId)
                    setWinningGuess(true)
                else
                    setWinningGuess(false)
            } else {
                setIsDrew(true)
            }
        }
    }, [isPrizeCollected, winnerPlayer])

    const handleScoreEdit = (scoreUpdate1, scoreUpdate2) => {
        setTeamScore1(scoreUpdate1);
        setTeamScore2(scoreUpdate2);
    }


    //**************DECORATION*************

    const useStyles = makeStyles({
        iconButton: {
            marginLeft: "2px",
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
        }
    })

    const classes = useStyles();

    //************************************ 

    return (
        <div className={isDrew ? "guessDrew" : winningGuess ? "guessWin" : isPrizeCollected ? "guessLose" : "playerGuessLayout"}>
            <span className="editButtons">
                {ableEditGuess &&
                    <>
                        <IconButton className={classes.iconButton}>
                            <EditGuess
                                team1name={team1name}
                                team2name={team2name}
                                team1score={team1score}
                                team2score={team2score}
                                betId={betId}
                                guessId={guessId}
                                handleScoreEdit={handleScoreEdit} />
                        </IconButton>
                        <IconButton className={classes.iconButton}>
                            <DeleteGuess
                                betId={betId}
                                guessId={guessId} />
                        </IconButton>
                    </>
                }
            </span>
            {isDrew ? <span >Drew</span> : winningGuess && <span >Winner!</span>}
            <span className="user">{username}</span>
            <span className="score">{`${teamScore1} - ${teamScore2}`}</span>
            <span className="guessResult">{`(${result})`}</span>
        </div>
    )
}

export default PlayerGuess
