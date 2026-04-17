// frontend/src/pages/Empresas.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEmpresa, setEditingEmpresa] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        cnpj: '',
        endereco: '',
    });

    useEffect(() => {
        loadEmpresas();
    }, []);

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
            if (editingEmpresa) {
                await api.put(`/empresas/${editingEmpresa.id}`, formData);
                toast.success('Empresa atualizada com sucesso!');
            } else {
                await api.post('/empresas', formData);
                toast.success('Empresa cadastrada com sucesso!');
            }
            setShowModal(false);
            resetForm();
            loadEmpresas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao salvar empresa');
        }
    };

    const handleEdit = (empresa) => {
        setEditingEmpresa(empresa);
        setFormData({
            nome: empresa.nome,
            cnpj: empresa.cnpj,
            endereco: empresa.endereco || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
            try {
                await api.delete(`/empresas/${id}`);
                toast.success('Empresa excluída com sucesso!');
                loadEmpresas();
            } catch (error) {
                toast.error('Erro ao excluir empresa');
            }
        }
    };

    const resetForm = () => {
        setEditingEmpresa(null);
        setFormData({
            nome: '',
            cnpj: '',
            endereco: '',
        });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        + Nova Empresa
                    </button>
                </div>

                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {empresas.map((empresa) => (
                                    <tr key={empresa.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.nome}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.cnpj}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{empresa.endereco}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button onClick={() => handleEdit(empresa)} className="text-blue-600 hover:text-blue-800">
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(empresa.id)} className="text-red-600 hover:text-red-800">
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
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">
                                {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome *</label>
                                    <input name="nome" value={formData.nome} onChange={handleChange} required className="input mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CNPJ *</label>
                                    <input name="cnpj" value={formData.cnpj} onChange={handleChange} required className="input mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                    <textarea name="endereco" value={formData.endereco} onChange={handleChange} rows="2" className="input mt-1" />
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingEmpresa ? 'Atualizar' : 'Salvar'}
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

export default Empresas;