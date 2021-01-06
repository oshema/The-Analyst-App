import React, { useEffect, useState } from 'react';
import SingleBet from './singleBet';
import { GetBetsAPI } from './localAPI';

function ShowBets({ bets, setBets, refresh, user }) {

    useEffect(async () => {
        try {
            const allBets = await GetBetsAPI();
            if (allBets.data.success) {
                setBets(allBets.data.data)
            }
        }
        catch (err) {
            return false
        }
    }, [refresh])

    return (
        <div >
            {bets && bets.map((bet, index) => <SingleBet key={bet._id} number={index} betData={bet} user={user} />)}
        </div>
    )
}

export default ShowBets
