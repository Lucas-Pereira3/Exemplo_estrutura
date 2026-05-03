import React, { useState } from "react";
import {
  DocumentTextIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const empresasMock = ["Loja A", "Loja B", "Loja C"];
const clientesMock = ["Astolfo", "Pedro", "Marcos"];

const dadosContasAReceber = [
  {
    cliente: "Astolfo",
    empresa: "Loja A",
    totalDivida: 2500,
    valorPago: 0,
    valorRestante: 2500,
    proximoVencimento: "15/01/2026",
    diasAtraso: 8,
  },
  {
    cliente: "Pedro",
    empresa: "Loja B",
    totalDivida: 5000,
    valorPago: 1000,
    valorRestante: 4000,
    proximoVencimento: "20/01/2026",
    diasAtraso: 3,
  },
  {
    cliente: "Marcos",
    empresa: "Loja C",
    totalDivida: 10000,
    valorPago: 2500,
    valorRestante: 7500,
    proximoVencimento: "01/02/2026",
    diasAtraso: 0,
  },
];

const dadosContasPagas = [
  {
    cliente: "Astolfo",
    empresa: "Loja A",
    totalDivida: 1200,
    valorPago: 1200,
    valorRestante: 0,
    proximoVencimento: "10/12/2025",
    diasAtraso: 0,
  },
  {
    cliente: "Pedro",
    empresa: "Loja B",
    totalDivida: 3000,
    valorPago: 3000,
    valorRestante: 0,
    proximoVencimento: "05/12/2025",
    diasAtraso: 0,
  },
];

const dadosGeral = [
  {
    cliente: "Astolfo",
    empresa: "Loja A",
    totalDivida: 3700,
    valorPago: 1200,
    valorRestante: 2500,
    proximoVencimento: "15/01/2026",
    diasAtraso: 8,
  },
  {
    cliente: "Pedro",
    empresa: "Loja B",
    totalDivida: 8000,
    valorPago: 4000,
    valorRestante: 4000,
    proximoVencimento: "20/01/2026",
    diasAtraso: 3,
  },
  {
    cliente: "Marcos",
    empresa: "Loja C",
    totalDivida: 10000,
    valorPago: 2500,
    valorRestante: 7500,
    proximoVencimento: "01/02/2026",
    diasAtraso: 0,
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const StatusBall = ({ diasAtraso }) => {
  if (diasAtraso > 7)
    return <span className="inline-block w-3 h-3 rounded-full bg-red-500" title="Atrasado" />;
  if (diasAtraso > 0)
    return <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" title="Vence em 7 dias" />;
  return <span className="inline-block w-3 h-3 rounded-full bg-green-500" title="Em dia" />;
};

const Relatorios = () => {
  const [abaSelecionada, setAbaSelecionada] = useState("receber");
  const [empresa, setEmpresa] = useState("");
  const [cliente, setCliente] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [periodoRapido, setPeriodoRapido] = useState("");

  const abas = [
    { id: "receber", label: "Contas a Receber", icon: DocumentTextIcon },
    { id: "pagas", label: "Contas Pagas", icon: BanknotesIcon },
    { id: "geral", label: "Geral", icon: PresentationChartLineIcon },
  ];

  const dadosPorAba = {
    receber: dadosContasAReceber,
    pagas: dadosContasPagas,
    geral: dadosGeral,
  };

  const tituloPorAba = {
    receber: "Resultado: Contas a Receber",
    pagas: "Resultado: Contas Pagas",
    geral: "Resultado: Geral",
  };

  const dados = dadosPorAba[abaSelecionada];

  const totalEmAberto = dados.reduce((acc, d) => acc + d.valorRestante, 0);
  const totalPago = dados.reduce((acc, d) => acc + d.valorPago, 0);
  const totalPendente = dados.reduce(
    (acc, d) => acc + (d.diasAtraso > 0 ? d.valorRestante : 0),
    0
  );

  const handlePeriodoRapido = (periodo) => {
    setPeriodoRapido(periodo);
    const hoje = new Date();
    if (periodo === "mes") {
      const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      setDataInicio(inicio.toISOString().split("T")[0]);
      setDataFim(fim.toISOString().split("T")[0]);
    } else if (periodo === "30dias") {
      const inicio = new Date(hoje);
      inicio.setDate(hoje.getDate() - 30);
      setDataInicio(inicio.toISOString().split("T")[0]);
      setDataFim(hoje.toISOString().split("T")[0]);
    }
  };

  const handleLimpar = () => {
    setEmpresa("");
    setCliente("");
    setDataInicio("");
    setDataFim("");
    setPeriodoRapido("");
  };

  return (
    <div className="w-full">
      {/* Título */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Central de Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie Relatórios Financeiros</p>
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {abas.map((aba) => {
          const Icon = aba.icon;
          const ativa = abaSelecionada === aba.id;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaSelecionada(aba.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                ativa
                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                  : "bg-white border-gray-800 text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{aba.label}</span>
            </button>
          );
        })}
      </div>

      {/* Layout: Filtros + Conteúdo */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Painel de Filtros */}
        <div className="w-full lg:w-56 xl:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-base font-semibold text-gray-800">Filtros</h2>
            </div>

            {/* Empresa + Cliente em linha no mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa:</label>
                <select
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todas</option>
                  {empresasMock.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente:</label>
                <select
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos</option>
                  {clientesMock.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Período */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Período:</label>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-0.5 block">de:</label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => { setDataInicio(e.target.value); setPeriodoRapido(""); }}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-0.5 block">até:</label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => { setDataFim(e.target.value); setPeriodoRapido(""); }}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Botões período rápido */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[
                { id: "mes", label: "Este Mês" },
                { id: "30dias", label: "Últimos 30 dias" },
                { id: "personalizado", label: "Personalizado" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodoRapido(p.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    periodoRapido === p.id
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <button
                onClick={handleLimpar}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Limpar Filtros
              </button>
              <button className="flex-1 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all">
                Consultar
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          {/* Título resultado + botões exportar na mesma linha */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {tituloPorAba[abaSelecionada]}
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all whitespace-nowrap">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-all whitespace-nowrap">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar Excel
              </button>
            </div>
          </div>

          {/* Cards de totais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="border-l-4 border-blue-500 bg-white rounded-lg shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Total em Aberto</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{formatCurrency(totalEmAberto)}</p>
            </div>
            <div className="border-l-4 border-green-500 bg-white rounded-lg shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Total Pago no Período</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{formatCurrency(totalPago)}</p>
            </div>
            <div className="border-l-4 border-yellow-400 bg-white rounded-lg shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Total Pendente</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{formatCurrency(totalPendente)}</p>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Cliente", "Empresa", "Total Dívida", "Valor Pago", "Valor Restante", "Próximo Vencimento", "Dias Atraso", ""].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {dados.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-gray-800 font-medium whitespace-nowrap">{row.cliente}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.empresa}</td>
                    <td className="px-3 py-3 text-gray-800 whitespace-nowrap">{formatCurrency(row.totalDivida)}</td>
                    <td className="px-3 py-3 text-gray-800 whitespace-nowrap">{formatCurrency(row.valorPago)}</td>
                    <td className="px-3 py-3 text-gray-800 whitespace-nowrap">{formatCurrency(row.valorRestante)}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.proximoVencimento}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.diasAtraso}</td>
                    <td className="px-3 py-3">
                      <StatusBall diasAtraso={row.diasAtraso} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="font-medium">Legenda:</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              Atrasado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0" />
              Vence em 7 dias
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              Em dia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
