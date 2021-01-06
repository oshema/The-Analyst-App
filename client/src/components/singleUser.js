import React from 'react';
import './singleUser.css';

function SingleUser({ number, userData, user }) {

    return (
        <>
            <div className="usersLayout"
                style={{
                    backgroundColor: (number == 0) && "rgba(109, 255, 194, 0.455)",
                    border: (user._id == userData._id) && "1px solid white"
                }}>
                <div className="chartRank">{`${number + 1}`}</div>
                <div className="chartUser">{userData.name}</div>
                <div className="chartTotal">{userData.total}</div>
                <div className="chartWin">{userData.wins}</div>
                <div className="chartLost">{userData.loses}</div>
                <div className="chartStats">{`${Math.round(userData.stats * 10) / 10}%`}</div>
                <div className="chartPts">{userData.points}</div>
            </div>
        </>
    )
}

export default SingleUser
