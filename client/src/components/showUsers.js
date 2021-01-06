import React, { useState, useEffect } from 'react';
import SingleUser from './singleUser';
import { GetUsers } from './localAPI';

function ShowUsers({ users, setUsers, refresh, user }) {

    useEffect(async () => {
        try {
            const allUsers = await GetUsers();
            if (allUsers.data.success) {
                setUsers(allUsers.data.data)
            }
        }
        catch (err) {
            return false
        }
    }, [refresh])

    return (
        <div>
            {users && users.map((userData, index) => <SingleUser key={userData._id} number={index} userData={userData} user={user} />)}
        </div>
    )
}

export default ShowUsers
