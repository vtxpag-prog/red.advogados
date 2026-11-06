import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  Copy,
  MessageSquare,
  Send,
  HeartHandshake,
  BookOpen,
  Compass,
  AlertCircle,
  ThumbsUp,
  Check,
  ArrowRight,
  Briefcase,
  Layers,
  Banknote,
  HelpCircle,
  BadgeCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  Share2,
  Globe,
  Star,
  Navigation,
  ExternalLink,
  Car,
  Bus,
  Bot,
  Sparkles,
  Lock,
  Kanban,
  UserPlus
} from 'lucide-react';
import WhatsAppBotSimulator from './components/WhatsAppBotSimulator.tsx';
import VisitorCaptureModal from './components/VisitorCaptureModal.tsx';
import AdminCRM from './components/AdminCRM.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<'crm' | 'simulator' | 'etapa6' | 'etapa5' | 'etapa4' | 'etapa3' | 'etapa2' | 'dossier' | 'preview' | 'flow'>('crm');
  const [copied, setCopied] = useState<string | null>(null);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState<number>(0);
  const [subTabEtapa5, setSubTabEtapa5] = useState<'gmb' | 'cities' | 'social'>('gmb');
  const [subTabEtapa6, setSubTabEtapa6] = useState<'whatsapp' | 'blog' | 'reputation'>('whatsapp');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [caseType, setCaseType] = useState('Direito Administrativo & Servidores Públicos');
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultCpf, setConsultCpf] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultProcesso, setConsultProcesso] = useState('');
  const [consultMsg, setConsultMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!consultName.trim() || !consultEmail.trim() || !consultCpf.trim() || !consultPhone.trim()) {
      setSubmitError('Por favor, preencha todos os campos obrigatórios (Nome, E-mail, CPF e Telefone).');
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch('/api/leads/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: consultName.trim(),
          email: consultEmail.trim(),
          cpf: consultCpf.trim(),
          telefone: consultPhone.trim(),
          processo: consultProcesso.trim(),
          area: caseType,
          mensagem: consultMsg.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar solicitação.');
      }

      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setConsultName('');
        setConsultEmail('');
        setConsultCpf('');
        setConsultPhone('');
        setConsultProcesso('');
        setConsultMsg('');
      }, 5000);
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao enviar dados. Tente novamente.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setConsultName('');
      setConsultPhone('');
      setConsultMsg('');
    }, 4000);
  };

  const stages = [
    { num: 1, name: 'Identidade & Essência', status: 'completed', desc: 'Aprovada ✅' },
    { num: 2, name: 'Matriz de Serviços & Valores', status: 'completed', desc: 'Aprovada ✅' },
    { num: 3, name: 'Diferenciais & Prova Social', status: 'completed', desc: 'Aprovada ✅' },
    { num: 4, name: 'Landing Page Completa', status: 'completed', desc: 'Aprovada ✅' },
    { num: 5, name: 'SEO Local & Redes', status: 'completed', desc: 'Aprovada ✅' },
    { num: 6, name: 'Ecossistema de Atendimento', status: 'active', desc: 'Em Validação Final' },
  ];

  const serviceAreas = [
    {
      id: 0,
      title: 'Direito Administrativo & Servidores Públicos',
      subtitle: 'Defesa de direitos perante órgãos do Estado e Municípios',
      icon: Scale,
      whoNeeds: 'Servidores públicos (efetivos ou comissionados), candidatos de concursos públicos, cidadãos que dependem de licenças ou decisões do Poder Público e empresas participantes de licitações.',
      realProblem: 'Decisões arbitrárias de órgãos públicos, injustiças em Processos Administrativos Disciplinares (PAD), eliminações indevidas em concursos ou retenção de pagamentos pelo Estado.',
      resultGained: 'Segurança contra perseguições e abusos de poder, anulação de atos ilegais, garantia da posse em concurso ou liberação de direitos represados.',
      firstStep: 'Reunir o ato oficial, edital ou notificação recebida e agendar uma análise técnica prévia.'
    },
    {
      id: 1,
      title: 'Direito Cível, Indenizações & Contratos',
      subtitle: 'Resolução de litígios entre pessoas físicas e jurídicas',
      icon: Building2,
      whoNeeds: 'Pessoas e famílias que enfrentam descumprimento de acordos, negativações indevidas no SPC/Serasa, prejuízos materiais causados por terceiros ou cobranças abusivas.',
      realProblem: 'Desgaste financeiro e emocional com conflitos que a outra parte se recusa a resolver amigavelmente, causando angústia diária.',
      resultGained: 'Ressarcimento de prejuízos econômicos, reparação por danos morais, cancelamento de cobranças indevidas e restauração da paz jurídica.',
      firstStep: 'Separar comprovantes de pagamento, conversas e contratos para traçarmos a estratégia de cobrança ou defesa.'
    },
    {
      id: 2,
      title: 'Direito Empresarial & Gestão de Riscos',
      subtitle: 'Blindagem preventiva e contratos para pequenas e médias empresas',
      icon: Briefcase,
      whoNeeds: 'Empresários, sócios e gestores que desejam proteger o patrimônio da empresa e evitar passivos judiciais que possam comprometer o fluxo de caixa.',
      realProblem: 'Contratos mal redigidos, fragilidade com fornecedores, disputas entre sócios ou insegurança regulatória que drena o tempo do gestor.',
      resultGained: 'Empresa blindada contra surpresas jurídicas, operações comerciais seguras e tranquilidade para focar no crescimento do negócio.',
      firstStep: 'Diagnóstico dos contratos atuais da empresa e mapeamento dos pontos de maior vulnerabilidade.'
    },
    {
      id: 3,
      title: 'Direito da Cultura & Propriedade Intelectual',
      subtitle: 'Proteção jurídica para artistas, criadores e projetos culturais',
      icon: BookOpen,
      whoNeeds: 'Produtores culturais, artistas, companhias teatrais, escritores e realizadores que participam de editais públicos (Lei Rouanet, Paulo Gustavo, Aldir Blanc) ou criam obras autorais.',
      realProblem: 'Insegurança na prestação de contas de editais públicos, risco de glosa de recursos e uso indevido de obras artísticas sem autorização.',
      resultGained: 'Projetos culturais aprovados e executados com tranquilidade documental, defesa autoral resguardada e respeito à criação artística.',
      firstStep: 'Apresentar o edital ou a obra a ser protegida para estruturarmos os termos legais cabíveis.'
    },
    {
      id: 4,
      title: 'Parcerias Público-Privadas (PPP)',
      subtitle: 'Estruturação técnica entre a iniciativa privada e o setor público',
      icon: Layers,
      whoNeeds: 'Empresas e consórcios que pretendem estruturar concessões, parcerias público-privadas e projetos de investimento com governos estaduais ou municipais.',
      realProblem: 'Complexidade de modelagem contratual, matrizes de riscos assimétricas e lentidão burocrática no diálogo institucional com entes governamentais.',
      resultGained: 'Estruturação jurídica sólida, governança transparente e viabilidade econômico-financeira protegida a longo prazo.',
      firstStep: 'Reunião de alinhamento estratégico para avaliar a modelagem e a viabilidade do projeto.'
    }
  ];

  const stepsFlow = [
    {
      step: '1',
      title: 'Primeiro Contato Sem Barreiras',
      desc: 'Você entra em contato pelo WhatsApp (31) 98334-7116 ou formulário e conta em poucas palavras o que está acontecendo. Sem juridiquês e sem formulários burocráticos.'
    },
    {
      step: '2',
      title: 'Conversa Inicial e Escuta Atenta',
      desc: 'Reunião presencial no escritório de Belo Horizonte ou por videoconferência (duração média de 40 a 60 min). Ouvimos sua história, examinamos os documentos essenciais e acolhemos suas dúvidas.'
    },
    {
      step: '3',
      title: 'Apresentação da Estratégia e Riscos',
      desc: 'Apresentamos com sinceridade as probabilidades, caminhos possíveis (amigável ou judicial) e os riscos reais. Se não houver viabilidade jurídica, informamos com verdade.'
    },
    {
      step: '4',
      title: 'Acordo Transparente e Contrato de Honorários',
      desc: 'Você recebe uma proposta formal contendo exatamente o que será feito, prazos estimados e honorários combinados. Tudo assinado digitalmente ou no escritório antes de iniciar.'
    },
    {
      step: '5',
      title: 'Acompanhamento Pessoal e Atualizações',
      desc: 'Dr. Reinaldo e Dra. Paula cuidam diretamente do seu caso. Notificamos você a cada andamento relevante e estamos disponíveis por canal direto. Você nunca fica sem resposta.'
    },
    {
      step: '6',
      title: 'Resolução e Conclusão',
      desc: 'Julgamento, acordo ou decisão administrativa alcançada. Explicamos detalhadamente o resultado, os valores a serem recebidos ou as obrigações a cumprir.'
    },
    {
      step: '7',
      title: 'Suporte Pós-Solução',
      desc: 'Auxiliamos nos atos complementares: levantamento de alvarás, arquivamento definitivo, emissão de certidões e orientações para que não haja novas pendências futuras.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-900/5 text-neutral-800 flex flex-col font-sans">
      {/* Top Banner Notice */}
      <div className="bg-neutral-900 text-neutral-100 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-emerald-300">ETAPAS 1 A 5 APROVADAS ✅</span>
            <span className="text-neutral-300">· Etapa 6 em Validação Final: Ecossistema de Atendimento</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neutral-400">Dr. Reinaldo Dias (OAB/MG 111.989) & Dra. Paula Mattos (OAB/MG 196.128)</span>
            <button
              onClick={() => copyToClipboard('APROVADO → PROJETO CONCLUÍDO ✅', 'top-approved')}
              className="px-2.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[11px] font-medium transition-colors"
            >
              {copied === 'top-approved' ? 'Copiado!' : 'Copiar Aprovação Final'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar (Standard Contract: Brand - 4-5 single line links - 1 CTA) */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-red-900 text-amber-400 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              RED
            </div>
            <div className="leading-tight">
              <span className="font-serif text-lg font-bold tracking-tight text-neutral-900 block">
                RED Advogados Associados
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('etapa6')}
              className={`hover:text-red-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'etapa6' ? 'text-red-900 border-b-2 border-red-900 font-semibold' : ''
              }`}
            >
              Etapa 6 (Ecossistema)
            </button>
            <button
              onClick={() => setActiveTab('etapa5')}
              className={`hover:text-red-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'etapa5' ? 'text-red-900 border-b-2 border-red-900 font-semibold' : ''
              }`}
            >
              Etapa 5 (SEO & Redes)
            </button>
            <button
              onClick={() => setActiveTab('etapa4')}
              className={`hover:text-red-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'etapa4' ? 'text-red-900 border-b-2 border-red-900 font-semibold' : ''
              }`}
            >
              Etapa 4 (Landing Page)
            </button>
            <button
              onClick={() => setActiveTab('etapa3')}
              className={`hover:text-red-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'etapa3' ? 'text-red-900 border-b-2 border-red-900 font-semibold' : ''
              }`}
            >
              Etapa 3 (Diferenciais)
            </button>
            <button
              onClick={() => setActiveTab('flow')}
              className={`hover:text-red-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'flow' ? 'text-red-900 border-b-2 border-red-900 font-semibold' : ''
              }`}
            >
              Trilha (6 Etapas)
            </button>
          </nav>

          {/* Primary Actions & CRM */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsVisitorModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-neutral-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-red-950" />
              <span>Cadastrar Visita</span>
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Área Advogado (CRM)</span>
            </button>
            <a
              href="https://wa.me/5531983347116?text=Ol%C3%A1%20Dr.%20Reinaldo%20e%20Dra.%20Paula,%20gostaria%20de%20conversar%20sobre%20meu%20caso"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-white bg-red-900 hover:bg-red-800 rounded-lg transition-colors whitespace-nowrap shadow-xs items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>(31) 98334-7116</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Step Indicator Bar */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> Etapas 1 a 5 Aprovadas
                </span>
                <span>·</span>
                <span className="text-amber-800 font-semibold">Etapa 6 em Validação Final</span>
                <span>·</span>
                <span>Belo Horizonte / MG</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-1">
                Etapa 6: Ecossistema de Atendimento & Conteúdo
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard('✅ APROVADO → PROJETO CONCLUÍDO ✅', 'main-approved')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                {copied === 'main-approved' ? <Check className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
                <span>Copiar Aprovação Final p/ Chat</span>
              </button>
            </div>
          </div>

          {/* Stepper tracker */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-4">
            {stages.map((st) => (
              <div
                key={st.num}
                onClick={() => {
                  if (st.num === 1) setActiveTab('dossier');
                  if (st.num === 2) setActiveTab('etapa2');
                  if (st.num === 3) setActiveTab('etapa3');
                  if (st.num === 4) setActiveTab('etapa4');
                  if (st.num === 5) setActiveTab('etapa5');
                  if (st.num === 6) setActiveTab('etapa6');
                }}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  st.num < 6
                    ? 'border-emerald-300 bg-emerald-50/70 cursor-pointer'
                    : 'border-amber-400 bg-amber-50/70 ring-1 ring-amber-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={st.num < 6 ? 'text-emerald-800' : 'text-amber-800'}>
                    ETAPA 0{st.num}
                  </span>
                  {st.num < 6 && (
                    <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 text-[9px] rounded font-semibold uppercase">
                      Aprovada
                    </span>
                  )}
                  {st.num === 6 && (
                    <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[9px] rounded font-semibold uppercase">
                      Validação Final
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-800 mt-1 line-clamp-1">{st.name}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-neutral-200 pb-3">
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'crm'
                ? 'bg-neutral-900 text-amber-300 shadow-xs ring-2 ring-amber-400/50'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-amber-400" />
            <span>CRM & Kanban Admin</span>
            <span className="px-1.5 py-0.2 bg-amber-400 text-neutral-950 font-bold text-[9px] rounded-full uppercase">
              Login
            </span>
          </button>
          <button
            onClick={() => setIsVisitorModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Caixa de Visita</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 font-bold'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Simulador WhatsApp Bot</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'bg-red-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>Landing Page Ao Vivo</span>
          </button>
          <button
            onClick={() => setActiveTab('etapa6')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'etapa6'
                ? 'bg-red-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Etapa 6: Ecossistema</span>
          </button>
          <button
            onClick={() => setActiveTab('etapa5')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'etapa5'
                ? 'bg-red-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Etapa 5: SEO & Redes</span>
          </button>
          <button
            onClick={() => setActiveTab('etapa4')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'etapa4'
                ? 'bg-red-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Etapa 4: Landing Page</span>
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'flow'
                ? 'bg-red-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Regras do Método</span>
          </button>
        </div>

        {/* Modal Caixa de Visita */}
        <VisitorCaptureModal
          isOpen={isVisitorModalOpen}
          onClose={() => setIsVisitorModalOpen(false)}
        />

        {/* TAB CRM: CRM BACKEND & KANBAN */}
        {activeTab === 'crm' && (
          <AdminCRM />
        )}

        {/* TAB SIMULATOR: WHATSAPP BOT SIMULATOR */}
        {activeTab === 'simulator' && (
          <WhatsAppBotSimulator />
        )}

        {/* TAB 0: ETAPA 6 — ECOSSISTEMA DE ATENDIMENTO & CONTEÚDO */}
        {activeTab === 'etapa6' && (
          <div className="space-y-8">
            {/* Callout Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Etapa 6 em Validação Final: Ecossistema Completo de Operação</p>
                <p className="mt-1 text-amber-900 leading-relaxed">
                  Aqui está todo o instrumental prático pronto para o dia a dia do escritório: os 8 scripts de atendimento humanizado no WhatsApp, 5 artigos educativos completos para blog e roteiros de gestão de reputação no Google.
                  Se tudo estiver perfeito, conclua o projeto digitando: <strong className="underline">✅ APROVADO → PROJETO CONCLUÍDO ✅</strong>.
                </p>
              </div>
            </div>

            {/* Sub-tab pills for Etapa 6 */}
            <div className="flex gap-2">
              <button
                onClick={() => setSubTabEtapa6('whatsapp')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  subTabEtapa6 === 'whatsapp'
                    ? 'bg-red-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                1. 8 Scripts WhatsApp
              </button>
              <button
                onClick={() => setSubTabEtapa6('blog')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  subTabEtapa6 === 'blog'
                    ? 'bg-red-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                2. 5 Artigos Educativos (Blog)
              </button>
              <button
                onClick={() => setSubTabEtapa6('reputation')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  subTabEtapa6 === 'reputation'
                    ? 'bg-red-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                3. Gestão de Reputação & Google
              </button>
            </div>

            {/* SEÇÃO 1: 8 SCRIPTS DE WHATSAPP */}
            {subTabEtapa6 === 'whatsapp' && (
              <div className="space-y-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
                    Fluxo de Atendimento WhatsApp (Pronto para Uso)
                  </h3>
                  <p className="text-xs text-neutral-600 mb-4">
                    Comunicação humanizada, clara e sem jargões para cada etapa da jornada do cliente:
                  </p>

                  {/* Banner para o Simulador Interativo */}
                  <div className="mb-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Novo: Simulador Interativo de WhatsApp Bot</span>
                      </span>
                      <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                        Experimente como as 8 mensagens são disparadas na tela de um celular real de acordo com o estágio da jornada.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Abrir Simulador Interativo</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: '1. Boas-Vindas e Acolhimento Inicial',
                        text: 'Olá! Que bom que você entrou em contato com a RED Advogados Associados. Sou o Dr. Reinaldo Dias (e ao meu lado a Dra. Paula Mattos). Para podermos te orientar com tranquilidade: você poderia me contar em poucas palavras qual a sua situação e se existe algum prazo ou urgência em andamento? Fique tranquilo(a), nosso ambiente é 100% sigiloso e acolhedor.'
                      },
                      {
                        title: '2. Confirmação de Consulta / Reunião',
                        text: 'Olá! Confirmando o agendamento da nossa conversa: Data: [Data] às [Horário]. Local: Escritório em Belo Horizonte (Av. do Contorno, 7174 — Sala 09, Santo Antônio) ou Link da Videoconferência: [Link]. Para aproveitarmos ao máximo nosso tempo, separe: RG, CPF, comprovante de endereço e os documentos/notificações que tiver sobre o caso. Até breve!'
                      },
                      {
                        title: '3. Lembrete com 24 Horas de Antecedência',
                        text: 'Olá! Passando para lembrar da nossa reunião amanhã às [Horário], com o Dr. Reinaldo e a Dra. Paula. Se houver qualquer imprevisto com o horário, nos avise com antecedência para remanejarmos a agenda. Estamos à sua disposição.'
                      },
                      {
                        title: '4. Resumo Pós-Atendimento e Próximos Passos',
                        text: 'Olá! Foi um prazer conversar com você hoje. Conforme alinhamos, os próximos passos do seu caso são: 1) Aguardar o envio dos documentos pendentes [Lista]; 2) Elaboração da peça técnica pelos nossos sócios até o dia [Data]; 3) Protocolo imediato. Qualquer dúvida, estamos por aqui.'
                      },
                      {
                        title: '5. Atualização de Andamento Processual Sem Jargões',
                        text: 'Olá! Temos uma atualização sobre o seu processo: o juiz despachou determinando a juntada de documentos complementares pela outra parte. Isso é um procedimento normal da fase probatória. Cumprimos o prazo rigorosamente e seguimos acompanhando de perto. Um abraço!'
                      },
                      {
                        title: '6. Conclusão do Caso e Orientações Finais',
                        text: 'Olá! Temos uma excelente notícia: a decisão final do seu caso foi publicada e obtivemos êxito em relação ao pedido [Detalhe]. Já solicitamos a expedição do alvará de levantamento / arquivamento. Foi uma honra defender os seus direitos e lutar pela sua tranquilidade. Conte sempre conosco.'
                      },
                      {
                        title: '7. Convite para Avaliação no Google',
                        text: 'Olá! Como o seu caso foi concluído, sua opinião sincera é muito valiosa para nós. Você poderia dedicar 1 minuto para nos avaliar no Google? Seu relato ajuda outras pessoas que estão passando por problemas jurídicos a encontrarem um amparo sério e honesto: [Link do Google Meu Negócio]. Muito obrigado!'
                      },
                      {
                        title: '8. Reativação Leve (Após 30 Dias Sem Retorno)',
                        text: 'Olá! Espero que esteja bem. Passando apenas para saber como estão as coisas e se você conseguiu reunir aqueles documentos que conversamos. Se a questão ainda estiver pendente e você precisar de orientação, estamos por aqui para te ajudar sem complicação. Um abraço do Dr. Reinaldo e Dra. Paula.'
                      }
                    ].map((sc, idx) => (
                      <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-red-950 text-xs">{sc.title}</span>
                          <button
                            onClick={() => copyToClipboard(sc.text, `sc-${idx}`)}
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            {copied === `sc-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied === `sc-${idx}` ? 'Copiado!' : 'Copiar Script'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed font-mono bg-white p-3 rounded-lg border border-neutral-200">
                          {sc.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEÇÃO 2: 5 ARTIGOS EDUCATIVOS PARA BLOG */}
            {subTabEtapa6 === 'blog' && (
              <div className="space-y-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">
                    5 Artigos Educativos Estratégicos para o Blog
                  </h3>
                  <p className="text-xs text-neutral-600 mb-6">
                    Conteúdos construídos para gerar autoridade no Google e educar o cliente leigo sem termos técnicos:
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        title: '1. Preciso de Advogado? Quando Procurar e Como Escolher',
                        thesis: 'Muitas pessoas adiam a busca por um advogado por receio de custos, sem perceber que a consulta prévia é uma blindagem econômica.',
                        points: [
                          'Sinais de que você não deve tentar resolver sozinho: notificações oficiais com prazos de 5 ou 15 dias, ameaças de bloqueio de contas e contratos de alto valor.',
                          'Como avaliar o profissional: verifique a regularidade na OAB, a formação sólida e, principalmente, se você fala com quem conduz o caso ou com atendentes.',
                          'A diferença entre o advogado que vende falsas certezas e o patrono que te diz a verdade sobre os riscos.'
                        ]
                      },
                      {
                        title: '2. Quanto Custa Contratar um Advogado? Guia Sem Surpresas',
                        thesis: 'Transparência sobre honorários reduz objeções e permite ao cidadão planejar a defesa dos seus direitos com dignidade.',
                        points: [
                          'Como a tabela da OAB/MG funciona como balizador de dignidade profissional e proteção contra cobranças abusivas.',
                          'Diferença entre honorários de pro labore (trabalho técnico) e honorários de êxito (ad exitum).',
                          'O que são custas judiciais e despesas com cartório: por que elas são informadas previamente e não pertencem ao advogado.',
                          'Condições de pagamento e acesso à Justiça Gratuita garantida pela Constituição.'
                        ]
                      },
                      {
                        title: '3. Advogado Individual ou Grande Escritório — Qual a Melhor Opção Para Você?',
                        thesis: 'Grandes bancas corporativas atendem milhares de casos em esteira industrial; escritórios dedicados cuidam de pessoas.',
                        points: [
                          'Quem realmente assina suas petições: o risco do rodízio constante de estagiários em grandes estruturas.',
                          'Velocidade de resposta: a vantagem de ter o WhatsApp do advogado titular na palma da sua mão.',
                          'Honorários justos: como estruturas enxutas entregam alta densidade técnica sem cobrar custos de estruturas suntuosas.'
                        ]
                      },
                      {
                        title: '4. O Que Levar na Primeira Consulta com Advogado — Lista Prática',
                        thesis: 'Uma consulta bem preparada economiza tempo, agiliza a análise e pode salvar prazos de prescrição.',
                        points: [
                          'Documentos de identificação e comprovantes de residência atualizados.',
                          'A linha do tempo dos fatos: anote datas e acontecimentos principais em ordem cronológica.',
                          'Mensagens e provas digitais: e-mails, conversas do WhatsApp com prints legíveis e gravações pertinentes.',
                          'Não se preocupe se estiver desorganizado: o papel do advogado na primeira conversa é justamente organizar a narrativa probatória.'
                        ]
                      },
                      {
                        title: '5. Direito Não É Só Para Quem Tem Dinheiro — Desmistificando os Custos',
                        thesis: 'A ideia de que o Judiciário é inacessível para quem tem poucos recursos impede milhões de brasileiros de buscarem seus direitos.',
                        points: [
                          'O instituto constitucional da Gratuidade de Justiça (isenção de custas e taxas do tribunal).',
                          'Causas com honorários ao final: quando é possível remunerar o profissional apenas sobre o valor que você efetivamente receber.',
                          'O diálogo aberto com o profissional para encontrar um cronograma de parcelamento que caiba no orçamento familiar.'
                        ]
                      }
                    ].map((art, idx) => (
                      <div key={idx} className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                        <span className="text-xs font-bold text-red-900 uppercase">Artigo 0{idx + 1}</span>
                        <h4 className="font-serif font-bold text-base text-neutral-900 mt-1">{art.title}</h4>
                        <p className="text-xs text-neutral-600 mt-1 italic leading-relaxed">Tese: {art.thesis}</p>
                        <div className="mt-3 pt-3 border-t border-neutral-200 text-xs text-neutral-700 space-y-1">
                          <span className="font-semibold text-neutral-800 block">Tópicos Essenciais Abordados:</span>
                          {art.points.map((pt, pIdx) => (
                            <p key={pIdx} className="flex items-start gap-1.5">
                              <span className="text-red-900 font-bold">•</span>
                              <span>{pt}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEÇÃO 3: GESTÃO DE REPUTAÇÃO */}
            {subTabEtapa6 === 'reputation' && (
              <div className="space-y-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <h3 className="font-serif font-bold text-lg text-neutral-900">
                      Gestão de Reputação & Avaliações no Google
                    </h3>
                  </div>

                  <div className="mt-4 space-y-4 text-xs sm:text-sm text-neutral-800">
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                      <span className="font-bold text-red-950 uppercase text-xs block mb-1">
                        1. Modelo de Pedido de Avaliação Pós-Atendimento:
                      </span>
                      <p className="font-mono text-xs text-neutral-700 bg-white p-3 rounded-lg border border-neutral-200 leading-relaxed">
                        "Olá [Nome do Cliente]! Foi uma grande honra conduzir o seu caso e ver a sua tranquilidade restabelecida. Como trabalhamos com atendimento pessoal e a maioria dos nossos clientes chega por indicação, a sua avaliação no Google nos ajuda imensamente. Você poderia nos deixar uma breve avaliação com estrelas contando como foi a sua experiência com o Dr. Reinaldo e a Dra. Paula? Link direto: [Link da Ficha Google]. Muito obrigado pelo carinho e pela confiança!"
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-950 uppercase text-xs block mb-1">
                        2. Resposta Modelo para Avaliação Positiva (5 Estrelas):
                      </span>
                      <p className="font-mono text-xs text-emerald-900 bg-white p-3 rounded-lg border border-emerald-200 leading-relaxed">
                        "Prezado(a) [Nome], agradecemos de coração por suas palavras e por confiar a sua causa à RED Advogados Associados. Nosso compromisso diário é exatamente este: unir rigor técnico forense ao acolhimento humano e à clareza que cada cidadão merece. Estaremos sempre à sua disposição em Belo Horizonte!"
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                      <span className="font-bold text-amber-950 uppercase text-xs block mb-1">
                        3. Resposta Construtiva e Ética para Eventual Feedback Crítico:
                      </span>
                      <p className="font-mono text-xs text-amber-900 bg-white p-3 rounded-lg border border-amber-200 leading-relaxed">
                        "Olá [Nome], agradecemos pelo seu contato e manifestação. Na RED Advogados, prezamos pela transparência total e pelo respeito absoluto a cada pessoa atendida. Gostaríamos de compreender com exatidão o ocorrido e conversar diretamente com você para esclarecer qualquer ponto. Por favor, entre em contato direto pelo WhatsApp (31) 98334-7116 ou e-mail reinaldodias.advogado@gmail.com para que possamos dialogar pessoalmente."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Callout Box with action */}
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>ECOSSISTEMA DE ATENDIMENTO CONSOLIDADO — VALIDAÇÃO FINAL DO PROJETO</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Todo o projeto de presença digital para a RED Advogados Associados está concluído e alinhado com a sua essência profissional?
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => copyToClipboard('APROVADO → PROJETO CONCLUÍDO ✅', 'etapa6-approved')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  {copied === 'etapa6-approved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar "APROVADO → PROJETO CONCLUÍDO ✅"</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ETAPA 5 — SEO LOCAL & REDES SOCIAIS (APROVADA) */}
        {activeTab === 'etapa5' && (
          <div className="space-y-8">
            {/* Callout Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Etapa 5 em Validação: Materiais Prontos para Uso no Google e Redes</p>
                <p className="mt-1 text-amber-900 leading-relaxed">
                  Aqui estão organizados a Ficha Otimizada do Google Meu Negócio, 4 postagens prontas, modelos de páginas regionais (BH e cidades metropolitanas), biografia e 10 legendas estratégicas com hashtags para Instagram/Facebook.
                  Revise o material. Se aprovado, responda no chat com <strong className="underline">APROVADO</strong> para avançar para a <strong>ETAPA 6 (Ecossistema de Atendimento, Scripts de WhatsApp e Blog)</strong>.
                </p>
              </div>
            </div>

            {/* Sub-tab pills for Etapa 5 */}
            <div className="flex gap-2">
              <button
                onClick={() => setSubTabEtapa5('gmb')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  subTabEtapa5 === 'gmb'
                    ? 'bg-red-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                1. Google Meu Negócio & Posts
              </button>
              <button
                onClick={() => setSubTabEtapa5('cities')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  subTabEtapa5 === 'cities'
                    ? 'bg-red-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                2. Páginas Regionais (BH & Cidades)
              </button>
              <button
                onClick={() => setSubTabEtapa5('social')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  subTabEtapa5 === 'social'
                    ? 'bg-red-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                3. Redes Sociais (Bio + 10 Legendas)
              </button>
            </div>

            {/* SEÇÃO 1: GOOGLE BUSINESS PROFILE */}
            {subTabEtapa5 === 'gmb' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-red-900" />
                      <h3 className="font-serif font-bold text-lg text-neutral-900">
                        Configuração da Ficha no Google Meu Negócio
                      </h3>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">GOOGLE MAPS & BUSCA LOCAL</span>
                  </div>

                  <div className="mt-4 space-y-3 text-xs sm:text-sm text-neutral-800">
                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-xs block">Título da Ficha:</span>
                      <p className="font-serif font-bold text-base text-neutral-900 mt-0.5">
                        Advogado Dr. Reinaldo Dias — OAB/MG 111.989 | Belo Horizonte (RED Advogados)
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-xs block">Categorias Principais:</span>
                      <p className="text-neutral-700 mt-0.5">
                        Escritório de Advocacia (Principal) · Advogado de Direito Administrativo · Advogado Cível · Assessoria Jurídica Empresarial
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-xs block">Endereço Oficial:</span>
                      <p className="text-neutral-700 mt-0.5">
                        Avenida do Contorno, 7174 — Sala 09 — Bairro Santo Antônio — Belo Horizonte/MG — CEP 30110-047
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-xs block">Telefone / WhatsApp:</span>
                      <p className="text-neutral-700 mt-0.5">(31) 98334-7116</p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-xs block">Descrição Completa para o Google (Otimizada para Busca):</span>
                      <p className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs leading-relaxed text-neutral-700 mt-1">
                        "Escritório de advocacia em Belo Horizonte liderado pelo Dr. Reinaldo Eustáquio Dias (OAB/MG 111.989) e Dra. Paula da Silva Mattos (OAB/MG 196.128). Mais de 18 anos de experiência prática, com foco em Direito Administrativo (defesa de servidores públicos, concursos e licitações), Direito Cível (contratos, indenizações e cobranças), Direito Empresarial, Direito da Cultura e Parcerias Público-Privadas. Atendimento próximo, humanizado e sem jargões. Localizado no bairro Santo Antônio (Av. do Contorno), com atendimento presencial e online para todo o Brasil. Agende sua consulta pelo WhatsApp: (31) 98334-7116."
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Postagens Prontas para o Google Meu Negócio */}
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <h4 className="font-serif font-bold text-base text-neutral-900 mb-4">
                    4 Postagens Prontas para o Google Updates
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-2">
                      <span className="font-bold text-red-900 uppercase block">Post 1: Apresentação & Credibilidade</span>
                      <p className="text-neutral-700 leading-relaxed">
                        "Você não precisa enfrentar um conflito jurídico sozinho. Na RED Advogados Associados, unimos mais de 18 anos de prática forense em Belo Horizonte e titulação internacional (Universitat de Girona) com um princípio inegociável: a verdade, sempre. Quem atende você são os advogados titulares do início ao fim. Fale conosco pelo WhatsApp (31) 98334-7116."
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-2">
                      <span className="font-bold text-red-900 uppercase block">Post 2: Servidores Públicos & Prazos</span>
                      <p className="text-neutral-700 leading-relaxed">
                        "Recebeu uma notificação administrativa ou está enfrentando injustiça em concurso ou Processo Administrativo Disciplinar (PAD)? No Direito Administrativo, prazos costumam ser curtos e fatais. Uma defesa técnica imediata é indispensável para anular atos ilegais. Estamos à disposição na Av. do Contorno, 7174 ou online."
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-2">
                      <span className="font-bold text-red-900 uppercase block">Post 3: Dica Prática de Contratos</span>
                      <p className="text-neutral-700 leading-relaxed">
                        "Antes de assinar qualquer acordo comercial, rescisão ou contrato de compra e venda, certifique-se de que compreendeu cada cláusula. O custo de uma revisão prévia é infinitamente menor do que o desgaste de um litígio judicial futuro. Esclareça suas dúvidas com quem fala a sua língua."
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-2">
                      <span className="font-bold text-red-900 uppercase block">Post 4: Transparência & Ética</span>
                      <p className="text-neutral-700 leading-relaxed">
                        "Advogado ético não promete resultado ganho — promete dedicação integral e lealdade ao cliente. Em nosso escritório, você sabe exatamente quais são os riscos e o investimento antes de tomar qualquer decisão. Agende seu atendimento em Belo Horizonte."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEÇÃO 2: PÁGINAS REGIONAIS */}
            {subTabEtapa5 === 'cities' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2">
                    Estrutura de Páginas Regionais para SEO Local
                  </h3>
                  <p className="text-xs text-neutral-600 mb-4">
                    Permite capturar buscas de clientes de Belo Horizonte e das cidades vizinhas da Região Metropolitana:
                  </p>

                  <div className="flex gap-2 mb-4">
                    {['Belo Horizonte', 'Contagem', 'Betim', 'Nova Lima'].map((city, idx) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(idx)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          selectedCity === idx
                            ? 'bg-red-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const cities = ['Belo Horizonte', 'Contagem', 'Betim', 'Nova Lima'];
                    const currentCity = cities[selectedCity];
                    return (
                      <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 text-xs sm:text-sm">
                        <span className="font-serif font-bold text-base text-red-950 block">
                          Modelo para: {currentCity} / MG
                        </span>
                        <p><strong>H1:</strong> Advogado em {currentCity} — Atendimento Presencial e Online Especializado</p>
                        <p><strong>Presença na Região:</strong> Mais de 18 anos defendendo pessoas físicas, servidores públicos e empresários de {currentCity} e região metropolitana, com escritório sede na Avenida do Contorno, 7174, em Belo Horizonte.</p>
                        <p><strong>Áreas Disponíveis para {currentCity}:</strong> Direito Administrativo, Concursos, Servidores, Cível, Contratos, Indenizações, Direito da Cultura e Direito Empresarial.</p>
                        <p><strong>Como Agendar:</strong> Atendimento presencial no escritório sede ou reunião imediata por videoconferência com os advogados titulares.</p>
                        <div className="pt-2">
                          <a
                            href={`https://wa.me/5531983347116?text=Ol%C3%A1,%20gostaria%20de%20agendar%20atendimento%20para%20${encodeURIComponent(currentCity)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Agendar Atendimento para {currentCity}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* SEÇÃO 3: REDES SOCIAIS (BIO + 10 LEGENDAS) */}
            {subTabEtapa5 === 'social' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <Share2 className="w-5 h-5 text-red-900" />
                    <h3 className="font-serif font-bold text-lg text-neutral-900">
                      Bio Pronta para Instagram / Facebook
                    </h3>
                  </div>
                  <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-xs leading-relaxed text-neutral-800">
                    <p>⚖️ RED Advogados Associados</p>
                    <p>👨‍⚖️ Dr. Reinaldo Dias | OAB/MG 111.989</p>
                    <p>👩‍⚖️ Dra. Paula Mattos | OAB/MG 196.128</p>
                    <p>📍 Belo Horizonte/MG · Av. do Contorno, 7174</p>
                    <p>🛡️ Administrativo · Cível · Empresarial · Cultura · PPPs</p>
                    <p>🤝 "Você não precisa enfrentar isso sozinho."</p>
                    <p>👇 Fale diretamente conosco pelo WhatsApp:</p>
                    <p>🔗 wa.me/5531983347116</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                  <h4 className="font-serif font-bold text-base text-neutral-900 mb-4">
                    10 Legendas Completas Prontas para Copiar e Publicar
                  </h4>

                  <div className="space-y-3">
                    {[
                      {
                        title: '1. Apresentação & Propósito',
                        text: 'A lei foi feita para servir às pessoas — não o contrário. Na RED Advogados Associados, cada caso é conduzido pessoalmente por quem tem mais de 18 anos de estrada, sem terceirizações. Se você precisa de segurança e clareza para resolver um conflito, estamos ao seu lado. #AdvocaciaBH #REDAdvogados #OABMG #BeloHorizonte'
                      },
                      {
                        title: '2. Servidores Públicos & Prazos',
                        text: 'Recebeu uma notificação disciplinar ou foi preterido em concurso público? Não espere o prazo esgotar. No Direito Administrativo, a rapidez e a fundamentação técnica precisa definem o futuro do servidor. Fale conosco no WhatsApp. #ServidorPublico #DireitoAdministrativo #ConcursosMG #BH'
                      },
                      {
                        title: '3. Dica Prática de Contratos',
                        text: 'Três coisas que você nunca deve fazer ao assinar um contrato: 1) Assinar sem ler as cláusulas de rescisão; 2) Acreditar apenas em acordos verbais; 3) Deixar de consultar um advogado prévio. Prevenção é economia. #DireitoCivil #ContratosSeguros #AdvogadoMG'
                      },
                      {
                        title: '4. Explicação de Processo Sem Jargões',
                        text: 'Como funciona um processo judicial? Não precisa de mistério: 1º Ouvimos você; 2º Apresentamos a estratégia real; 3º Protocolamos os pedidos; 4º Mantemos você atualizado em cada decisão. Você nunca fica no escuro. #JusticaSemJargoes #AdvocaciaTransparente'
                      },
                      {
                        title: '5. Transparência de Honorários',
                        text: 'Quanto custa contratar um advogado? Em nosso escritório, a resposta é simples: você sabe o investimento exato antes de tomar qualquer decisão. Sem surpresas, sem taxas ocultas e com parcelamento justo. #TransparenciaJuridica #HonorariosOAB'
                      },
                      {
                        title: '6. Caso Marcante / Prova Social',
                        text: 'O momento mais gratificante da nossa profissão não é receber honorários — é atender o telefone e ouvir o alívio na voz do cliente dizendo: "Doutor, conseguimos, minha vida voltou ao normal". É por essa dignidade que lutamos. #Dignidade #AdvocaciaComProposito'
                      },
                      {
                        title: '7. Acolhimento ("Não tenha medo")',
                        text: 'Sabemos que problemas jurídicos trazem vergonha e ansiedade. Mas adiar a conversa só faz o problema crescer. Ouvir não custa nada e muitas vezes só de desabafar com quem entende os caminhos legais você já sente alívio. #ApoioJuridico #Tranquilidade'
                      },
                      {
                        title: '8. Nossa História na PUC Minas e Girona',
                        text: 'Mais de 18 anos de advocacia começaram nos bancos da PUC Minas e ganharam maturidade com mestrado na Espanha e atuação prática na gestão pública. Conhecimento técnico aliado ao calor humano. #AdvogadoBeloHorizonte #MestradoEmDireito'
                      },
                      {
                        title: '9. Pergunta Frequente: Perdi o Prazo?',
                        text: '"Perdi o prazo, ainda dá para recorrer?" Na maioria das vezes, existem medidas de impugnação, nulidades processuais ou ações rescisórias cabíveis. Mas cada hora conta. Envie sua dúvida no WhatsApp. #PrazosProcessuais #DireitoMG'
                      },
                      {
                        title: '10. Nosso Princípio Inegociável',
                        text: '"A verdade, sempre." Preferimos dizer que a chance é difícil a alimentar falsas ilusões. É assim que construímos relações de confiança duradouras há quase duas décadas em Belo Horizonte. #EticaProfissional #VerdadeSempre'
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-red-950 text-xs">{item.title}</span>
                          <button
                            onClick={() => copyToClipboard(item.text, `caption-${idx}`)}
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            {copied === `caption-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied === `caption-${idx}` ? 'Copiado!' : 'Copiar Legenda'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Callout Box with action */}
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>MATERIAIS DE SEO LOCAL E REDES SOCIAIS VALIDADOS</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Confirma que os materiais do Google Meu Negócio, páginas regionais e legendas refletem sua estratégia?
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => copyToClipboard('APROVADO', 'etapa5-approved')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  {copied === 'etapa5-approved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar "APROVADO" para Chat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ETAPA 4 — LANDING PAGE COMPLETA (APROVADA) */}
        {activeTab === 'etapa4' && (
          <div className="space-y-10">
            {/* Callout Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Etapa 4 em Validação: Estrutura Visual e Conteúdo Bloco a Bloco</p>
                <p className="mt-1 text-amber-900 leading-relaxed">
                  Os 8 blocos estratégicos abaixo foram construídos integrando os dados oficiais e a essência humanizada da RED Advogados Associados.
                  Revise a redação e a arquitetura visual. Se aprovado, responda no chat com <strong className="underline">APROVADO</strong> para avançar para a <strong>ETAPA 5 (SEO Local, Google Business e Redes)</strong>.
                </p>
              </div>
            </div>

            {/* BLOCO 1: HERO (Acima da Dobra) */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 1 — HERO SECTION</div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-900">
                    <span>RED ADVOGADOS ASSOCIADOS</span>
                    <span>·</span>
                    <span>Belo Horizonte / MG</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                    Resolva Seu Problema Jurídico com <span className="text-red-950 underline decoration-amber-500/70">Tranquilidade e Clareza</span> — Advogados em Belo Horizonte
                  </h2>

                  <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                    Atendimento próximo, sem jargões. Você fala direto com o Dr. Reinaldo e a Dra. Paula. Entendemos sua situação com respeito e te orientamos passo a passo.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-700 pt-1 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      OAB/MG 111.989 & 196.128
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Atendimento Presencial em BH e Online Brasil
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Sigilo Profissional Absoluto
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                    <a
                      href="https://wa.me/5531983347116?text=Ol%C3%A1%20Dr.%20Reinaldo%20e%20Dra.%20Paula,%20gostaria%20de%20conversar%20sobre%20meu%20caso"
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Falar Agora no WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        const el = document.getElementById('bloco8-form');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Explicar Meu Caso (Análise Inicial)</span>
                    </button>
                  </div>

                  <p className="text-xs text-neutral-500 italic pt-1">
                    "Sua situação merece atenção pessoal, não um número de processo."
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 border border-neutral-200 rounded-2xl p-6 text-center shadow-xs">
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-neutral-300 mx-auto mb-4 bg-neutral-900">
                      <img
                        src="/assets/aistudio/foto_perfil_reinaldo_site-essa_870179fe.jpg"
                        alt="Dr. Reinaldo Eustáquio Dias - OAB/MG nº 111.989"
                        className="w-full h-full object-cover object-[center_12%]"
                      />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900">Dr. Reinaldo Eustáquio Dias</h3>
                    <p className="text-xs text-red-900 font-semibold">OAB/MG nº 111.989 · Sócio Titular</p>
                    <p className="text-xs text-neutral-600 mt-1">Ao lado da Dra. Paula da Silva Mattos (OAB/MG nº 196.128)</p>
                    <p className="text-[11px] text-neutral-500 mt-3 pt-3 border-t border-neutral-200 italic">
                      "Mais de 18 anos de atuação dedicados a defender pessoas de igual para igual."
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOCO 2: QUEM SOU E POR QUE CONFIAR */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 2 — QUEM SOU E POR QUE CONFIAR</div>
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-bold text-red-900 uppercase tracking-wider">Apresentação & Propósito</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
                  "Acreditamos que a lei deve servir às pessoas — não o contrário."
                </h3>
                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                  Somos a <strong>RED Advogados Associados</strong> (Reinaldo Dias Sociedade Individual de Advocacia). À frente dos trabalhos, o <strong>Dr. Reinaldo Eustáquio Dias (OAB/MG 111.989)</strong> e a <strong>Dra. Paula da Silva Mattos (OAB/MG 196.128)</strong>.
                </p>
                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                  Desde os primeiros anos de formação na PUC Minas, nossa vocação foi transformar o conhecimento técnico em amparo e proteção real. Com mais de 18 anos de experiência prática e titulação internacional (Mestrado pela <em>Universitat de Girona</em>, Espanha), aprendemos que o que resolve processos não são citações vazias em latim, mas sim a capacidade de ouvir a pessoa com empatia, explicar cada detalhe com clareza e lutar com coragem pelos seus direitos.
                </p>

                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-950 font-medium text-sm">
                  <strong>Nosso compromisso central:</strong> "Eu cuido do seu caso pessoalmente. Você não é transferido para ninguém."
                </div>
              </div>
            </section>

            {/* BLOCO 3: COMO POSSO TE AJUDAR */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 3 — COMO POSSO TE AJUDAR (ÁREAS DE ATUAÇÃO)</div>
              <div className="mb-6">
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Áreas de Especialidade para Defender Seus Interesses</h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">Clique para falar diretamente sobre a sua necessidade:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <div key={area.id} className="p-5 rounded-xl border border-neutral-200 hover:border-red-900/40 transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-serif font-bold text-neutral-900 text-sm">
                          <Icon className="w-4 h-4 text-red-900 shrink-0" />
                          <span>{area.title}</span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {area.realProblem}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-2 font-medium">
                          <strong>Para quem é:</strong> {area.whoNeeds.split('.')[0]}.
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/5531983347116?text=Ol%C3%A1,%20gostaria%20de%20falar%20sobre%20${encodeURIComponent(area.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 pt-3 border-t border-neutral-100 inline-flex items-center justify-between text-xs font-semibold text-red-900 hover:text-red-700"
                      >
                        <span>Falar sobre {area.title.split('&')[0].trim()}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BLOCO 4: COMO FUNCIONA */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 4 — COMO FUNCIONA (O PASSO A PASSO)</div>
              <div className="mb-6">
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Passo a Passo Sem Surpresas</h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  <strong>Nenhuma surpresa.</strong> Você sabe exatamente o que acontece em cada etapa do seu atendimento:
                </p>
              </div>

              <div className="space-y-3">
                {stepsFlow.map((st) => (
                  <div key={st.step} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-red-950 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {st.step}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-neutral-900 text-sm">{st.title}</h4>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-neutral-100 rounded-xl text-xs text-neutral-700">
                <strong>O que esperar da primeira conversa:</strong> Duração de 40 a 60 minutos, sem pressa. Leve os documentos que tiver (notificações, contratos, anotações). Avaliaremos a viabilidade e você sairá com clareza dos caminhos possíveis.
              </div>
            </section>

            {/* BLOCO 5: VALORES E TRANSPARÊNCIA */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 5 — VALORES E TRANSPARÊNCIA</div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-serif font-bold text-neutral-900">Honorários Claros e Condições Transparentes</h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  O modelo de honorários é estabelecido conforme a natureza da sua demanda (valor fixo, etapas ou êxito em ações compatíveis). Seguimos rigorosamente a tabela da OAB/MG com bom senso e respeito ao cliente.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                    <p className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> O Que Está Incluso:
                    </p>
                    <p className="text-neutral-600">Reuniões com os sócios, estudo de caso, elaboração de peças, cumprimento de prazos e acompanhamento direto sem terceirização.</p>
                  </div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                    <p className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> O Que É Custo à Parte:
                    </p>
                    <p className="text-neutral-600">Custas judiciais do tribunal, taxas cartorárias e perícias (sempre informadas com antecedência para sua aprovação prévia).</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-neutral-700 space-y-1">
                  <p><strong>Formas de pagamento:</strong> PIX, cartão de crédito e parcelamento em condições adequadas à sua realidade.</p>
                  <p><strong>Primeira conversa:</strong> Triagem inicial acolhedora e sem custo. Se exigir análise aprofundada de documentos volumosos, combinamos o valor previamente.</p>
                </div>

                <div className="pt-2 text-xs font-semibold text-red-950 italic">
                  "Você saberá o investimento exato antes de decidir qualquer contratação."
                </div>
              </div>
            </section>

            {/* BLOCO 6: PERGUNTAS QUE VOCÊ TEM (FAQ INTERATIVO) */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 6 — PERGUNTAS FREQUENTES (FAQ ESTRUTURADO)</div>
              <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-4">Dúvidas Frequentes Respondidas com Sinceridade</h3>

              <div className="space-y-3">
                {[
                  {
                    q: 'Advogado é sempre caro?',
                    a: 'Não. Nosso compromisso é viabilizar o acesso à justiça. Apresentamos valores compatíveis com a complexidade da causa e oferecemos parcelamento. O investimento em advogado protege seu patrimônio de prejuízos muito maiores.'
                  },
                  {
                    q: 'Não entendo nada de direito — vou conseguir acompanhar meu caso?',
                    a: 'Com certeza. Falamos a sua língua e explicamos quantas vezes for necessário, sem termos técnicos. Você fala direto com o Dr. Reinaldo ou a Dra. Paula e sabe o motivo de cada decisão.'
                  },
                  {
                    q: 'E se eu não tiver dinheiro para pagar tudo agora?',
                    a: 'Conversamos abertamente na primeira consulta. Dependendo do caso, podemos estruturar uma entrada e parcelas mensais, ou honorários ao final. Também avaliamos se você tem direito à Justiça Gratuita perante a lei.'
                  },
                  {
                    q: 'O que eu contar na consulta fica em sigilo?',
                    a: 'Sigilo absoluto. O sigilo entre advogado e cliente é protegido por lei federal (artigo 7º do Estatuto da OAB) e punido com rigor caso violado. O ambiente de conversa é 100% reservado e seguro.'
                  },
                  {
                    q: 'Quanto tempo vai demorar para resolver?',
                    a: 'Explicamos com honestidade desde o início: prazos de órgãos públicos e tribunais variam, mas tudo o que estiver sob nosso controle é protocolado com agilidade. Você nunca fica meses sem saber em que fase o processo está.'
                  },
                  {
                    q: 'Perdi um prazo judicial ou administrativo — ainda dá para resolver?',
                    a: 'Cada hora é preciosa. Não hesite em nos contatar imediatamente pelo WhatsApp. Muitas vezes existem medidas de urgência, recursos ou ações autônomas para impugnar atos ilegais mesmo após o prazo inicial.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 text-left font-serif font-bold text-sm text-neutral-900 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp className="w-4 h-4 text-red-900" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 bg-white text-xs text-neutral-700 leading-relaxed border-t border-neutral-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* BLOCO 7: CASOS E CONFIANÇA */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 7 — CASOS E CONFIANÇA (PROVA SOCIAL)</div>
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Histórias Reais e a Confiança Construída</h3>

                <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-xl">
                  <p className="text-xs font-bold text-red-900 uppercase">Caso Marcante Anonimizado</p>
                  <p className="font-serif italic text-base text-neutral-900 mt-1">
                    "Doutor, conseguimos, minha vida voltou ao normal e recuperei minha dignidade."
                  </p>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    Após meses tentando sozinho desatar um nó burocrático com o Poder Público que ameaçava o sustento da sua família, o cliente encontrou na RED Advogados o amparo técnico necessário. Em poucas semanas, com a tese correta, a liminar foi concedida e os direitos foram restabelecidos integralmente.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="font-bold text-emerald-950 uppercase">O que nossos clientes repetem:</p>
                    <p className="text-emerald-900 mt-1 italic leading-relaxed">
                      "Você me explicou com paciência, de um jeito que entendi tudo, e nunca deixou de responder minhas mensagens."
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-xl">
                    <p className="font-bold text-neutral-900 uppercase">Por que muitos indicam:</p>
                    <p className="text-neutral-700 mt-1 leading-relaxed">
                      Porque sabem que o Dr. Reinaldo e a Dra. Paula cuidam de pessoas, não de números. A sua situação merece atenção exclusiva.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOCO 8: FALE COMIGO */}
            <section id="bloco8-form" className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">🔹 BLOCO 8 — FALE COMIGO (FORMULÁRIO & CONTATO DIRETO)</div>
              <div className="max-w-2xl">
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Não Enfrente Isso Sozinho</h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Envie uma mensagem resumindo sua dúvida ou clique no botão de WhatsApp para falar direto conosco agora:
                </p>

                {sentSuccess ? (
                  <div className="mt-6 bg-emerald-50 border border-emerald-300 text-emerald-900 p-6 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Dados registrados no sistema e enviados ao Dr. Reinaldo e Dra. Paula!</p>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Sua visita foi registrada com sucesso no CRM do escritório. Retornaremos em até 24 horas úteis.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="mt-6 space-y-4">
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>Nome Completo *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={consultName}
                          onChange={(e) => setConsultName(e.target.value)}
                          placeholder="Ex: Roberto Soares da Silva"
                          className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>E-mail *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={consultEmail}
                          onChange={(e) => setConsultEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                          className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>CPF *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={consultCpf}
                          onChange={(e) => setConsultCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>Telefone / WhatsApp com DDD *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={consultPhone}
                          onChange={(e) => setConsultPhone(e.target.value)}
                          placeholder="(31) 98334-7116"
                          className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>Número do Processo (se já houver)</span>
                          <span className="text-[10px] text-neutral-400 font-normal">Opcional</span>
                        </label>
                        <input
                          type="text"
                          value={consultProcesso}
                          onChange={(e) => setConsultProcesso(e.target.value)}
                          placeholder="Ex: 5014829-12.2024.8.13.0024"
                          className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">Resumo Breve do que Aconteceu</label>
                      <textarea
                        rows={2}
                        value={consultMsg}
                        onChange={(e) => setConsultMsg(e.target.value)}
                        placeholder="Explique com suas próprias palavras qual é o seu problema ou dúvida..."
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsVisitorModalOpen(true)}
                        className="text-xs text-amber-900 hover:text-amber-950 font-semibold underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Abrir Formulário em Janela (Caixa de Visita)</span>
                      </button>

                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-red-950 hover:bg-red-900 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        {submitLoading ? (
                          <span>Enviando dados...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar Visita — Respondo em até 24h</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-900" />
                      <h4 className="font-serif font-bold text-neutral-900 text-sm">
                        Localização do Escritório Sede em Belo Horizonte
                      </h4>
                    </div>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Avenida+do+Contorno%2C+7174+-+Santo+Ant%C3%B4nio%2C+Belo+Horizonte+-+MG%2C+30110-047"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950 hover:bg-red-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Abrir Rota no Google Maps</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    {/* Mapa Interativo Embed */}
                    <div className="lg:col-span-7 rounded-xl overflow-hidden border border-neutral-200 shadow-xs relative bg-neutral-100 min-h-[220px]">
                      <iframe
                        title="Mapa da Sede - RED Advogados Associados"
                        src="https://maps.google.com/maps?q=Avenida%20do%20Contorno,%207174,%20Santo%20Ant%C3%B4nio,%20Belo%20Horizonte%20MG%2030110-047&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full min-h-[240px] border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>

                    {/* Detalhes de Acesso e Navegação */}
                    <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-3">
                      <div>
                        <span className="font-bold text-neutral-900 text-xs block">Endereço Completo:</span>
                        <p className="text-neutral-700 mt-1 leading-relaxed">
                          Avenida do Contorno, 7174 — Sala 09<br />
                          Bairro Santo Antônio — Belo Horizonte/MG<br />
                          CEP: 30110-047
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Car className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>Fácil acesso pela Av. do Contorno e Av. Prudente de Morais.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bus className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>Próximo a pontos de ônibus das linhas SC01, SC02 e 2151.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>Atendimento: Segunda a sexta, das 09h às 17h.</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Avenida+do+Contorno%2C+7174+-+Santo+Ant%C3%B4nio%2C+Belo+Horizonte+-+MG%2C+30110-047"
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5 text-red-900" />
                          <span>Google Maps</span>
                        </a>
                        <a
                          href="https://waze.com/ul?q=Avenida%20do%20Contorno%207174%20Belo%20Horizonte"
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Compass className="w-3.5 h-3.5 text-sky-600" />
                          <span>Abrir no Waze</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Validation Callout Box with action */}
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>LANDING PAGE COMPLETA (8 BLOCOS) PRONTA PARA IMPLEMENTAÇÃO</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  O conteúdo e a disposição visual dos 8 blocos refletem exatamente o que você deseja apresentar aos clientes?
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => copyToClipboard('APROVADO', 'etapa4-approved')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  {copied === 'etapa4-approved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar "APROVADO" para Chat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ETAPA 3 — DIFERENCIAIS, POSICIONAMENTO E PROVA SOCIAL (APROVADA) */}
        {activeTab === 'etapa3' && (
          <div className="space-y-6">
            {/* Callout Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Etapa 3 em Validação: O Que Torna o Escritório Único e Insubstituível</p>
                <p className="mt-1 text-amber-900 leading-relaxed">
                  Aqui justificamos por que o cliente deve escolher a RED Advogados Associados em vez de uma grande banca impessoal.
                  Revise os 4 blocos abaixo. Se estiver de acordo, responda no chat com <strong className="underline">APROVADO</strong> para avançar para a <strong>ETAPA 4 (Landing Page Completa — Conteúdo e Estrutura Visual)</strong>.
                </p>
              </div>
            </div>

            {/* BLOCO 1: POR QUE A RED ADVOGADOS E NÃO OUTRO? */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-red-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    ❤️ Por Que Eu e Não Outro Advogado?
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-mono">DIFERENCIAIS HUMANOS E TÉCNICOS</span>
              </div>
              <div className="p-6 divide-y divide-neutral-100 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 py-3.5 gap-2">
                  <span className="text-neutral-500 font-medium">Atenção Exclusiva & Condução Própria</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    <strong>Quem atende você é quem estuda, redige e protocola seu caso do início ao fim.</strong> Não há terceirização para estagiários ou rodízio de advogados. Dr. Reinaldo Eustáquio Dias e Dra. Paula da Silva Mattos assumem o compromisso pessoal com você.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3.5 gap-2">
                  <span className="text-neutral-500 font-medium">Proximidade Real no Dia a Dia</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    Tratamos você com respeito, sem pressa e de igual para igual. Não existe barreiras burocráticas: quando precisa de um esclarecimento, você fala diretamente com o profissional que conhece cada vírgula do seu processo.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3.5 gap-2">
                  <span className="text-neutral-500 font-medium">Clareza Sem Jargões ("Falar a Sua Língua")</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    Explicamos cada despacho, intimação ou sentença em linguagem cotidiana que você compreende com autonomia. Você nunca sai de uma conversa sem entender exatamente qual é o próximo passo.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3.5 gap-2">
                  <span className="text-neutral-500 font-medium">Empatia e Acolhimento Humanizado</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    Sabemos que quem procura advogado quase sempre está sob forte estresse emocional ou risco patrimonial. Nosso papel é ser o porto seguro: ouvir primeiro a angústia da pessoa antes de buscar a solução técnica no ordenamento jurídico.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3.5 gap-2">
                  <span className="text-neutral-500 font-medium">Transparência Inegociável</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    Dizemos a verdade sempre, inclusive quando ela não é confortável. Riscos são explicados antes de assinar qualquer contrato. Sem promessas fáceis e sem cobranças surpresa ao longo do caminho.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3.5 gap-2">
                  <span className="text-neutral-500 font-medium">Vivência Prática Singular</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    Combinação rara de <strong>advocacia privada, atuação prática na gestão pública e magistério acadêmico</strong>, somada a <strong>Mestrado Internacional na Espanha (Universitat de Girona)</strong> e Pós-Graduação em Direito Processual Aplicado pela PUC Minas.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3.5 gap-2">
                  <span className="text-neutral-500 font-medium">O Diferencial que é Só Nosso</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed font-serif italic text-base">
                    "Conhecemos o Direito por fora e por dentro da máquina pública — e fazemos tudo com a proximidade e o calor de quem cuida de gente."
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCO 2: TABELA COMPARATIVA PEQUENO ESCRITÓRIO VS GRANDE BANCA */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-5 h-5 text-red-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    🤝 Pequeno Escritório Dedicado vs. Grande Banca Impessoal
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-mono">TABELA DE TRANSPARÊNCIA</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-neutral-100 text-neutral-700 font-serif border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Critério de Atendimento</th>
                      <th className="py-3 px-4 font-bold text-neutral-500">Grande Escritório / Grande Banca</th>
                      <th className="py-3 px-4 font-bold text-red-900 bg-red-50/60">Nosso Escritório (RED Advogados)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold text-neutral-900">Quem te atende</td>
                      <td className="py-3 px-4 text-neutral-600">Vários profissionais, quase sempre estagiários diferentes</td>
                      <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30">Sempre os sócios — Dr. Reinaldo e Dra. Paula do início ao fim</td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold text-neutral-900">Nível de atenção</td>
                      <td className="py-3 px-4 text-neutral-600">Seu caso é mais um número entre milhares de processos</td>
                      <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30">Foco exclusivo e dedicação artesanal ao seu caso</td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold text-neutral-900">Linguagem utilizada</td>
                      <td className="py-3 px-4 text-neutral-600">Técnica e distante, cheia de termos que só advogados entendem</td>
                      <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30">Clara e humana — explicamos quantas vezes for preciso para você entender</td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold text-neutral-900">Canal de contato</td>
                      <td className="py-3 px-4 text-neutral-600">Call centers, secretárias e departamentos intermediários</td>
                      <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30">Canal direto via WhatsApp e telefone com quem decide a estratégia</td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold text-neutral-900">Estrutura de custo</td>
                      <td className="py-3 px-4 text-neutral-600">Estrutura corporativa gigante = honorários inflacionados</td>
                      <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30">Estrutura enxuta e eficiente = investimento justo e transparente</td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold text-neutral-900">Flexibilidade</td>
                      <td className="py-3 px-4 text-neutral-600">Regras rígidas e padronizadas de cobrança e atendimento</td>
                      <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30">Adaptado à realidade financeira e ao ritmo do cliente</td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold text-neutral-900">Tipo de relação</td>
                      <td className="py-3 px-4 text-neutral-600">Cliente é número de pasta</td>
                      <td className="py-3 px-4 font-medium text-emerald-950 bg-emerald-50/30">Pessoa real, com nome, história de vida e sentimentos respeitados</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BLOCO 3: PROVA SOCIAL E CASOS REAIS */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-red-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    📖 Prova Social e Casos Marcantes
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-mono">RESULTADOS REAIS ANONIMIZADOS</span>
              </div>
              <div className="p-6 space-y-5 text-sm">
                <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-900 uppercase">
                    <span>Caso Marcante · A Dignidade Reconquistada</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-neutral-900 mt-1">
                    "Não foi só uma causa ganha — foi a vida de uma pessoa que voltou aos trilhos."
                  </h4>
                  <div className="mt-3 space-y-2 text-xs text-neutral-700 leading-relaxed">
                    <p><strong>A Situação:</strong> Um cliente nos procurou em desespero, após meses tentando resolver sozinho uma pendência grave perante o Poder Público que bloqueava sua renda e sua paz familiar.</p>
                    <p><strong>A Dificuldade:</strong> Já havia consultado outros locais que cobraram caro apenas para dar respostas vazias, gerando a sensação de que nada mais poderia ser feito.</p>
                    <p><strong>A Solução:</strong> Examinamos minuciosamente o processo administrativo, identificamos a violação expressa ao devido processo legal cometida pelo órgão e ingressamos com a medida adequada com fundamentação técnica irretocável.</p>
                    <p><strong>O Resultado:</strong> O direito foi reconhecido. A ligação em que o cliente disse emocionado <em>"Doutor, conseguimos, minha vida voltou ao normal"</em> sintetiza o verdadeiro valor da advocacia: devolver a dignidade a quem confia no nosso trabalho.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <h5 className="font-bold text-emerald-950 text-xs uppercase">O Que os Clientes Mais Elogiam</h5>
                    <ul className="mt-2 text-xs text-emerald-900 space-y-1.5 leading-relaxed">
                      <li>• <em>"Você me ouviu com atenção e explicou tudo de forma que até eu, leigo, entendi perfeitamente."</em></li>
                      <li>• <em>"Sempre me responde rápido e nunca me deixou no escuro sobre o andamento."</em></li>
                      <li>• <em>"Foi honesto desde o primeiro dia, inclusive quando a probabilidade era difícil."</em></li>
                    </ul>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <h5 className="font-bold text-neutral-900 text-xs uppercase">Como Funciona a Indicação</h5>
                    <p className="mt-2 text-xs text-neutral-700 leading-relaxed">
                      Mais de 80% dos nossos novos clientes chegam por recomendação de quem já foi atendido. Acreditamos que a melhor propaganda não é o marketing agressivo, mas o cliente que dorme em paz e indica o Dr. Reinaldo e a Dra. Paula para familiares e amigos próximos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCO 4: QUEM NÓS NÃO ATENDEMOS */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-red-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    🚫 Quem Nós NÃO Atendemos (Critério Ético Inegociável)
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-mono">FILTRO DE INTEGRIDADE</span>
              </div>
              <div className="p-6 divide-y divide-neutral-100 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Causas que violem a boa-fé e a ética</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed text-xs sm:text-sm">
                    Não aceitamos causas com mentiras deliberadas, falsificação probatória ou com o objetivo de lesar terceiros de má-fé. Acreditamos que a verdade é a base de qualquer vitória legítima.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Áreas fora do nosso domínio técnico</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed text-xs sm:text-sm">
                    Se você nos procurar para uma demanda de uma especialidade que não dominamos com excelência (por exemplo, crimes complexos do tribunal do júri), seremos transparentes em dizer que não fazemos e indicaremos colegas renomados e éticos de nossa confiança.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Por que essa honestidade gera mais confiança?</span>
                  <div className="md:col-span-2 text-emerald-950 font-medium leading-relaxed text-xs sm:text-sm">
                    Porque o cliente sabe que, quando aceitamos a causa dele, é porque realmente dominamos a matéria, acreditamos no direito defendido e dedicaremos toda a nossa energia técnica para vencer.
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Callout Box with action */}
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>DIFERENCIAIS, POSICIONAMENTO E PROVA SOCIAL CONSOLIDADOS</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Confirma que os diferenciais, a tabela comparativa e o relato refletem com exatidão a alma do escritório?
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => copyToClipboard('APROVADO', 'etapa3-approved')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  {copied === 'etapa3-approved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar "APROVADO" para Chat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ETAPA 2 — MATRIZ DE SERVIÇOS, PROCESSO E VALORES */}
        {activeTab === 'etapa2' && (
          <div className="space-y-6">
            {/* Callout Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Etapa 2 em Validação: Clareza Total sem Letras Miúdas</p>
                <p className="mt-1 text-amber-900 leading-relaxed">
                  O cliente precisa saber exatamente quais problemas você resolve, como o atendimento funciona passo a passo e como os honorários são calculados.
                  Revise os 3 blocos abaixo. Se estiver alinhado, responda no chat com <strong className="underline">APROVADO</strong> para avançar para a <strong>ETAPA 3 (Diferenciais, Posicionamento e Prova Social)</strong>.
                </p>
              </div>
            </div>

            {/* BLOCO 1: ÁREAS DE ATUAÇÃO DETALHADAS */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-5 h-5 text-red-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    ⚖️ Áreas de Atuação (Construídas em Linguagem Simples)
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-mono">5 ÁREAS PRÁTICAS</span>
              </div>

              {/* Selector Bar */}
              <div className="p-4 bg-neutral-100/70 border-b border-neutral-200 flex flex-wrap gap-2">
                {serviceAreas.map((area, idx) => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      selectedArea === idx
                        ? 'bg-red-900 text-white shadow-xs'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                    }`}
                  >
                    <span>0{idx + 1}.</span>
                    <span>{area.title.split('&')[0].trim()}</span>
                  </button>
                ))}
              </div>

              {/* Active Area Detailed Card */}
              <div className="p-6">
                {(() => {
                  const area = serviceAreas[selectedArea];
                  const Icon = area.icon;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-900/10 text-red-900 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs text-red-900 font-bold uppercase tracking-wider">
                              Área 0{selectedArea + 1} de 05
                            </span>
                            <h3 className="text-lg font-serif font-bold text-neutral-900">{area.title}</h3>
                            <p className="text-xs text-neutral-500">{area.subtitle}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
                          <span className="text-xs font-bold text-neutral-500 uppercase block">
                            👤 Quem precisa desse serviço e por quê?
                          </span>
                          <p className="text-neutral-800 text-xs sm:text-sm leading-relaxed">{area.whoNeeds}</p>
                        </div>

                        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
                          <span className="text-xs font-bold text-neutral-500 uppercase block">
                            ⚠️ O problema real que resolve
                          </span>
                          <p className="text-neutral-800 text-xs sm:text-sm leading-relaxed">{area.realProblem}</p>
                        </div>

                        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/70 space-y-1">
                          <span className="text-xs font-bold text-emerald-800 uppercase block">
                            🏆 O resultado concreto que o cliente ganha
                          </span>
                          <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed font-medium">
                            {area.resultGained}
                          </p>
                        </div>

                        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1">
                          <span className="text-xs font-bold text-amber-900 uppercase block">
                            🚀 Passo inicial para buscar ajuda
                          </span>
                          <p className="text-amber-950 text-xs sm:text-sm leading-relaxed">{area.firstStep}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* BLOCO 2: COMO FUNCIONA — PASSO A PASSO (7 ETAPAS) */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-red-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    📋 Como Funciona — O Passo a Passo Sem Mistério
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-mono">DO PRIMEIRO CONTATO AO PÓS-SOLUÇÃO</span>
              </div>
              <div className="p-6">
                <p className="text-xs sm:text-sm text-neutral-600 mb-6">
                  Nenhuma surpresa no caminho. O cliente sabe exatamente o que acontece em cada fase, quem fala com ele e o que esperar.
                </p>

                <div className="space-y-3">
                  {stepsFlow.map((st) => (
                    <div
                      key={st.step}
                      className="p-4 rounded-xl border border-neutral-200 hover:border-red-900/30 transition-colors bg-white flex flex-col sm:flex-row items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-red-950 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {st.step}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-neutral-900 text-sm">{st.title}</h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BLOCO 3: VALORES, HONORÁRIOS E CONDIÇÕES TRANSPARENTES */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Banknote className="w-5 h-5 text-red-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    💰 Valores, Honorários e Condições Transparentes
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-mono">SEGURANÇA FINANCEIRA</span>
              </div>
              <div className="p-6 divide-y divide-neutral-100 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Modelo de Cobrança</span>
                  <div className="md:col-span-2 text-neutral-900 space-y-1.5 leading-relaxed">
                    <p>
                      <strong>Sob medida para a necessidade da causa:</strong>
                    </p>
                    <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
                      <li><strong>Valor fixo por serviço:</strong> Para defesas administrativas, pareceres, contratos e medidas com escopo bem definido.</li>
                      <li><strong>Valor por etapas processuais:</strong> O cliente investe conforme o andamento real do caso (1ª instância, recursos, execução).</li>
                      <li><strong>Ad exitum (percentual de êxito):</strong> Em causas cíveis cabíveis, combinado com valor inicial de custeio operacional.</li>
                      <li><strong>Mensalidade consultiva (retainer):</strong> Para empresas que precisam de assessoria jurídica contínua e previsível.</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Faixa de Referência de Mercado</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    <p className="font-medium">
                      Valores alinhados com a <strong>Tabela de Honorários da OAB/MG</strong> e a complexidade do direito em jogo:
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      Consultas técnicas aprofundadas e elaboração contratual a partir de valores acessíveis; processos contenciosos orçados de forma personalizada. <strong>O cliente sempre recebe a proposta formal completa antes de qualquer compromisso</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">O que está incluso nos honorários</span>
                  <div className="md:col-span-2 text-emerald-900 bg-emerald-50/50 p-3 rounded-lg border border-emerald-200/50 text-xs space-y-1">
                    <p className="font-semibold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Incluso integralmente:
                    </p>
                    <p>• Elaboração de petições, recursos e defesas técnicas personalizadas.</p>
                    <p>• Acompanhamento semanal de publicações no Diário de Justiça e prazos.</p>
                    <p>• Reuniões de alinhamento com Dr. Reinaldo ou Dra. Paula.</p>
                    <p>• Comunicação direta de andamentos sem intermediários.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">O que NÃO está incluso (Custos à parte)</span>
                  <div className="md:col-span-2 text-amber-950 bg-amber-50/50 p-3 rounded-lg border border-amber-200/50 text-xs space-y-1">
                    <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      Custos informados previamente por conta do cliente:
                    </p>
                    <p>• Custas judiciais do Tribunal e taxas de distribuição (caso o cliente não tenha direito à Justiça Gratuita).</p>
                    <p>• Emolumentos de cartório e certidões públicas.</p>
                    <p>• Honorários de peritos judiciais (se determinado pelo juiz).</p>
                    <p>• Deslocamentos extraordinários fora da Região Metropolitana de BH (se necessário).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Formas de Pagamento</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    <p className="font-medium">PIX, transferência bancária, cartão de crédito e parcelamento.</p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Possibilidade de entrada + parcelas mensais ajustadas à realidade financeira do cliente. O objetivo é que a assistência jurídica seja viável e segura.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Primeira Consulta / Conversa</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    <p className="font-medium">
                      O primeiro contato pelo WhatsApp é para triagem inicial e acolhimento.
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      Caso o caso exija análise documental aprofundada ou parecer técnico prévio, combinamos o valor da consulta previamente. Não há compromisso de contratação.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">E se o caso não der certo?</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <p className="font-semibold text-neutral-900">Dedicação integral e verdade antes de tudo.</p>
                    <p className="text-xs text-neutral-600 mt-1">
                      O Estatuto da Advocacia e a honestidade impedem qualquer profissional de prometer resultado ganho (a decisão final cabe ao juiz ou ao órgão público). O que garantimos é a aplicação da melhor tese técnica, cumprimento rigoroso de prazos e luta combativa pelo seu direito. Explicamos todos os riscos antes de iniciar para que você tome a decisão com lucidez.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 py-3 gap-2">
                  <span className="text-neutral-500 font-medium">Política de Sigilo e Confidencialidade</span>
                  <div className="md:col-span-2 text-neutral-900 leading-relaxed">
                    <p className="font-medium">Sigilo profissional protegido pelo artigo 7º, XIX, do Estatuto da OAB.</p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Toda informação, mensagem ou documento compartilhado permanece sob estrita confidencialidade legal e proteção de dados (LGPD).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Callout Box with action */}
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>MATRIZ DE SERVIÇOS E CONDIÇÕES DA ETAPA 2 CONSOLIDADAS</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  A matriz de serviços, o passo a passo e as condições de pagamento refletem com clareza a prática do escritório?
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => copyToClipboard('APROVADO', 'etapa2-approved')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  {copied === 'etapa2-approved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar "APROVADO" para Chat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOSSIER ESTRUTURADO ETAPA 1 (APROVADO) */}
        {activeTab === 'dossier' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Etapa 1 Aprovada e Registrada</p>
                <p className="mt-1 text-emerald-900 leading-relaxed">
                  Os dados oficiais (OAB/MG 111.989 e 196.128, Avenida do Contorno 7174) e a essência profissional (verdade inegociável, 18+ anos de prática) foram validados com sucesso.
                </p>
              </div>
            </div>

            {/* Resumo da Etapa 1 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs divide-y divide-neutral-100 text-sm">
              <div className="py-3">
                <span className="text-xs font-bold text-neutral-500 uppercase block">Escritório & Titulares</span>
                <p className="font-serif font-bold text-base text-neutral-900 mt-1">
                  RED Advogados Associados (Reinaldo Dias Sociedade Individual de Advocacia)
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Dr. Reinaldo Eustáquio Dias (OAB/MG 111.989) & Dra. Paula da Silva Mattos (OAB/MG 196.128)
                </p>
              </div>

              <div className="py-3">
                <span className="text-xs font-bold text-neutral-500 uppercase block">Endereço & Contato</span>
                <p className="text-neutral-900 font-medium mt-1">
                  Avenida do Contorno, 7174 — Sala 09 — Santo Antônio — Belo Horizonte/MG
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Telefone/WhatsApp: (31) 98334-7116 · E-mail: reinaldodias.advogado@gmail.com
                </p>
              </div>

              <div className="py-3">
                <span className="text-xs font-bold text-neutral-500 uppercase block">Formação & Credenciais</span>
                <p className="text-neutral-900 text-xs mt-1">
                  PUC Minas (Graduação e Pós-Graduação em Processual Aplicado) · Universitat de Girona - Espanha (Mestrado em Cultura Jurídica, Segurança e Justiça) · Mais de 18 anos de prática contínua.
                </p>
              </div>

              <div className="py-3">
                <span className="text-xs font-bold text-neutral-500 uppercase block">Frase-Síntese & Princípio</span>
                <p className="text-neutral-900 font-serif italic text-sm mt-1">
                  "Você não precisa enfrentar isso sozinho." — Princípio: "A verdade, sempre."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRÉVIA DA PRESENÇA DIGITAL */}
        {activeTab === 'preview' && (
          <div className="space-y-10 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-neutral-100">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600">
                  <span className="text-red-900 font-bold">RED ADVOGADOS ASSOCIADOS</span>
                  <span>·</span>
                  <span>Belo Horizonte / MG</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 tracking-tight leading-tight">
                  Resolva Seu Problema Jurídico com <span className="text-red-950 underline decoration-amber-500/70">Tranquilidade e Clareza</span>.
                </h1>

                <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                  Atendimento direto e sem jargões com quem decide seu caso. Unimos mais de 18 anos de experiência em Belo Horizonte, mestrado internacional e compromisso inegociável com a verdade.
                </p>

                {/* Trust markers */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-neutral-600 pt-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    OAB/MG 111.989 & 196.128
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Presencial em BH e Online Brasil
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Sigilo Profissional Absoluto
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                  <a
                    href="https://wa.me/5531983347116?text=Ol%C3%A1%20Dr.%20Reinaldo%20e%20Dra.%20Paula,%20gostaria%20de%20conversar%20sobre%20meu%20caso"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Falar Agora no WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      const el = document.getElementById('simulator');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Explicar Meu Caso (Análise)</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-500 italic">
                  "Sua situação merece atenção pessoal e escuta atenta, não um número frio de processo."
                </p>
              </div>

              {/* Photo & Professional Profile Card */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 border border-neutral-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-neutral-300 mx-auto mb-4 bg-neutral-900">
                    <img
                      src="/assets/aistudio/foto_perfil_reinaldo_site-essa_870179fe.jpg"
                      alt="Dr. Reinaldo Eustáquio Dias - OAB/MG nº 111.989"
                      className="w-full h-full object-cover object-[center_12%]"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="font-serif text-xl font-bold text-neutral-900">Dr. Reinaldo Eustáquio Dias</h3>
                    <p className="text-xs text-red-900 font-semibold mt-0.5">OAB/MG nº 111.989 · Fundador Titular</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Com Dra. Paula da Silva Mattos (OAB/MG nº 196.128)</p>
                  </div>

                  <div className="mt-5 space-y-2.5 text-xs text-neutral-700 pt-4 border-t border-neutral-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Experiência Prática</span>
                      <span className="font-semibold text-neutral-900">Mais de 18 anos (desde 2007)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Graduação</span>
                      <span className="font-semibold text-neutral-900">PUC Minas (2002–2007)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Pós-Graduação</span>
                      <span className="font-semibold text-neutral-900">Processual Aplicado (PUC Minas)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Mestrado</span>
                      <span className="font-semibold text-neutral-900">Universitat de Girona (Espanha)</span>
                    </div>
                  </div>

                  <div className="mt-5 bg-white p-3.5 rounded-xl border border-neutral-200 text-center">
                    <p className="text-xs font-serif italic text-neutral-800">
                      "A verdade, sempre. Você fala diretamente com quem cuida do seu caso do início ao fim."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO: ÁREAS DE ATUAÇÃO PREVIEW */}
            <div className="py-6 border-b border-neutral-100">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-red-900 uppercase tracking-wider">Áreas de Atuação</span>
                  <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                    Como Podemos Ajudar Você
                  </h2>
                </div>
                <span className="text-xs text-neutral-500">Atuação Consultiva e Contenciosa</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <div key={area.id} className="p-5 rounded-xl border border-neutral-200 hover:border-red-900/40 transition-colors">
                      <div className="flex items-center gap-2 font-serif font-bold text-neutral-900">
                        <Icon className="w-4 h-4 text-red-900" />
                        <span>{area.title}</span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                        {area.realProblem}
                      </p>
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <span className="text-[11px] text-emerald-800 font-semibold block">
                          Resultado: {area.resultGained}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="p-5 rounded-xl bg-red-950 text-white flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-amber-400">Dúvida sobre sua causa?</h3>
                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                      Não tem certeza em qual área sua questão se enquadra? Fale diretamente conosco para uma análise prévia.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/5531983347116?text=Ol%C3%A1%20Dr.%20Reinaldo,%20gostaria%20de%20saber%20se%20minha%20causa%20pode%20ser%20atendida"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-between text-xs font-semibold text-amber-300 hover:text-white"
                  >
                    <span>Falar no WhatsApp agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* SEÇÃO: SIMULADOR DE ANÁLISE / CONTATO INICIAL */}
            <div id="simulator" className="py-6 border-b border-neutral-100">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-8">
                <div className="max-w-2xl mb-6">
                  <span className="text-xs font-semibold text-red-900 uppercase tracking-wider">Primeiro Contato Seguro</span>
                  <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                    Explique Sua Situação para Análise Prévia
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    Envie seus dados básicos e o resumo do que aconteceu. Retornamos diretamente por WhatsApp ou telefone em até 24 horas úteis.
                  </p>
                </div>

                {sentSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-6 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Dados registrados no CRM e enviados ao Dr. Reinaldo e Dra. Paula!</p>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Em breve entraremos em contato pelo telefone ou WhatsApp informado para agendar a primeira conversa.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>Seu Nome Completo *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={consultName}
                          onChange={(e) => setConsultName(e.target.value)}
                          placeholder="Ex: Carlos Eduardo Silva"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>E-mail *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={consultEmail}
                          onChange={(e) => setConsultEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>CPF *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={consultCpf}
                          onChange={(e) => setConsultCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>WhatsApp / Telefone com DDD *</span>
                          <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={consultPhone}
                          onChange={(e) => setConsultPhone(e.target.value)}
                          placeholder="(31) 90000-0000"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                          <span>Número do Processo</span>
                          <span className="text-[10px] text-neutral-400 font-normal">Opcional</span>
                        </label>
                        <input
                          type="text"
                          value={consultProcesso}
                          onChange={(e) => setConsultProcesso(e.target.value)}
                          placeholder="Ex: 5001234-88.2024.8.13.0024"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">Área provável do problema</label>
                      <select
                        value={caseType}
                        onChange={(e) => setCaseType(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                      >
                        <option value="Direito Administrativo & Servidores Públicos">Direito Administrativo / Servidor / Concurso / Licitação</option>
                        <option value="Direito Cível, Indenizações & Contratos">Direito Cível / Contratos / Cobrança / Indenização</option>
                        <option value="Direito Empresarial & Gestão de Riscos">Direito Empresarial / Proteção de Negócios</option>
                        <option value="Direito da Cultura & Editais">Direito da Cultura / Editais / Direitos Autorais</option>
                        <option value="Parcerias Público-Privadas (PPP)">Parcerias Público-Privadas (PPP)</option>
                        <option value="Não sei exatamente / Outro">Não sei ao certo / Preciso de orientação geral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">Resumo Breve do Caso (Sem termos técnicos)</label>
                      <textarea
                        rows={2}
                        value={consultMsg}
                        onChange={(e) => setConsultMsg(e.target.value)}
                        placeholder="Conte em poucas palavras o que está acontecendo e qual a sua urgência..."
                        className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsVisitorModalOpen(true)}
                        className="text-xs text-amber-900 hover:text-amber-950 font-semibold underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Preencher na Caixa de Visita Rápida</span>
                      </button>

                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-red-950 hover:bg-red-900 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        {submitLoading ? (
                          <span>Registrando no CRM...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Solicitar Análise Inicial</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* SEÇÃO: LOCALIZAÇÃO & DADOS DO ESCRITÓRIO */}
            <div className="pt-2">
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-200">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-red-900 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 inline-block mb-1">
                      Atendimento Presencial e Online
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">
                      Sede em Belo Horizonte — Av. do Contorno, 7174
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      Estrutura discreta, confortável e segura para acolher sua história e defender seus direitos com tranquilidade.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Avenida+do+Contorno%2C+7174+-+Santo+Ant%C3%B4nio%2C+Belo+Horizonte+-+MG%2C+30110-047"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Traçar Rota no Google Maps</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Coluna Esquerda: Dados e Acessibilidade */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3.5 text-xs text-neutral-700">
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                        <MapPin className="w-4 h-4 text-red-900 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-neutral-900 text-sm block">Avenida do Contorno, 7174 — Sala 09</strong>
                          <p className="text-neutral-600 mt-0.5">Bairro Santo Antônio — Belo Horizonte/MG</p>
                          <span className="text-[11px] text-neutral-500 block">CEP: 30110-047 · Próximo à Savassi</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                        <Clock className="w-4 h-4 text-red-900 shrink-0" />
                        <div>
                          <strong className="text-neutral-900 block">Horário de Funcionamento</strong>
                          <span className="text-neutral-600">Segunda a sexta-feira, das 09h às 17h</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                        <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <strong className="text-emerald-950 block">Telefone & WhatsApp Direto</strong>
                          <a
                            href="https://wa.me/5531983347116"
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 font-semibold hover:underline"
                          >
                            (31) 98334-7116 — Clique para falar
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                        <Mail className="w-4 h-4 text-neutral-700 shrink-0" />
                        <div>
                          <strong className="text-neutral-900 block">E-mail Oficial</strong>
                          <span className="text-neutral-600 font-mono text-[11px]">reinaldodias.advogado@gmail.com</span>
                        </div>
                      </div>
                    </div>

                    {/* Dicas de Acesso Rápido */}
                    <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-2 text-[11px] text-neutral-600">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-md">
                        <Car className="w-3 h-3 text-neutral-500" /> Vagas e estacionamentos próximos
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded-md">
                        <Bus className="w-3 h-3 text-neutral-500" /> Ônibus SC01, SC02, 2151
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Avenida+do+Contorno%2C+7174+-+Santo+Ant%C3%B4nio%2C+Belo+Horizonte+-+MG%2C+30110-047"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 bg-red-950 hover:bg-red-900 text-white rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Abrir no Google Maps</span>
                      </a>
                      <a
                        href="https://waze.com/ul?q=Avenida%20do%20Contorno%207174%20Belo%20Horizonte"
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5 text-sky-600" />
                        <span>Waze</span>
                      </a>
                    </div>
                  </div>

                  {/* Coluna Direita: Mapa Interativo Visual com Embed */}
                  <div className="lg:col-span-7 flex flex-col">
                    <div className="rounded-xl overflow-hidden border border-neutral-300 shadow-sm relative flex-1 min-h-[300px] bg-neutral-100">
                      <iframe
                        title="Mapa Interativo - Sede RED Advogados Associados"
                        src="https://maps.google.com/maps?q=Avenida%20do%20Contorno,%207174,%20Santo%20Ant%C3%B4nio,%20Belo%20Horizonte%20MG%2030110-047&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full min-h-[300px] border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-neutral-200 text-[11px] text-neutral-800 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-red-900 shrink-0" />
                        <span className="font-semibold">Av. do Contorno, 7174 — Sala 09</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRILHA DE CONSTRUÇÃO E REGRAS DO MÉTODO */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
              <h2 className="font-serif font-bold text-xl text-neutral-900 mb-2">
                Método Sequencial de Validação — 6 Etapas
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Cada fase é aprovada individualmente para assegurar total alinhamento antes do próximo passo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>ETAPA 1</span>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px]">APROVADA ✅</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mt-1">Identidade Oficial + Essência Profissional</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Unificação dos dados oficiais da OAB com a história humana, valores inegociáveis e compromisso com a verdade.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>ETAPA 2 (ATUAL)</span>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px]">EM VALIDAÇÃO</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mt-1">Matriz de Serviços, Processo e Valores</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Definição das áreas em linguagem simples, 7 passos do atendimento e transparência total sobre modelos de honorários e custas.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                    <span>ETAPA 3 (PRÓXIMA)</span>
                    <span className="text-[10px] text-neutral-400">Aguardando Aprovação</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mt-1">Diferenciais & Prova Social</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Comparativo Escritório Dedicado vs Grande Banca, depoimentos reais e declaração honesta de quem não atende.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                    <span>ETAPA 4</span>
                    <span className="text-[10px] text-neutral-400">Aguardando</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mt-1">Landing Page Completa (8 Blocos)</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Conteúdo final bloco a bloco pronto para implementação visual, formulário de captura e rodapé com dados legais.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                    <span>ETAPA 5</span>
                    <span className="text-[10px] text-neutral-400">Aguardando</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mt-1">SEO Local & Redes Sociais</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Google Meu Negócio configurado, páginas por região (Belo Horizonte e Região Metropolitana) e 10 legendas prontas.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>ETAPA 6</span>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px]">APROVADA ✅</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm mt-1">Ecossistema de Atendimento & Blog</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Scripts para WhatsApp (boas-vindas, lembrete, pós-atendimento), 5 artigos educativos e modelos de gestão de reputação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 text-xs py-8 border-t border-neutral-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-serif font-bold text-white text-sm">RED Advogados Associados</span>
            <span>·</span>
            <span>OAB/MG 111.989 & OAB/MG 196.128</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('crm')}
              className="text-neutral-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 text-[11px]"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Área do Advogado (CRM)</span>
            </button>
          </div>
          <div className="text-center md:text-right">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Avenida+do+Contorno%2C+7174+-+Santo+Ant%C3%B4nio%2C+Belo+Horizonte+-+MG%2C+30110-047"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors group"
              title="Abrir no Google Maps para traçar rota"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="underline decoration-neutral-700 underline-offset-4 group-hover:decoration-white">
                Avenida do Contorno, 7174 — Sala 09 — Santo Antônio — Belo Horizonte/MG
              </span>
              <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 shrink-0" />
            </a>
            <span className="block text-[11px] text-neutral-500 mt-1">
              Atendimento presencial e online para todo o Brasil · Estacionamento e acessibilidade
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
