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

import PublicProductPage
    from './pages/PublicProductPage'

import PublicStorePage
    from './pages/PublicStorePage'

import AdminStoresPage
    from './pages/AdminStoresPage'

import AdminStoreDetailPage
    from './pages/AdminStoreDetailPage'

import AdminActivityPage
    from './pages/AdminActivityPage'

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

            <Route
                path="/products/:productId"
                element={
                    <PublicProductPage />
                }
            />

            <Route
                path="/stores/:storeId"
                element={
                    <PublicStorePage />
                }
            />

            <Route
                path="/admin/stores"
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AdminStoresPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/stores/:storeId"
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AdminStoreDetailPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/activity"
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AdminActivityPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}