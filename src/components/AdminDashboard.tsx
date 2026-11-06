import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ArrowUpRight,
  Filter,
  Calendar,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';

export interface Note {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  processo?: string;
  area: string;
  mensagem?: string;
  status: 'novo' | 'em_atendimento' | 'agendado' | 'proposta' | 'concluido' | 'arquivado';
  createdAt: string;
  updatedAt: string;
  notes: Note[];
  source?: string;
}

interface AdminDashboardProps {
  leads: Lead[];
  onGoToKanban?: (statusFilter?: Lead['status']) => void;
}

const STAGE_LABELS: Record<Lead['status'], { label: string; color: string; bg: string }> = {
  novo: { label: 'Novos Contatos', color: '#3b82f6', bg: 'bg-blue-500' },
  em_atendimento: { label: 'Em Triagem / Análise', color: '#f59e0b', bg: 'bg-amber-500' },
  agendado: { label: 'Consulta Agendada', color: '#a855f7', bg: 'bg-purple-500' },
  proposta: { label: 'Proposta / Contrato', color: '#6366f1', bg: 'bg-indigo-500' },
  concluido: { label: 'Cliente Ativo / Fechado', color: '#10b981', bg: 'bg-emerald-500' },
  arquivado: { label: 'Arquivados', color: '#9ca3af', bg: 'bg-neutral-400' }
};

const AREA_PALETTE = ['#881337', '#b45309', '#0369a1', '#047857', '#6d28d9', '#be123c', '#475569'];

export default function AdminDashboard({ leads, onGoToKanban }: AdminDashboardProps) {
  const [periodFilter, setPeriodFilter] = useState<'all' | '30d' | '7d'>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');

  // Filter leads by selected period
  const filteredLeads = useMemo(() => {
    const now = new Date().getTime();
    return leads.filter((lead) => {
      const leadTime = new Date(lead.createdAt).getTime();
      if (periodFilter === '7d') {
        const diffDays = (now - leadTime) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      } else if (periodFilter === '30d') {
        const diffDays = (now - leadTime) / (1000 * 3600 * 24);
        if (diffDays > 30) return false;
      }
      if (selectedArea !== 'all' && lead.area !== selectedArea) {
        return false;
      }
      return true;
    });
  }, [leads, periodFilter, selectedArea]);

  // General KPIs
  const totalLeads = filteredLeads.length;
  const closedLeads = filteredLeads.filter((l) => l.status === 'concluido').length;
  const inPipelineLeads = filteredLeads.filter(
    (l) => l.status === 'agendado' || l.status === 'proposta' || l.status === 'em_atendimento'
  ).length;
  const newLeads = filteredLeads.filter((l) => l.status === 'novo').length;
  const archivedLeads = filteredLeads.filter((l) => l.status === 'arquivado').length;

  const globalConversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  // Kanban Stage Breakdown Data for Recharts BarChart
  const kanbanStageData = useMemo(() => {
    const stages: Lead['status'][] = [
      'novo',
      'em_atendimento',
      'agendado',
      'proposta',
      'concluido',
      'arquivado'
    ];

    return stages.map((st) => {
      const count = filteredLeads.filter((l) => l.status === st).length;
      const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
      return {
        stageId: st,
        etapa: STAGE_LABELS[st].label,
        abreviado: STAGE_LABELS[st].label.split(' ')[0],
        quantidade: count,
        percentual: pct,
        fill: STAGE_LABELS[st].color
      };
    });
  }, [filteredLeads, totalLeads]);

  // Conversion Rate by Legal Practice Area
  const areaPerformanceData = useMemo(() => {
    const areaMap: Record<string, { total: number; concluidos: number; emPipeline: number }> = {};

    filteredLeads.forEach((lead) => {
      const area = lead.area || 'Outras Áreas';
      if (!areaMap[area]) {
        areaMap[area] = { total: 0, concluidos: 0, emPipeline: 0 };
      }
      areaMap[area].total += 1;
      if (lead.status === 'concluido') {
        areaMap[area].concluidos += 1;
      } else if (lead.status === 'agendado' || lead.status === 'proposta' || lead.status === 'em_atendimento') {
        areaMap[area].emPipeline += 1;
      }
    });

    const list = Object.keys(areaMap).map((area, idx) => {
      const item = areaMap[area];
      const convRate = item.total > 0 ? Number(((item.concluidos / item.total) * 100).toFixed(1)) : 0;
      return {
        area,
        total: item.total,
        concluidos: item.concluidos,
        emPipeline: item.emPipeline,
        taxaConversao: convRate,
        cor: AREA_PALETTE[idx % AREA_PALETTE.length]
      };
    });

    // Sort by highest total leads
    return list.sort((a, b) => b.total - a.total);
  }, [filteredLeads]);

  // Pie Chart Data: Distribution by Area
  const areaDistributionPieData = useMemo(() => {
    return areaPerformanceData.map((item) => ({
      name: item.area,
      value: item.total,
      concluidos: item.concluidos,
      taxa: item.taxaConversao
    }));
  }, [areaPerformanceData]);

  // Time Series Data (Leads over the last 7 days or chronological buckets)
  const timelineData = useMemo(() => {
    const dayMap: Record<string, { total: number; fechados: number }> = {};
    const now = new Date();

    // Initialize last 7 days keys
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      dayMap[key] = { total: 0, fechados: 0 };
    }

    filteredLeads.forEach((lead) => {
      const leadDate = new Date(lead.createdAt);
      const key = leadDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (dayMap[key]) {
        dayMap[key].total += 1;
        if (lead.status === 'concluido') {
          dayMap[key].fechados += 1;
        }
      }
    });

    return Object.keys(dayMap).map((dateKey) => ({
      data: dateKey,
      leads: dayMap[dateKey].total,
      fechados: dayMap[dateKey].fechados
    }));
  }, [filteredLeads]);

  // Unique areas for filtering
  const allDistinctAreas = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.area) set.add(l.area);
    });
    return Array.from(set);
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Top Banner and Filter Controls */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-lg text-neutral-900">
              Dashboard de Inteligência & Métricas CRM
            </h2>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Tempo Real
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Indicadores de conversão por área jurídica, volume do funil e acompanhamento estratégico da banca.
          </p>
        </div>

        {/* Period & Area Filter Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                periodFilter === 'all'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setPeriodFilter('30d')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                periodFilter === '30d'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              30 Dias
            </button>
            <button
              onClick={() => setPeriodFilter('7d')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                periodFilter === '7d'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              7 Dias
            </button>
          </div>

          {allDistinctAreas.length > 0 && (
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">Todas as Áreas Jurídicas</option>
              {allDistinctAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Leads</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-neutral-900">{totalLeads}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span className="text-blue-600 font-bold">{newLeads} novos</span> aguardando primeiro contato
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Em Negociação</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-neutral-900">{inPipelineLeads}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>Triagens, consultas e propostas em curso</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clientes Fechados</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-700">{closedLeads}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span className="font-semibold text-emerald-600">Causas ganhas / ativas</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Conversão</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-neutral-900">{globalConversionRate}%</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>Conversão de visitantes para contratos</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row 1: Volume por Etapa do Kanban + Taxa de Conversão por Área */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Volume de Leads por Etapa do Kanban (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-700" />
                <h3 className="font-serif font-bold text-sm text-neutral-900">
                  Volume de Leads por Etapa do Kanban
                </h3>
              </div>
              {onGoToKanban && (
                <button
                  onClick={() => onGoToKanban()}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 group"
                >
                  <span>Abrir Quadro</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Distribuição quantitativa de contatos em cada estágio do pipeline jurídico
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kanbanStageData}
                  margin={{ top: 15, right: 15, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="abreviado"
                    tick={{ fontSize: 11, fill: '#666' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#666' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} lead(s)`, 'Quantidade']}
                    labelFormatter={(label: any, payload: any) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.etapa;
                      }
                      return label;
                    }}
                    contentStyle={{
                      backgroundColor: '#171717',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                  <Bar
                    dataKey="quantidade"
                    radius={[6, 6, 0, 0]}
                    onClick={(data: any) => {
                      const st = data?.stageId || data?.payload?.stageId;
                      if (onGoToKanban && st) {
                        onGoToKanban(st as Lead['status']);
                      }
                    }}
                    cursor="pointer"
                  >
                    {kanbanStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Legend Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-neutral-100 text-[11px] text-neutral-600">
            {kanbanStageData.map((item) => (
              <div
                key={item.stageId}
                onClick={() => onGoToKanban && onGoToKanban(item.stageId as Lead['status'])}
                className="cursor-pointer hover:bg-neutral-50 p-1.5 rounded-lg transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.fill }}
                  ></span>
                  <span className="font-bold text-neutral-900">{item.quantidade}</span>
                </div>
                <div className="text-[10px] text-neutral-500 truncate" title={item.etapa}>
                  {item.abreviado}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Taxa de Conversão por Área de Atuação (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-neutral-700" />
                <h3 className="font-serif font-bold text-sm text-neutral-900">
                  Taxa de Conversão por Área
                </h3>
              </div>
              <span className="text-[11px] font-bold text-neutral-500">
                % Fechamento
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Percentual de leads convertidos em contratos ativos por ramo do direito
            </p>

            <div className="h-64 w-full">
              {areaPerformanceData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                  Nenhum dado registrado para o período
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={areaPerformanceData}
                    layout="vertical"
                    margin={{ top: 10, right: 25, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      unit="%"
                      tick={{ fontSize: 10, fill: '#666' }}
                    />
                    <YAxis
                      dataKey="area"
                      type="category"
                      width={110}
                      tick={{ fontSize: 10, fill: '#444' }}
                      tickFormatter={(val) => {
                        const words = val.split(' ');
                        return words.slice(0, 2).join(' ') + (words.length > 2 ? '...' : '');
                      }}
                    />
                    <Tooltip
                      formatter={(val: any, name: any, item: any) => [
                        `${val}% (${item.payload.concluidos} de ${item.payload.total} leads)`,
                        'Taxa de Conversão'
                      ]}
                      contentStyle={{
                        backgroundColor: '#171717',
                        color: '#fff',
                        borderRadius: '0.75rem',
                        border: 'none',
                        fontSize: '12px'
                      }}
                    />
                    <Bar
                      dataKey="taxaConversao"
                      fill="#881337"
                      radius={[0, 6, 6, 0]}
                      name="Taxa de Conversão"
                    >
                      {areaPerformanceData.map((entry, index) => (
                        <Cell key={`area-cell-${index}`} fill={entry.cor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Líder de Conversão:</span>
            <strong className="text-neutral-900 font-bold">
              {areaPerformanceData[0]?.area ? (
                <span>
                  {areaPerformanceData[0].area} ({areaPerformanceData[0].taxaConversao}%)
                </span>
              ) : (
                '—'
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* Row 2: Distribuição Geral por Área (Pie Chart) + Evolução Temporal (Area Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pie Chart: Proporção de Ingressos por Área (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-neutral-700" />
            <h3 className="font-serif font-bold text-sm text-neutral-900">
              Distribuição da Demanda Jurídica
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mb-4">
            Proporção de novas consultas por especialidade advocatícia
          </p>

          <div className="h-56 w-full">
            {areaDistributionPieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                Sem consultas no período
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaDistributionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {areaDistributionPieData.map((_, index) => (
                      <Cell
                        key={`pie-cell-${index}`}
                        fill={AREA_PALETTE[index % AREA_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [
                      `${val} leads (${item.payload.taxa}% conv.)`,
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: '#171717',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-neutral-100 max-h-36 overflow-y-auto">
            {areaDistributionPieData.map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-[11px] text-neutral-600"
              >
                <div className="flex items-center gap-2 truncate max-w-[200px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: AREA_PALETTE[idx % AREA_PALETTE.length] }}
                  ></span>
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900">{item.value}</span>
                  <span className="text-[10px] text-neutral-400">
                    ({totalLeads > 0 ? Math.round((item.value / totalLeads) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart: Tendência Temporal dos Últimos Dias (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-700" />
                <h3 className="font-serif font-bold text-sm text-neutral-900">
                  Fluxo Temporal de Captação & Fechamentos
                </h3>
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">Últimos 7 dias</span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Comparativo entre contatos recebidos e clientes que firmaram procuração
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#881337" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#881337" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorFechados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="data" tick={{ fontSize: 11, fill: '#666' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#666' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171717',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    name="Contatos Recebidos"
                    stroke="#881337"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                  />
                  <Area
                    type="monotone"
                    dataKey="fechados"
                    name="Clientes Fechados"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFechados)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Eficiência do Funil:</span>
            <span className="text-neutral-700">
              Taxa de assertividade nos últimos 7 dias baseada em consultas realizadas.
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Table: Performance Detalhada por Especialidade */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-700" />
            <h3 className="font-serif font-bold text-sm text-neutral-900">
              Tabela de Desempenho & Conversão Estratégica
            </h3>
          </div>
          <span className="text-xs text-neutral-500">
            {areaPerformanceData.length} áreas registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold">
                <th className="py-2.5 px-3">Especialidade / Ramo</th>
                <th className="py-2.5 px-3 text-center">Total Contatos</th>
                <th className="py-2.5 px-3 text-center">Em Negociação</th>
                <th className="py-2.5 px-3 text-center">Clientes Ativos</th>
                <th className="py-2.5 px-3 text-right">Taxa de Conversão</th>
                <th className="py-2.5 px-3 text-center">Status de Eficiência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {areaPerformanceData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-neutral-400">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                areaPerformanceData.map((row) => (
                  <tr key={row.area} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-neutral-900 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: row.cor }}
                      ></span>
                      <span>{row.area}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold">{row.total}</td>
                    <td className="py-3 px-3 text-center text-amber-700 font-medium">
                      {row.emPipeline}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-700 font-bold">
                      {row.concluidos}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${Math.min(row.taxaConversao, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-neutral-900">{row.taxaConversao}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          row.taxaConversao >= 50
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.taxaConversao >= 20
                            ? 'bg-blue-100 text-blue-800'
                            : row.taxaConversao > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {row.taxaConversao >= 50
                          ? 'Excelente'
                          : row.taxaConversao >= 20
                          ? 'Saudável'
                          : row.taxaConversao > 0
                          ? 'Em Aquecimento'
                          : 'Sem Fechamentos'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
