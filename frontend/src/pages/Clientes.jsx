
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
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

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        + Novo Cliente
                    </button>
                </div>

                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF/CNPJ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limite</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dívida</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {clientes.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cpfCnpj}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {cliente.limiteCredito.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                            R$ {cliente.dividaTotal?.toLocaleString('pt-BR') || '0,00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={() => handleEdit(cliente)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cliente.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
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
        </Layout>
    );
};

export default Clientes;