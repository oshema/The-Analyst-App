import axios from 'axios';

export async function LoginAPI(email, password) {
    return await axios.post('https://peaceful-journey-77995.herokuapp.com/winner/auth/login', { email, password }, { withCredentials: true })
}

export async function LogoutAPI() {
    return await axios.get('http://localhost:5000/winner/auth/logout', { withCredentials: true })
}

export async function RegisterAPI(name, email, password) {
    return await axios.post('http://localhost:5000/winner/auth/register', { name, email, password }, { withCredentials: true })
}

export async function GetUsers() {
    return await axios.get('http://localhost:5000/winner/users', { withCredentials: true });
}

export async function GetMatchesAPI() {
    return await axios.get('http://localhost:5000/winner/match', { withCredentials: true });
}

export async function CreateMatchAPI(team1, team2, gameTime) {
    return await axios
        .post(`http://localhost:5000/winner/match`,
            { team1, team2, gameTime },
            { withCredentials: true })
}

export async function UpdateMatchAPI(matchId, team1, team2, gameTime) {
    return await axios.put(`http://localhost:5000/winner/match/${matchId}`, { team1, team2, gameTime }, { withCredentials: true });
}

export async function ConcludeMatchAPI(matchId, team1Score, team2Score) {
    return await axios.put(`http://localhost:5000/winner/match/finalscore/${matchId}`, { team1Score, team2Score }, { withCredentials: true });
}

export async function DeleteMatchAPI(matchId) {
    return await axios.delete(`http://localhost:5000/winner/match/${matchId}`, { withCredentials: true });
}

export async function GetBetsAPI() {
    return axios.get('http://localhost:5000/winner/bet', { withCredentials: true });
}

export async function CreateBetAPI(matchId, team1score, team2score, bet, team1, team2, gameStart) {
    return await axios
        .post(`http://localhost:5000/winner/bet/${matchId}`,
            { team1score, team2score, bet, team1name: team1, team2name: team2, matchTime: gameStart },
            { withCredentials: true })
}

export async function JoinToBet(betId, team1score, team2score) {
    return await axios.put(`http://localhost:5000/winner/bet/join/${betId}`, { team1score, team2score }, { withCredentials: true });
}

export async function UpdateBetAPI(betId, bet, team1score, team2score) {
    return await axios.put(`http://localhost:5000/winner/bet/${betId}`, { bet, team1score, team2score }, { withCredentials: true });
}

export async function UpdateGuessAPI(betId, guessId, team1score, team2score) {
    return await axios.put(`http://localhost:5000/winner/bet/${betId}/${guessId}`, { team1score, team2score }, { withCredentials: true });
}

export async function DeleteBetAPI(betId) {
    return await axios.delete(`http://localhost:5000/winner/bet/${betId}`, { withCredentials: true });
}

export async function DeleteGuessAPI(betId, guessId) {
    return await axios.delete(`http://localhost:5000/winner/bet/${betId}/${guessId}`, { withCredentials: true });
}

