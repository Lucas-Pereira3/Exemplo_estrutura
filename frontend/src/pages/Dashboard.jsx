
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalClientes: 0,
        totalDividas: 0,
        totalPago: 0,
        totalPendente: 0,
    });
    const [ultimasCompras, setUltimasCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [clientesRes, comprasRes, faturasRes] = await Promise.all([
                api.get('/clientes', { params: { empresaId: user?.empresaId } }),
                api.get('/compras'),
                api.get('/faturas'),
            ]);

            const clientes = clientesRes.data;
            const compras = comprasRes.data;
            const faturas = faturasRes.data;

            const totalDividas = compras.reduce((sum, compra) => sum + compra.valorTotal, 0);
            const totalPago = faturas.filter(f => f.status === 'Paga').reduce((sum, f) => sum + f.valorTotal, 0);
            const totalPendente = faturas.filter(f => f.status === 'Pendente').reduce((sum, f) => sum + f.valorTotal, 0);

            setStats({
                totalClientes: clientes.length,
                totalDividas,
                totalPago,
                totalPendente,
            });

            setUltimasCompras(compras.slice(0, 5));
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const barData = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
            {
                label: 'Vendas',
                data: [12000, 19000, 15000, 22000, 18000, 25000],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    const doughnutData = {
        labels: ['Pago', 'Pendente'],
        datasets: [
            {
                data: [stats.totalPago, stats.totalPendente],
                backgroundColor: ['#10b981', '#ef4444'],
            },
        ],
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Carregando...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalClientes}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-500">Total em Dívidas</h3>
                        <p className="text-2xl font-bold text-red-600">
                            R$ {stats.totalDividas.toLocaleString('pt-BR')}
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-500">Total Pago</h3>
                        <p className="text-2xl font-bold text-green-600">
                            R$ {stats.totalPago.toLocaleString('pt-BR')}
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="text-sm font-medium text-gray-500">Total Pendente</h3>
                        <p className="text-2xl font-bold text-yellow-600">
                            R$ {stats.totalPendente.toLocaleString('pt-BR')}
                        </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Vendas Mensais</h2>
                        <Bar data={barData} />
                    </div>
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Status de Pagamentos</h2>
                        <div className="w-64 mx-auto">
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>
                </div>

                {/* Últimas Compras */}
                <div className="card">
                    <h2 className="text-lg font-semibold mb-4">Últimas Compras</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Valor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {ultimasCompras.map((compra) => (
                                    <tr key={compra.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {compra.clienteNome}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(compra.dataCompra).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {compra.valorTotal.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${compra.status === 'Pago' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {compra.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;