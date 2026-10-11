import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'

import App from './App'
import AuthProvider from './features/auth/AuthProvider'

import './index.css'
import 'leaflet/dist/leaflet.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

createRoot(
    document.getElementById('root')!,
).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <MotionConfig reducedMotion="user">
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </MotionConfig>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)