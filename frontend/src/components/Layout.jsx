
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    HomeIcon,
    UsersIcon,
    BuildingStorefrontIcon,
    ShoppingBagIcon,
    CreditCardIcon,
    DocumentTextIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Clientes', href: '/clientes', icon: UsersIcon },
    { name: 'Empresas', href: '/empresas', icon: BuildingStorefrontIcon },
    { name: 'Compras', href: '/compras', icon: ShoppingBagIcon },
    { name: 'Faturas', href: '/faturas', icon: DocumentTextIcon },
    { name: 'Pagamentos', href: '/pagamentos', icon: CreditCardIcon },
];

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white">
                <div className="flex items-center justify-center h-16 border-b border-blue-700">
                    <h1 className="text-xl font-bold">OFIADOR</h1>
                </div>
        
                <nav className="mt-5 px-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-blue-700 mb-1"
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
        
                <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{user?.nome}</p>
                            <p className="text-xs text-blue-200">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1 rounded-full hover:bg-blue-700"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="pl-64">
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;