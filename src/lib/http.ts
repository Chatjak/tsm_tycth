import axios from "axios";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});




http.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized - redirect to login");
        }

        return Promise.reject(error);
    }
);

export default http;