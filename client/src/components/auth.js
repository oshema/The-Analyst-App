import axios from 'axios';

const Auth = async () => {
    try {
        const res = await axios.get('http://localhost:5000/winner/auth/me', { withCredentials: true });
        return res.data.data
    }
    catch (err) {
        return false
    }
}

export default Auth
