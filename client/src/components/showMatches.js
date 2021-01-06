import React, { useState, useEffect } from 'react'
import { GetMatchesAPI } from './localAPI'
import SingleMatch from './singleMatch'

function ShowMatches({ matches, setMatches, onBetAdded, refresh, user }) {



    useEffect(async () => {
        try {
            const allMatches = await GetMatchesAPI();
            if (allMatches.data.success) {
                setMatches(allMatches.data.data)
            }
        }
        catch (err) {
            return false
        }
    }, [refresh])

    return (
        <div>
            {matches && matches.map((match, index) =>
                <SingleMatch
                    key={match._id}
                    number={index}
                    matchData={match}
                    onBetAdded={onBetAdded}
                    refresh={refresh}
                    user={user}
                />)}
        </div>
    )
}

export default ShowMatches
