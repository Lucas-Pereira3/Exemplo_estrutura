import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
  });

  useEffect(() => {
    loadEmpresas();
  }, []);

  useEffect(() => {
    filterEmpresas();
    setCurrentPage(1);
  }, [searchTerm, empresas]);

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/empresa");
      console.log("Empresas carregadas:", response.data);
      setEmpresas(response.data);
      setFilteredEmpresas(response.data);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      toast.error("Erro ao carregar empresas");
    } finally {
      setLoading(false);
    }
  };

  const filterEmpresas = () => {
    if (!searchTerm.trim()) {
      setFilteredEmpresas(empresas);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    const filtered = empresas.filter((empresa) => {
      // Busca por nome
      const nomeMatch = empresa.nome?.toLowerCase().includes(term);

      // Busca por CNPJ (remove formatação e compara)
      const cnpjClean = empresa.cnpj?.replace(/[^\d]/g, "");
      const termClean = term.replace(/[^\d]/g, "");
      const cnpjMatch = termClean.length > 0 && cnpjClean?.includes(termClean);

      // Busca por endereço
      const enderecoMatch = empresa.endereco?.toLowerCase().includes(term);

      // Busca por telefone
      const telefoneMatch = empresa.telefone?.toLowerCase().includes(term);

      // Busca por email
      const emailMatch = empresa.email?.toLowerCase().includes(term);

      return (
        nomeMatch || cnpjMatch || enderecoMatch || telefoneMatch || emailMatch
      );
    });

    console.log("Termo de busca:", term);
    console.log("Resultados encontrados:", filtered.length);

    setFilteredEmpresas(filtered);
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmpresas = filteredEmpresas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);
  const totalEmpresas = filteredEmpresas.length;

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const validateCNPJ = (cnpj) => {
    const cnpjClean = cnpj.replace(/[^\d]/g, "");
    if (cnpjClean.length !== 14) return false;

    let size = cnpjClean.length - 2;
    let numbers = cnpjClean.substring(0, size);
    const digits = cnpjClean.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpjClean.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  };

  const formatCNPJ = (value) => {
    const cnpjClean = value.replace(/[^\d]/g, "");
    if (cnpjClean.length <= 2) return cnpjClean;
    if (cnpjClean.length <= 5)
      return cnpjClean.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
    if (cnpjClean.length <= 8)
      return cnpjClean.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
    if (cnpjClean.length <= 12)
      return cnpjClean.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{0,4})/,
        "$1.$2.$3/$4"
      );
    return cnpjClean.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    } else if (formData.nome.length < 3) {
      errors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.cnpj.trim()) {
      errors.cnpj = "CNPJ é obrigatório";
    } else {
      const cnpjClean = formData.cnpj.replace(/[^\d]/g, "");
      if (cnpjClean.length !== 14) {
        errors.cnpj = "CNPJ deve ter 14 dígitos";
      } else if (!validateCNPJ(formData.cnpj)) {
        errors.cnpj = "CNPJ inválido";
      }
    }

    if (!formData.endereco.trim()) {
      errors.endereco = "Endereço é obrigatório";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnpj") {
      const formatted = formatCNPJ(value);
      setFormData({ ...formData, [name]: formatted });
      if (formErrors.cnpj) {
        setFormErrors({ ...formErrors, cnpj: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: null });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setIsSubmitting(true);

    try {
      const empresaData = {
        nome: formData.nome.trim(),
        cnpj: formData.cnpj.replace(/[^\d]/g, ""),
        endereco: formData.endereco.trim() || null,
        telefone: formData.telefone || null,
        email: formData.email || null,
      };

      console.log("Enviando dados:", empresaData);

      if (editingEmpresa) {
        const updateData = {
          idEmpresa: editingEmpresa.idEmpresa,
          ...empresaData,
        };
        await api.put(`/empresa/${editingEmpresa.idEmpresa}`, updateData);
        toast.success("Empresa atualizada com sucesso!");
      } else {
        await api.post("/empresa", empresaData);
        toast.success("Empresa cadastrada com sucesso!");
      }

      setShowModal(false);
      resetForm();
      await loadEmpresas();
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);

      if (error.response?.data?.erro) {
        toast.error(error.response.data.erro);
        if (error.response.data.erro.includes("CNPJ")) {
          setFormErrors({ ...formErrors, cnpj: error.response.data.erro });
        }
      } else {
        const message =
          error.response?.data?.message || "Erro ao salvar empresa";
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (empresa) => {
    console.log("Editando empresa:", empresa);
    setEditingEmpresa(empresa);
    setFormData({
      nome: empresa.nome || "",
      cnpj: empresa.cnpj ? formatCNPJ(empresa.cnpj) : "",
      endereco: empresa.endereco || "",
      telefone: empresa.telefone || "",
      email: empresa.email || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir a empresa "${nome}"?`)) {
      try {
        await api.delete(`/empresa/${id}`);
        toast.success("Empresa excluída com sucesso!");
        await loadEmpresas();
      } catch (error) {
        console.error("Erro ao excluir empresa:", error);
        const message =
          error.response?.data?.message ||
          "Não é possível excluir a empresa pois existem clientes vinculados a ela";
        toast.error(message);
      }
    }
  };

  const resetForm = () => {
    setEditingEmpresa(null);
    setFormData({
      nome: "",
      cnpj: "",
      endereco: "",
      telefone: "",
      email: "",
    });
    setFormErrors({});
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + 4);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie todas as empresas cadastradas no sistema
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A2B4C] hover:bg-[#152340] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2B4C] transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Empresa
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome, CNPJ, endereço, telefone ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#1A2B4C] focus:border-[#1A2B4C] sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A2B4C]"></div>
                      <span className="ml-3 text-gray-500">
                        Carregando empresas...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : currentEmpresas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? (
                        <>
                          <p className="text-lg">Nenhuma empresa encontrada</p>
                          <p className="text-sm mt-1">
                            Nenhuma empresa corresponde a "{searchTerm}"
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg">Nenhuma empresa cadastrada</p>
                          <p className="text-sm mt-1">
                            Clique em "Nova Empresa" para começar
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentEmpresas.map((empresa) => (
                  <tr
                    key={empresa.idEmpresa}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {empresa.idEmpresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {empresa.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {empresa.cnpj ? formatCNPJ(empresa.cnpj) : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {empresa.endereco || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {empresa.telefone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {empresa.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(empresa)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(empresa.idEmpresa, empresa.nome)
                        }
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        title="Excluir"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {!loading && totalEmpresas > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              {/* Total de empresas */}
              <div className="text-sm text-gray-500">
                Total de {totalEmpresas}{" "}
                {totalEmpresas === 1 ? "empresa" : "empresas"}
              </div>

              {/* Botões de paginação */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-[#1A2B4C] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEmpresa ? "Editar Empresa" : "Nova Empresa"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2B4C] focus:border-transparent ${
                    formErrors.nome ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Digite o nome da empresa"
                />
                {formErrors.nome && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  maxLength={18}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2B4C] focus:border-transparent ${
                    formErrors.cnpj ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="00.000.000/0000-00"
                />
                {formErrors.cnpj && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.cnpj}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço *
                </label>
                <textarea
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2B4C] focus:border-transparent ${
                    formErrors.endereco ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Digite o endereço completo"
                />
                {formErrors.endereco && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.endereco}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2B4C] focus:border-transparent"
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2B4C] focus:border-transparent"
                  placeholder="contato@empresa.com"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2B4C] transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1A2B4C] border border-transparent rounded-md hover:bg-[#152340] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2B4C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting
                    ? editingEmpresa
                      ? "Atualizando..."
                      : "Salvando..."
                    : editingEmpresa
                    ? "Atualizar"
                    : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empresas;
