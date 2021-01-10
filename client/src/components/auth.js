import axios from 'axios';

const Auth = async () => {
    try {
        const baseUrl = "http://localhost:5000" || window.location.origin;
        const res = await axios.get(`${baseUrl}/winner/auth/me`, { withCredentials: true });
        return res.data.data
    }
    catch (err) {
        return false
    }
}

export default Auth
