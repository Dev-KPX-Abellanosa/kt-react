import { Outlet, Link, useLocation } from "react-router";
import { useAuth } from "../../libs/hooks/useAuth";

export default function HomeLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col h-screen">
            {/* Navigation Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-semibold text-gray-900">Contact Manager</h1>
                            <nav className="flex space-x-4">
                                {/* <Link
                                    to="/"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        location.pathname === '/' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Home
                                </Link> */}
                                <Link
                                    to="/contacts"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        location.pathname === '/contacts' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Contacts
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user && (
                                <span className="text-sm text-gray-600">
                                    Welcome, {user.name}
                                </span>
                            )}
                            <button
                                onClick={logout}
                                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
