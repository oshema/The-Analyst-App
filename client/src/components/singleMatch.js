import React, { useEffect, useState } from 'react';
import PostBet from './postBet';
import CancelMatch from './cancelMatch';
import EditMatchDate from './editMatchDate';
import SetMatchResult from './setMatchResult';
import './singleMatch.css';

function SingleMatch(props) {

    const { number, matchData, onBetAdded, refresh, user } = props
    const [isAdmin, SetIsAdmin] = useState(false)
    const [matchDate, setMatchDate] = useState('')
    const [matchTime, setMatchTime] = useState('')
    const [ableToBet, setAbleToBet] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [isFinleResult, setIsFinleResult] = useState(false)



    const rowsColors = {
        white: "rgba(220, 160, 215, 0.13)",
        black: "rgba(80, 80, 120, 0.13)"
    }

    //check if logged user is admin
    useEffect(() => {
        if (user.role == 'admin') {
            SetIsAdmin(true)
        } else {
            SetIsAdmin(false)
        }
    }, [user])


    useEffect(() => {
        if (matchData.gameTime) {
            setMatchDate(matchData.gameTime.split("T").shift().split("-").reverse().join('/'));
            setMatchTime(matchData.gameTime.split("T").pop().split(":").slice(0, -1).join(":"));
        }
    }, [matchData.gameTime])

    useEffect(() => {
        const matchStartTimeStamp = new Date(matchData.gameTime).getTime() - 7200000;
        if (matchStartTimeStamp > Date.now()) {
            setAbleToBet(true)
        } else {
            setAbleToBet(false)
        }
        const matchFinishTimeStamp = matchStartTimeStamp + 105 * 60 * 1000
        if (matchFinishTimeStamp < Date.now()) {
            setIsFinished(true)
        } else {
            setIsFinished(false)
        }
    }, [refresh, matchData.gameTime])

    useEffect(() => {
        if (matchData.finished) {
            setIsFinleResult(true)
        } else {
            setIsFinleResult(false)
        }
    }, [refresh, matchData.finished])

    return (
        <div className="matchRow" style={{ backgroundColor: (number % 2) ? rowsColors.white : rowsColors.black }}>
            <span className="numbering">{`${number + 1} `}</span>
            <span className="teams">{`${matchData.team1} - ${matchData.team2}`}</span>
            <span className="dateTime">{matchDate} <span style={{ fontWeight: "600", marginLeft: "6px" }}>{matchTime}</span></span>
            <span className="action">
                {isAdmin &&
                    <>
                        <EditMatchDate matchId={matchData._id} team1={matchData.team1} team2={matchData.team2} matchDate={matchData.gameTime} />
                        <CancelMatch matchId={matchData._id} />
                        {isFinished && <SetMatchResult matchData={matchData} refresh={refresh} />}
                    </>
                }
                <span className="betButton">
                    {ableToBet && <PostBet matchId={matchData._id} team1={matchData.team1} team2={matchData.team2} gameStart={matchData.gameTime} onBetAdded={onBetAdded} />}
                </span>
            </span>
            {isFinleResult ?
                <span className="finalResult">{`${matchData.team1Score} - ${matchData.team2Score}`}</span>
                :
                <span className="finalResult">-</span>
            }

        </div >
    )
}

export default SingleMatch
