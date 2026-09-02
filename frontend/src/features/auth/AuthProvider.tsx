import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'

import type {
    PropsWithChildren,
} from 'react'

import {
    getCurrentUser,
    login as loginRequest,
} from './authApi'

import {
    clearAccessToken,
    getAccessToken,
    setAccessToken,
} from './authStorage'

import {
    AuthContext,
} from './authContext'

import type {
    AuthUser,
} from './types'

export default function AuthProvider({
    children,
}: PropsWithChildren) {

    const [user, setUser] =
        useState<AuthUser | null>(null)

    const [
        initializing,
        setInitializing,
    ] = useState(true)

    useEffect(() => {
        async function initialize() {

            const token =
                getAccessToken()

            if (!token) {
                setInitializing(false)
                return
            }

            try {
                const currentUser =
                    await getCurrentUser()

                setUser(currentUser)

            } catch {
                clearAccessToken()
                setUser(null)

            } finally {
                setInitializing(false)
            }
        }

        void initialize()
    }, [])

    useEffect(() => {
        function handleExpiredAuthentication() {
            setUser(null)
        }

        window.addEventListener(
            'shelfradar:authentication-expired',
            handleExpiredAuthentication,
        )

        return () => {

            window.removeEventListener(
                'shelfradar:authentication-expired',
                handleExpiredAuthentication,
            )
        }
    }, [])

    const login =
        useCallback(
            async (
                email: string,
                password: string,
            ): Promise<AuthUser> => {

                const response =
                    await loginRequest({
                        email,
                        password,
                    })
                setAccessToken(
                    response.accessToken,
                )

                setUser(response.user)
                return response.user
            },
            [],
        )

    const logout =
        useCallback(() => {

            clearAccessToken()
            setUser(null)

        }, [])

    const value =
        useMemo(
            () => ({
                user,
                initializing,
                login,
                logout,
            }),
            [
                user,
                initializing,
                login,
                logout,
            ],
        )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}