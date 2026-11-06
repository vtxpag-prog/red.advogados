import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  MessageSquare
} from 'lucide-react';

interface VisitorCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function VisitorCaptureModal({
  isOpen,
  onClose,
  onSuccess
}: VisitorCaptureModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [processo, setProcesso] = useState('');
  const [area, setArea] = useState('Direito Administrativo & Servidores Públicos');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Format CPF mask: 000.000.000-00
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setCpf(v);
  };

  // Format Phone mask: (00) 00000-0000 or (00) 0000-0000
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    setTelefone(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation of mandatory fields
    if (!nome.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, informe um e-mail válido.');
      return;
    }
    if (!cpf.trim() || cpf.replace(/\D/g, '').length < 11) {
      setErrorMsg('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }
    if (!telefone.trim() || telefone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe seu telefone com DDD (WhatsApp).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          cpf: cpf.trim(),
          telefone: telefone.trim(),
          processo: processo.trim(),
          area,
          mensagem: mensagem.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar seus dados.');
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNome('');
    setEmail('');
    setCpf('');
    setTelefone('');
    setProcesso('');
    setMensagem('');
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 text-white p-5 rounded-t-2xl flex items-center justify-between border-b border-neutral-800 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-900/60 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white leading-tight">
                Cadastrar Visita & Análise do Caso
              </h3>
              <p className="text-[11px] text-neutral-300">
                Atendimento direto com Dr. Reinaldo Dias & Dra. Paula Mattos
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-neutral-900">
                Dados Recebidos com Sucesso!
              </h4>
              <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Olá, <strong>{nome}</strong>! Suas informações foram registradas com total sigilo ético no sistema da <strong>RED Advogados Associados</strong>.
              </p>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 max-w-md mx-auto text-left space-y-1.5">
                <p><strong>Protocolo do Lead:</strong> Registrado no CRM do escritório.</p>
                <p><strong>Prazo de Retorno:</strong> Em até 24 horas úteis por WhatsApp ou telefone.</p>
                <p><strong>Sede:</strong> Av. do Contorno, 7174 — Sala 09, Santo Antônio, Belo Horizonte/MG.</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/5531983347116?text=Ol%C3%A1%20Dr.%20Reinaldo,%20acabei%20de%20cadastrar%20minha%20visita%20no%20site%20(Nome:%20${encodeURIComponent(
                    nome
                  )}).%20Gostaria%20de%20agilizar%20meu%20atendimento.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Falar Agora no WhatsApp</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Preencha os campos abaixo. Seus dados são protegidos por sigilo profissional inegociável nos termos do Estatuto da Advocacia e OAB.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Grid 2 colunas para campos pessoais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nome (Obrigatório) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Nome Completo *</span>
                    </span>
                    <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Eduardo de Oliveira"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                  />
                </div>

                {/* E-mail (Obrigatório) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <span>E-mail *</span>
                    </span>
                    <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                  />
                </div>

                {/* CPF (Obrigatório) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span>CPF *</span>
                    </span>
                    <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                  />
                </div>

                {/* Telefone / WhatsApp (Obrigatório) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Telefone / WhatsApp *</span>
                    </span>
                    <span className="text-[10px] text-red-800 font-semibold uppercase">Obrigatório</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={telefone}
                    onChange={handlePhoneChange}
                    placeholder="(31) 90000-0000"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                  />
                </div>

                {/* Número do Processo (Opcional) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Nº do Processo</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">Opcional</span>
                  </label>
                  <input
                    type="text"
                    value={processo}
                    onChange={(e) => setProcesso(e.target.value)}
                    placeholder="Ex: 5001234-88.2024.8.13.0024"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                  />
                </div>
              </div>

              {/* Área de Interesse */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Área de Interesse / Especialidade:
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                >
                  <option value="Direito Administrativo & Servidores Públicos">
                    Direito Administrativo & Servidores Públicos (PAD, Concursos, Licitações)
                  </option>
                  <option value="Direito Cível, Indenizações & Contratos">
                    Direito Cível, Indenizações, Cobranças & Contratos
                  </option>
                  <option value="Direito Empresarial & Gestão de Riscos">
                    Direito Empresarial & Blindagem de Negócios
                  </option>
                  <option value="Direito da Cultura & Editais">
                    Direito da Cultura (Leis Rouanet, Paulo Gustavo, Aldir Blanc)
                  </option>
                  <option value="Parcerias Público-Privadas (PPP)">
                    Parcerias Público-Privadas (PPP) e Concessões
                  </option>
                  <option value="Outro / Não sei ao certo">
                    Outro Assunto / Preciso de orientação geral
                  </option>
                </select>
              </div>

              {/* Mensagem / Breve Relato */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                  <span>Breve Resumo da Dúvida ou Problema:</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Sem juridiquês</span>
                </label>
                <textarea
                  rows={3}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Conte com suas palavras o que está acontecendo e se existe algum prazo ou urgência em andamento..."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/40"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sigilo profissional garantido pela OAB/MG nº 111.989</span>
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-950 hover:bg-red-900 disabled:bg-neutral-400 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Registrando...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Registrar Visita & Solicitar Análise</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
