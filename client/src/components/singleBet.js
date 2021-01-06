import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import DeleteBet from './deleteBet';
import EditBet from './editBet';
import JoinBet from './joinBet';
import PlayerGuess from './playerGuess';
import './singleBet.css';

function SingleBet(props) {

    const { betData, number, user } = props
    const [mainBetInfo, setMainBetInfo] = useState(betData)
    const [numbering, setNumbering] = useState(number)
    const [isCanJoin, setIsCanJoin] = useState(false)
    const [isMultipleGuesses, setIsMultipleGuesses] = useState(false)
    const [toggleBetExpand, setToggleBetExpand] = useState(false)
    const [isBetEditable, setIsBetEditable] = useState(false)

    useEffect(async () => {
        //update on refresh button
        if (numbering !== number) {
            setNumbering(number)
        } else {
            setMainBetInfo(betData)
        }
    }, [betData, number])

    useEffect(() => {
        let countBets = 0;
        let check = true;

        mainBetInfo.players.forEach(player => {
            countBets += 1;
            if (player.user === user._id)
                check = false
        })
        if (mainBetInfo.status !== 'open') {
            check = false;
        }
        setIsCanJoin(check);

        if (countBets > 1) {
            setIsMultipleGuesses(countBets)
        } else {
            setIsMultipleGuesses(false)
            setToggleBetExpand(false)
        }
    }, [mainBetInfo.players, mainBetInfo.status])


    useEffect(() => {
        if (mainBetInfo.players[0].user == user._id && mainBetInfo.status == 'open' && !isMultipleGuesses) {
            setIsBetEditable(true)
        }
        else {
            setIsBetEditable(false)
        }
    }, [mainBetInfo.players, mainBetInfo.status, isMultipleGuesses])

    const handleExpandViewClick = () => {
        setToggleBetExpand(!toggleBetExpand);
    }

    const onGuessAdded = (newGuess) => {
        setMainBetInfo({ ...mainBetInfo, players: [...mainBetInfo.players, newGuess] })
    }

    const onBetEdit = (editedBet, editedScore1, editedScore2, editedResult) => {
        setMainBetInfo({
            ...mainBetInfo, bet: editedBet,
            players: [{ ...mainBetInfo.players[0], team1score: editedScore1, team2score: editedScore2, result: editedResult }]
        })
    }


    //*********** DECORATION *********** 

    const rowsColors = {
        white: "rgba(220, 160, 215, 0.13)",
        black: "rgba(80, 80, 120, 0.13)"
    }
    const statusColor = {
        backgroundColor: mainBetInfo.status === "finished" ?
            "rgb(83, 88, 156)" : mainBetInfo.status === "closed" ?
                "rgb(225, 53, 53)" : mainBetInfo.status === "canceled" && "rgb(104, 3, 3)"
    }

    const useStyles = makeStyles({
        iconButtonExpand: {
            marginLeft: "2px",
            marginTop: "2px",
            width: "25px",
            height: "25px",
            padding: "0px",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.0)",
            }
        }
    })

    const classes = useStyles();

    //************************************ 

    return (
        <div className={toggleBetExpand && "expandView"}>
            <div className="betRow" style={{ backgroundColor: (numbering % 2) ? rowsColors.white : rowsColors.black }}>
                <div className="numberingLayout">
                    <span className="numberingBets">{`${numbering + 1} `}</span>
                    {isMultipleGuesses &&
                        <>
                            <IconButton onClick={handleExpandViewClick} className={classes.iconButtonExpand}>
                                {toggleBetExpand ?
                                    <ExpandLessIcon fontSize="small" className="shrinkButton" />
                                    :
                                    <ExpandMoreIcon fontSize="small" className="expandButton" />}
                            </IconButton>
                            {!toggleBetExpand && <span className="playerCount">{`(${isMultipleGuesses - 1})`}</span>}
                        </>
                    }
                </div>
                <div className="statusWidth">
                    <span className="status" style={statusColor}>{mainBetInfo.status}</span>
                </div>
                <span className="username">{toggleBetExpand ?
                    <ArrowDropDownIcon />
                    :
                    `${mainBetInfo.players[0].username}`}
                </span>
                <span className="teamsScore">{toggleBetExpand ?
                    <ArrowDropDownIcon />
                    :
                    `${mainBetInfo.players[0].team1score} - ${mainBetInfo.players[0].team2score}`}
                </span>
                <span className="result">{toggleBetExpand ?
                    ""
                    :
                    `(${mainBetInfo.players[0].result})`}</span>
                <span className="userBet">{`${mainBetInfo.bet}`}</span>
                <span className="teamsNames">{`${mainBetInfo.team1name} - ${mainBetInfo.team2name}`}</span>
                {isCanJoin &&
                    <JoinBet
                        team1name={mainBetInfo.team1name}
                        team2name={mainBetInfo.team2name}
                        bet={mainBetInfo.bet}
                        betId={mainBetInfo._id}
                        onGuessAdded={onGuessAdded}
                    />}
                {isBetEditable &&
                    <>
                        <EditBet
                            betId={mainBetInfo._id}
                            team1name={mainBetInfo.team1name}
                            team2name={mainBetInfo.team2name}
                            team1score={mainBetInfo.players[0].team1score}
                            team2score={mainBetInfo.players[0].team2score}
                            bet={mainBetInfo.bet}
                            onBetEdit={onBetEdit}
                        />
                        <DeleteBet
                            betId={mainBetInfo._id}
                        />
                    </>
                }
            </div>
            {toggleBetExpand &&
                <div >
                    <div className="expandViewSeperation" ></div>
                    <div className="guessesLayout">
                        <div>
                            {mainBetInfo.players.map(guess =>
                                <PlayerGuess
                                    key={guess._id}
                                    isPrizeCollected={mainBetInfo.isPrizeCollected}
                                    winnerPlayer={mainBetInfo.winner}
                                    currentUser={user._id}
                                    guessUserId={guess.user}
                                    username={guess.username}
                                    team1name={mainBetInfo.team1name}
                                    team2name={mainBetInfo.team2name}
                                    team1score={guess.team1score}
                                    team2score={guess.team2score}
                                    result={guess.result}
                                    betStatus={mainBetInfo.status}
                                    betId={mainBetInfo._id}
                                    guessId={guess._id}
                                />)}
                        </div>
                        <div className="betPrize">
                            {`prize: ${mainBetInfo.players.length * mainBetInfo.bet}`}
                        </div>
                    </div>
                </div>
            }
            {/*<button onClick={() => hundleDelete()}>Delete Bet</button>*/}
        </div>
    )
}

export default SingleBet
