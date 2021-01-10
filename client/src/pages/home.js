import React, { useState, useEffect } from 'react';
import Logout from '../components/logout';
import HowItWorks from '../components/howItWorks'
import ShowBets from '../components/showBets';
import ShowMatches from '../components/showMatches';
import ShowUsers from '../components/showUsers';
import AddMatch from '../components/addMatch';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { makeStyles } from '@material-ui/core/styles';
import CachedSharpIcon from '@material-ui/icons/CachedSharp';
import IconButton from '@material-ui/core/IconButton';
import StandingBGVideo from '../video/standingVideo.mp4';

import './home.css';


function Home(props) {

    const { user } = props;

    const [isAdmin, setIsAdmin] = useState(false)
    const [bets, setBets] = useState('')
    const [matches, setMatches] = useState('')
    const [users, setUsers] = useState('')
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        if (user.role === 'admin')
            setIsAdmin(true)
        else
            setIsAdmin(false)
    }, [user])

    const onBetAdded = (newBet) => {
        setBets([...bets, newBet])
    }

    const goToChart = () => {
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: 'smooth',
        });
    }



    // ************** DECORATION ****************
    const useStyles = makeStyles({
        IconButton: {
            paddingLeft: "0px",
        },
        eventNoteIcon: {
            color: "rgba(255, 255, 255, 0.900)",
            margin: "15px 20px 4px",
            verticalAlign: "bottom"
        },
        LocalAtmIcon: {
            color: "rgba(255, 255, 255, 0.900)",
            margin: "13px 20px 4px",
            verticalAlign: "bottom",
            fontSize: "38px !important"
        },
        CachedSharpIcon: {
            color: "white",
            fontSize: "38px !important",
        }
    })

    const classes = useStyles();
    // *****************************************

    return (
        <>
            <div className="homeImg">
                <div className="navbar">
                    <IconButton color="secondary" className={classes.IconButton} onClick={() => setRefresh(!refresh)}><CachedSharpIcon className={classes.CachedSharpIcon} /></IconButton>
                    <IconButton color="secondary" onClick={() => goToChart()}><span className="chartNav">Chart</span></IconButton>
                    <HowItWorks />

                    <div className="logout">
                        <span className="welcome">{`Welcome, ${user.name}`}</span> {isAdmin && <span className="adminTitle">(admin)</span>}
                        <Logout />
                    </div>
                </div>
                <div className="homeLayout">
                    <div className="matchTable">
                        <div className="matchHeader">
                            <EventNoteIcon fontSize="large" className={classes.eventNoteIcon} />
                            <span className="matchTitle">Matches</span>
                            {isAdmin && <AddMatch matches={matches} setMatches={setMatches} />}
                        </div>
                        <div className="betCategories">
                            <span className="numMatchHeader">#</span>
                            <span className="expandMatchHeader"></span>
                            <span className="teamsMatchHeader">teams</span>
                            <span className="scheduleMatchHeader">game schedule</span>
                            <span className="actionMatchHeader">action</span>
                            <span className="FinalResult">final result</span>
                        </div>
                        <div className="matchList">
                            <ShowMatches matches={matches} setMatches={setMatches} onBetAdded={onBetAdded} refresh={refresh} user={user} />
                        </div>
                    </div>
                    <div className="betTable">
                        <div className="betHeader">
                            <LocalAtmIcon fontSize="inherit" className={classes.LocalAtmIcon} />
                            <span>Bets</span>
                        </div>
                        <div className="betCategories">
                            <span className="numBetHeader">#</span>
                            <span className="expandBetHeader"></span>
                            <span className="statusBetHeader">status</span>
                            <span className="usernameBetHeader">user</span>
                            <span className="scoreBetHeader">score</span>
                            <span className="betPriceBetHeader">bet</span>
                            <span className="teamsBetHeader">teams</span>
                            <span className="actionBetHeader">action</span>
                        </div>
                        <div className="betsList">
                            <ShowBets bets={bets} setBets={setBets} refresh={refresh} user={user} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="chartImg">
                <video
                    autoPlay
                    loop
                    muted
                    className="StandingBGVideo"
                >
                    <source src={StandingBGVideo} type="video/mp4" />
                </video>
                <div className="tableLayout">
                    <div className="tableHeader">
                        <span className="tableTitle">The Analyst Chempionship Standing</span>
                    </div>
                    <div className="tableCategories">
                        <span className="tableRank">#Rank</span>
                        <span className="tableUser">User</span>
                        <span className="tableTotal">Total Bets</span>
                        <span className="tableWin">Win</span>
                        <span className="tableLost">lost</span>
                        <span className="tableStats">Stats </span>
                        <span className="tablePts">Pts</span>
                    </div>
                    <div>
                        <ShowUsers users={users} setUsers={setUsers} refresh={refresh} user={user} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Home
