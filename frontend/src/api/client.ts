import axios from 'axios'
import {
    clearAccessToken,
    getAccessToken,
} from '../features/auth/authStorage'

export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    (config) => {

        const token =
            getAccessToken()

        if (token) {
            config.headers.set(
                'Authorization',
                `Bearer ${token}`,
            )
        }
        return config
    },
)

apiClient.interceptors.response.use(
    (response) => response,

    (error) => {

        if (
            error.response?.status === 401 &&
            getAccessToken()
        ) {

            clearAccessToken()

            window.dispatchEvent(
                new Event(
                    'shelfradar:authentication-expired',
                ),
            )
        }
        return Promise.reject(error)
    },
)