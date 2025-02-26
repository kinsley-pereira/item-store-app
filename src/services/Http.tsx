import axios from "axios";

const Http = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-type": "application/json"
    }
});

Http.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
)

export default Http;