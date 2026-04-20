import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo1 from "../assets/logo1.png";
import {
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Clientes", href: "/clientes", icon: UsersIcon },
  { name: "Empresas", href: "/empresas", icon: BuildingStorefrontIcon },
  { name: "Compras", href: "/compras", icon: ShoppingBagIcon },
  { name: "Faturas", href: "/faturas", icon: DocumentTextIcon },
  { name: "Pagamentos", href: "/pagamentos", icon: CreditCardIcon },
  { name: "Relatórios", href: "/relatorios", icon: ChartBarIcon },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72">
        <div
          className="flex flex-col flex-1"
          style={{ backgroundColor: "#1A2B4C" }}
        >
          <div
            className="flex flex-col items-center justify-center pt-6 pb-2 px-4 border-b"
            style={{ borderColor: "#2A3E64" }}
          >
            <div className="mb-0">
              <img
                src={logo1}
                className="w-32 object-contain"
                style={{ display: "block" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/64x64?text=F";
                }}
              />
            </div>
            <h1
              className="text-white text-center"
              style={{
                fontFamily: "Afacad, sans-serif",
                fontWeight: "700",
                fontSize: "32px",
                lineHeight: "1",
                marginTop: "0",
              }}
            >
              OFIADOR
            </h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white bg-opacity-20 text-white shadow-sm"
                      : "text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div
            className="px-4 py-6 border-t"
            style={{ borderColor: "#2A3E64" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.nome || "Usuário"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.login || "usuario@email.com"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                title="Sair"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header mobile */}
      <div className="lg:hidden">
        <div
          className="fixed top-0 left-0 right-0 z-20"
          style={{ backgroundColor: "#1A2B4C" }}
        >
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex flex-col items-center">
              <img
                src={logo1}
                alt="Logo Fiador"
                className="h-8 w-auto mb-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/24x24?text=F";
                }}
              />
              <h1
                className="text-white"
                style={{
                  fontFamily: "Afacad, sans-serif",
                  fontWeight: "bold",
                  fontSize: "20px",
                  lineHeight: "1.2",
                  marginTop: "-2px",
                }}
              >
                OFIADOR
              </h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="fixed inset-y-0 left-0 w-72 shadow-xl"
              style={{ backgroundColor: "#1A2B4C" }}
            >
              <div className="flex flex-col h-full">
                <div
                  className="flex flex-col items-center justify-center pt-8 pb-6 px-4 border-b"
                  style={{ borderColor: "#2A3E64" }}
                >
                  <div className="mb-0">
                    <img
                      src={logo1}
                      alt="Logo Fiador"
                      className="h-24 w-auto mx-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/64x64?text=F";
                      }}
                    />
                  </div>
                  <h1
                    className="text-white text-center"
                    style={{
                      fontFamily: "Afacad, sans-serif",
                      fontWeight: "bold",
                      fontSize: "40px",
                      lineHeight: "1.2",
                      marginTop: "-4px",
                    }}
                  >
                    OFIADOR
                  </h1>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-white bg-opacity-20 text-white"
                            : "text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white"
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div
                  className="px-4 py-6 border-t"
                  style={{ borderColor: "#2A3E64" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user?.nome}
                      </p>
                      <p className="text-xs text-gray-400">{user?.login}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo principal - Área onde as páginas serão renderizadas */}
      <div className="lg:pl-72">
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
