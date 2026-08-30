import {
    Route,
    Routes,
} from 'react-router-dom'

import AdminDashboardPage
    from './pages/AdminDashboardPage'

import HomePage
    from './pages/HomePage'

import LoginPage
    from './pages/LoginPage'

import StoreDashboardPage
    from './pages/StoreDashboardPage'

import UnauthorizedPage
    from './pages/UnauthorizedPage'

import ProtectedRoute
    from './features/auth/ProtectedRoute'

import AdminCatalogPage
    from './pages/AdminCatalogPage'

import StoreManagementPage
    from './pages/StoreManagementPage'

import PublicSearchPage
    from './pages/PublicSearchPage'

export default function App() {

    return (
        <Routes>

            <Route
                path="/"
                element={
                    <HomePage />
                }
            />

            <Route
                path="/search"
                element={
                    <PublicSearchPage />
                }
            />

            <Route
                path="/login"
                element={
                    <LoginPage />
                }
            />

            <Route
                path="/unauthorized"
                element={
                    <UnauthorizedPage />
                }
            />

            <Route
                path="/store"
                element={
                    <ProtectedRoute
                        allowedRole="STORE_OWNER"
                    >
                        <StoreDashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/store/stores/:storeId"
                element={
                    <ProtectedRoute
                        allowedRole="STORE_OWNER"
                    >
                        <StoreManagementPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AdminDashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/catalog"
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AdminCatalogPage />
                    </ProtectedRoute>
                }
            />

        </Routes>
    )
}