import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmpresa, setFilterEmpresa] = useState('todas');
    const [formData, setFormData] = useState({
        nome: '',
        cpfCnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        limiteCredito: '',
        empresaId: '',
    });
    const { user } = useAuth();

    useEffect(() => {
        loadClientes();
        loadEmpresas();
    }, []);

    const loadClientes = async () => {
        try {
            const response = await api.get('/clientes', { params: { empresaId: user?.empresaId } });
            setClientes(response.data);
        } catch (error) {
            toast.error('Erro ao carregar clientes');
        }
    };

    const loadEmpresas = async () => {
        try {
            const response = await api.get('/empresas');
            setEmpresas(response.data);
        } catch (error) {
            toast.error('Erro ao carregar empresas');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCliente) {
                await api.put(`/clientes/${editingCliente.id}`, formData);
                toast.success('Cliente atualizado com sucesso!');
            } else {
                await api.post('/clientes', { ...formData, empresaId: user?.empresaId });
                toast.success('Cliente cadastrado com sucesso!');
            }
            setShowModal(false);
            resetForm();
            loadClientes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao salvar cliente');
        }
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setFormData({
            nome: cliente.nome,
            cpfCnpj: cliente.cpfCnpj,
            telefone: cliente.telefone || '',
            email: cliente.email || '',
            endereco: cliente.endereco || '',
            limiteCredito: cliente.limiteCredito,
            empresaId: cliente.empresaId,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await api.delete(`/clientes/${id}`);
                toast.success('Cliente excluído com sucesso!');
                loadClientes();
            } catch (error) {
                toast.error('Erro ao excluir cliente');
            }
        }
    };

    const resetForm = () => {
        setEditingCliente(null);
        setFormData({
            nome: '',
            cpfCnpj: '',
            telefone: '',
            email: '',
            endereco: '',
            limiteCredito: '',
            empresaId: '',
        });
    };

    // Filtrar clientes
    const filteredClientes = clientes.filter(cliente => {
        const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.cpfCnpj.includes(searchTerm);
        const matchesEmpresa = filterEmpresa === 'todas' || cliente.empresaId === parseInt(filterEmpresa);
        return matchesSearch && matchesEmpresa;
    });

    // Função para definir o status do cliente baseado na dívida
    const getStatusInfo = (cliente) => {
        const divida = cliente.dividaTotal || 0;
        const limite = cliente.limiteCredito;
        const percentual = (divida / limite) * 100;

        if (divida >= limite) {
            return { text: 'Inadimplente', color: '#D92B14', bg: 'rgba(217, 43, 20, 0.1)' };
        } else if (percentual >= 80) {
            return { text: 'Alerta', color: '#CFC01A', bg: 'rgba(207, 192, 26, 0.1)' };
        } else {
            return { text: 'Ativo', color: '#108243', bg: 'rgba(16, 130, 67, 0.1)' };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1A2B4C' }}>Lista de Clientes</h1>
                <p className="text-sm text-gray-500 mt-1">Gerencie seus clientes e limites de crédito.</p>
            </div>

            {/* Barra de busca e filtros */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-3 flex-1 max-w-md">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar Cliente"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                        />
                    </div>
                    <button className="btn-primary whitespace-nowrap">Buscar</button>
                </div>

                <div className="flex gap-3">
                    <select
                        value={filterEmpresa}
                        onChange={(e) => setFilterEmpresa(e.target.value)}
                        className="input w-40"
                    >
                        <option value="todas">Todas Empresas</option>
                        {empresas.map(empresa => (
                            <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary whitespace-nowrap"
                        style={{ backgroundColor: '#1A2B4C' }}
                    >
                        + Novo Cliente
                    </button>
                </div>
            </div>

            {/* Filtro de empresa por botões */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilterEmpresa('todas')}
                    className={`px-4 py-2 rounded-lg transition-all ${filterEmpresa === 'todas'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Todas
                </button>
                {empresas.map(empresa => (
                    <button
                        key={empresa.id}
                        onClick={() => setFilterEmpresa(empresa.id.toString())}
                        className={`px-4 py-2 rounded-lg transition-all ${filterEmpresa === empresa.id.toString()
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {empresa.nome}
                    </button>
                ))}
            </div>

            {/* Tabela de Clientes */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF/CNPJ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Compra</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite de Crédito</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dívida Atual</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponível</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredClientes.map((cliente) => {
                                const status = getStatusInfo(cliente);
                                const disponivel = cliente.limiteCredito - (cliente.dividaTotal || 0);
                                return (
                                    <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {cliente.nome}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {cliente.cpfCnpj}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {cliente.empresa?.nome || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {cliente.ultimaCompra || '11/01/2026'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {cliente.limiteCredito.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: status.color }}>
                                            R$ {(cliente.dividaTotal || 0).toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {Math.max(0, disponivel).toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-medium"
                                                style={{ backgroundColor: status.bg, color: status.color }}
                                            >
                                                {status.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                            <button
                                                onClick={() => handleEdit(cliente)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cliente.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Paginação e Legenda */}
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#108243' }}></span>
                            <span className="text-gray-600">Ativo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#CFC01A' }}></span>
                            <span className="text-gray-600">Limite Próximo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D92B14' }}></span>
                            <span className="text-gray-600">Inadimplente / Limite Esgotado</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Número de Clientes: 1 2 3 ... {filteredClientes.length}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#1A2B4C' }}>
                            {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome *</label>
                                <input
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CPF/CNPJ *</label>
                                <input
                                    name="cpfCnpj"
                                    value={formData.cpfCnpj}
                                    onChange={handleChange}
                                    required
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                <textarea
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    rows="2"
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Limite de Crédito *</label>
                                <input
                                    name="limiteCredito"
                                    type="number"
                                    step="0.01"
                                    value={formData.limiteCredito}
                                    onChange={handleChange}
                                    required
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Empresa</label>
                                <select
                                    name="empresaId"
                                    value={formData.empresaId}
                                    onChange={handleChange}
                                    className="input mt-1"
                                >
                                    <option value="">Selecione uma empresa</option>
                                    {empresas.map((empresa) => (
                                        <option key={empresa.id} value={empresa.id}>
                                            {empresa.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCliente ? 'Atualizar' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clientes;