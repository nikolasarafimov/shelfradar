import {
    lazy,
    Suspense,
} from 'react'

import {
    Route,
    Routes,
} from 'react-router-dom'

import ProtectedRoute
    from './features/auth/ProtectedRoute'

const HomePage =
    lazy(
        () =>
            import(
                './pages/HomePage'
                ),
    )

const LoginPage =
    lazy(
        () =>
            import(
                './pages/LoginPage'
                ),
    )

const UnauthorizedPage =
    lazy(
        () =>
            import(
                './pages/UnauthorizedPage'
                ),
    )

const PublicSearchPage =
    lazy(
        () =>
            import(
                './pages/PublicSearchPage'
                ),
    )

const PublicProductPage =
    lazy(
        () =>
            import(
                './pages/PublicProductPage'
                ),
    )

const PublicStorePage =
    lazy(
        () =>
            import(
                './pages/PublicStorePage'
                ),
    )

const StoreDashboardPage =
    lazy(
        () =>
            import(
                './pages/StoreDashboardPage'
                ),
    )

const StoreManagementPage =
    lazy(
        () =>
            import(
                './pages/StoreManagementPage'
                ),
    )

const AdminDashboardPage =
    lazy(
        () =>
            import(
                './pages/AdminDashboardPage'
                ),
    )

const AdminCatalogPage =
    lazy(
        () =>
            import(
                './pages/AdminCatalogPage'
                ),
    )

const AdminStoresPage =
    lazy(
        () =>
            import(
                './pages/AdminStoresPage'
                ),
    )

const AdminStoreDetailPage =
    lazy(
        () =>
            import(
                './pages/AdminStoreDetailPage'
                ),
    )

const AdminActivityPage =
    lazy(
        () =>
            import(
                './pages/AdminActivityPage'
                ),
    )

export default function App() {
    return (
        <Suspense
            fallback={
                <RouteLoadingFallback />
            }
        >
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
        </Suspense>
    )
}

function RouteLoadingFallback() {
    return (
        <main
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#020817] px-5 text-slate-100"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[-220px] size-[520px] -translate-x-1/2 rounded-full bg-sky-400/[0.07] blur-[140px]"
            />

            <div className="relative flex flex-col items-center">
                <div className="relative flex size-12 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-sky-300/10" />

                    <div className="size-12 animate-spin rounded-full border-2 border-transparent border-t-sky-300 motion-reduce:animate-none" />
                </div>

                <p className="mt-4 text-xs font-medium tracking-wide text-slate-500">
                    Loading ShelfRadar...
                </p>
            </div>
        </main>
    )
}