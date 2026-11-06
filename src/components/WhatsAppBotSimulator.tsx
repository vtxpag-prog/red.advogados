import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Check,
  CheckCheck,
  Clock,
  Phone,
  Video,
  MoreVertical,
  Send,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Copy,
  ChevronRight,
  ShieldCheck,
  Zap,
  User,
  ArrowRight,
  MapPin,
  Calendar,
  ThumbsUp,
  Smile,
  Paperclip,
  Mic,
  Star,
  ExternalLink
} from 'lucide-react';

export interface StageData {
  id: number;
  stageName: string;
  triggerEvent: string;
  triggerType: 'webhook' | 'cron' | 'manual' | 'calendar';
  clientPrompt: string;
  botReply: (name: string, format: 'presencial' | 'online') => string;
  delayNotice: string;
  oabRule: string;
  badgeColor: string;
}

export const stagesData: StageData[] = [
  {
    id: 1,
    stageName: '1. Primeiro Contato / Lead',
    triggerEvent: 'Cliente clica no botão da Landing Page ou envia primeira mensagem',
    triggerType: 'webhook',
    clientPrompt: 'Olá! Encontrei o escritório no Google. Estou com um problema sério no meu trabalho público e não sei por onde começar...',
    botReply: (name, _) =>
      `Olá, ${name || 'amigo(a)'}! Que bom que você entrou em contato.\n\nAqui é da equipe do Dr. Reinaldo Dias (OAB/MG 111.989) e da Dra. Paula Mattos (OAB/MG 196.128), da RED Advogados Associados.\n\nQueremos que você saiba desde já: você não precisa enfrentar essa situação sozinho(a).\n\nPara podermos te acolher com cuidado e entender a melhor saída jurídica:\n1️⃣ Você poderia nos contar brevemente o que está acontecendo?\n2️⃣ Já existe alguma notificação recebida, processo aberto ou prazo correndo?\n\n🔒 Fique muito tranquilo(a): todas as mensagens aqui são protegidas por absoluto sigilo profissional. Assim que responder, analisaremos seu relato pessoalmente.`,
    delayNotice: 'Resposta imediata (automática nos primeiros 2 minutos)',
    oabRule: 'Art. 28 do CED/OAB: Comunicação meramente informativa, acolhedora e com resguardo imediato do sigilo.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
  },
  {
    id: 2,
    stageName: '2. Confirmação de Agendamento',
    triggerEvent: 'Consulta confirmada na agenda (Presencial ou Online)',
    triggerType: 'calendar',
    clientPrompt: 'Perfeito, gostaria de agendar para quinta-feira às 14h30.',
    botReply: (name, format) =>
      format === 'presencial'
        ? `Tudo certo, ${name || 'Cliente'}! Sua consulta foi confirmada com sucesso.\n\n🗓 Quinta-feira, 24 de Outubro às 14h30\n📍 PRESENCIAL: Av. do Contorno, 7174 — Sala 09, Bairro Santo Antônio, Belo Horizonte/MG (CEP 30110-047).\n\n💡 Dica importante: Se já tiver em mãos seus documentos (RG, comprovante de residência e portarias/notificações), traga-os consigo ou envie fotos por aqui com antecedência. Nosso escritório possui estrutura reservada e estacionamento fácil na região.\n\nAté breve!\nDr. Reinaldo Dias & Dra. Paula Mattos`
        : `Tudo certo, ${name || 'Cliente'}! Sua consulta online foi confirmada com sucesso.\n\n🗓 Quinta-feira, 24 de Outubro às 14h30\n💻 ONLINE via Google Meet: meet.google.com/red-adv-consulta\n\n💡 Dica importante: Você pode acessar direto pelo celular ou computador. Se já tiver documentos ou PDFs do caso, pode encaminhar por aqui com antecedência.\n\nAté breve!\nDr. Reinaldo Dias & Dra. Paula Mattos`,
    delayNotice: 'Disparo no momento em que a reunião é fixada na agenda',
    oabRule: 'Formalização de atendimento com identificação clara dos advogados titulares.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    id: 3,
    stageName: '3. Lembrete Cuidadoso (Véspera)',
    triggerEvent: 'Sistema detecta 24 horas para o horário agendado',
    triggerType: 'cron',
    clientPrompt: '',
    botReply: (name, format) =>
      `Olá, ${name || 'Cliente'}, boa tarde!\n\nPassando apenas para confirmar nossa reunião de amanhã:\n🗓 Amanhã às 14h30 (${format === 'presencial' ? 'Presencial na Av. do Contorno, 7174 - Sala 09' : 'Online pelo Google Meet'}).\n\nSeparamos esse horário exclusivamente para ouvir sua história e analisar o caso com toda a calma.\n\nCaso tenha ocorrido algum imprevisto e precise reagendar, basta nos avisar por aqui com antecedência.\n\nUm abraço e até amanhã!`,
    delayNotice: 'Disparado exatamente 24h antes do compromisso',
    oabRule: 'Reduz taxa de no-show em até 70% sem soar invasivo.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 4,
    stageName: '4. Pós-Atendimento / Resumo de Prazos',
    triggerEvent: 'Advogado conclui a reunião e salva o plano de ação',
    triggerType: 'manual',
    clientPrompt: 'Muito obrigado pela consulta de hoje, Dr. Reinaldo. Fiquei bem mais calmo.',
    botReply: (name, _) =>
      `Olá, ${name || 'Cliente'}! Foi uma grande honra conversar com você hoje.\n\nSabemos que questões jurídicas geram ansiedade, mas nosso compromisso é trazer clareza em cada etapa.\n\n📌 Resumo do que combinamos na reunião:\n• O que nós faremos: Elaborar a minuta da impugnação/defesa técnica até a próxima terça-feira.\n• O que precisamos de você: Enviar a cópia dos dois últimos contracheques e a notificação original até sexta-feira.\n\nQualquer dúvida enquanto reúne a documentação, pode me chamar por aqui. Estamos juntos nessa jornada!\n\nDr. Reinaldo Dias & Dra. Paula Mattos`,
    delayNotice: 'Enviado até 2 horas após o encerramento da consulta',
    oabRule: 'Princípio da transparência e previsibilidade contratual.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
  },
  {
    id: 5,
    stageName: '5. Acompanhamento Sem Juridiquês',
    triggerEvent: 'Nova movimentação processual registrada no PJe / Diário Oficial',
    triggerType: 'webhook',
    clientPrompt: 'Dr., vi no aplicativo que saiu uma intimação no meu processo. Isso é ruim?!',
    botReply: (name, _) =>
      `Olá, ${name || 'Cliente'}, pode ficar com o coração totalmente em paz!\n\n📄 O que aconteceu no processo:\nO juiz apenas despachou determinando que o órgão público apresente as informações no prazo legal de 15 dias.\n\n🔍 O que isso significa na prática:\nÉ uma etapa 100% normal e esperada do procedimento. Mostra que o processo está caminhando e que agora a outra parte é obrigada a se manifestar formalmente.\n\n⏳ O que você precisa fazer agora:\nAbsolutamente nada. Nós acompanhamos o prazo diariamente no escritório e prepararemos a réplica no momento certo.\n\nSeguimos cuidando de tudo por aqui!`,
    delayNotice: 'Disparo proativo assim que o escritório faz a leitura do andamento',
    oabRule: 'Dever de informação clara (Código de Defesa do Consumidor e Estatuto da Advocacia).',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
  },
  {
    id: 6,
    stageName: '6. Notícia de Vitória / Alvará',
    triggerEvent: 'Sentença favorável, acordo homologado ou alvará expedido',
    triggerType: 'manual',
    clientPrompt: '',
    botReply: (name, _) =>
      `Olá, ${name || 'Cliente'}! Temos uma excelente notícia para compartilhar com você hoje! 🎉⚖️\n\nO juiz acolheu os nossos pedidos e a decisão transitou em julgado de forma muito favorável!\n\nFoi uma satisfação imensa defender os seus direitos e ver a sua dignidade e segurança restabelecidas após tanto tempo de espera.\n\n📌 Próximo passo:\nNossa equipe já solicitou a expedição da ordem de pagamento. Faremos a prestação de contas completa e o repasse para sua conta bancária até o próximo dia útil.\n\nParabéns pela confiança e por não ter desistido!`,
    delayNotice: 'Comunicação humana personalizada imediata ao êxito',
    oabRule: 'Transparência inegociável na prestação de contas e levantamento de valores.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    id: 7,
    stageName: '7. Convite Ético de Avaliação (Google)',
    triggerEvent: '3 dias após a conclusão financeira e documental do processo',
    triggerType: 'cron',
    clientPrompt: 'Muito obrigado por tudo, Dr. Reinaldo e Dra. Paula! Vocês salvaram minha paz de espírito.',
    botReply: (name, _) =>
      `Muito obrigado pelo carinho, ${name || 'Cliente'}! Trabalhar pela sua causa foi gratificante para nós.\n\nGostaríamos de lhe fazer um convite simples e muito importante:\n\nPara um escritório como o nosso — onde o atendimento é próximo, pessoal e artesanal —, o relato sincero de clientes reais ajuda imensamente outras pessoas e servidores que hoje estão angustiados a encontrarem um amparo sério.\n\nVocê teria 1 minutinho para nos contar como foi sua experiência no Google?\n\n👉 https://g.page/r/red-advogados-bh/review\n\nSua palavra faz toda a diferença para o nosso trabalho. Muito obrigado!`,
    delayNotice: 'Enviado 3 dias após a vitória/conclusão com o cliente relaxado',
    oabRule: 'Art. 39 do Provimento 205/2021: Prova social espontânea sem mercantilização.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 8,
    stageName: '8. Reativação Cautelosa (Inativo 45d)',
    triggerEvent: '45 dias sem envio de documentos pendentes ou sem contato',
    triggerType: 'cron',
    clientPrompt: '',
    botReply: (name, _) =>
      `Olá, ${name || 'Cliente'}, como você está? Espero que esteja tudo bem com você e sua família!\n\nEstava revisando nosso planejamento aqui no escritório e me lembrei de você. Passando apenas para saber se conseguiu reunir aqueles documentos ou se teve algum desdobramento na sua situação.\n\nSe precisar retomar nossa conversa ou tiver qualquer dúvida pendente, estamos inteiramente à sua disposição por aqui.\n\nUm abraço fraterno,\nDr. Reinaldo Dias & Dra. Paula Mattos\nRED Advogados Associados`,
    delayNotice: 'Disparo suave aos 45 dias para resgatar casos congelados',
    oabRule: 'Retomada de relacionamento consultivo sem importunação comercial agressiva.',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
  }
];

export default function WhatsAppBotSimulator() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [clientName, setClientName] = useState('Carlos Eduardo');
  const [meetingFormat, setMeetingFormat] = useState<'presencial' | 'online'>('presencial');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [interactiveMessages, setInteractiveMessages] = useState<
    { sender: 'user' | 'bot'; text: string; time: string }[]
  >([]);

  const activeStage = stagesData[currentStageIndex];

  // When stage changes, simulate typing effect and update messages
  useEffect(() => {
    setIsTyping(true);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsgs: { sender: 'user' | 'bot'; text: string; time: string }[] = [];

    if (activeStage.clientPrompt) {
      newMsgs.push({
        sender: 'user',
        text: activeStage.clientPrompt,
        time: timeStr
      });
    }

    const timer = setTimeout(() => {
      newMsgs.push({
        sender: 'bot',
        text: activeStage.botReply(clientName, meetingFormat),
        time: timeStr
      });
      setInteractiveMessages(newMsgs);
      setIsTyping(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [currentStageIndex, clientName, meetingFormat]);

  // Auto-play journey simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStageIndex((prev) => (prev + 1) % stagesData.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulador de Automação Humanizada</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Simulador de Atendimento WhatsApp em 8 Etapas
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Veja como cada um dos 8 scripts é acionado automaticamente em cada momento da jornada do cliente.
            A automação garante velocidade de resposta sem abrir mão do calor humano e do respeito às normas da OAB.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors ${
                isPlaying
                  ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar Simulação Automática</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Tour Automático (Auto-Play)</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStageIndex(0);
              }}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar do Início</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic background */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-8 opacity-10 pointer-events-none">
          <MessageSquare className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Visual Journey Pipeline Stepper */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Trilha da Jornada do Cliente
            </span>
            <h3 className="text-base font-serif font-bold text-neutral-900 mt-0.5">
              Etapa Selecionada: {activeStage.stageName}
            </h3>
          </div>
          <div className="text-xs text-neutral-500">
            Passo <strong>{currentStageIndex + 1}</strong> de <strong>{stagesData.length}</strong>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stagesData.map((stage, idx) => {
            const isSelected = idx === currentStageIndex;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStageIndex(idx);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    0{stage.id}
                  </span>
                  {isSelected && <Zap className="w-3 h-3 text-emerald-600 animate-bounce" />}
                </div>
                <p className="text-[11px] font-bold text-neutral-800 mt-1.5 line-clamp-2 leading-tight">
                  {stage.stageName.split('. ')[1]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls + WhatsApp Screen Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Automation Controller & Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Personalization Widget */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Personalizar Simulação em Tempo Real</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nome do Cliente para o Teste:
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Carlos Eduardo, Mariana, Dr. Fernando"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                O script adapta dinamicamente o nome no corpo da mensagem.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Formato da Consulta (Para Etapa 2 e 3):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMeetingFormat('presencial')}
                  className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                    meetingFormat === 'presencial'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Presencial (Av. Contorno)</span>
                </button>
                <button
                  onClick={() => setMeetingFormat('online')}
                  className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                    meetingFormat === 'online'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Online (Google Meet)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Technical Automation Trigger Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Gatilho & Regra de Negócio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-200 rounded font-semibold text-neutral-700">
                Trigger: {activeStage.triggerType.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-neutral-900 block">Condição de Disparo:</strong>
                <p className="text-neutral-600 mt-0.5 leading-relaxed">{activeStage.triggerEvent}</p>
              </div>

              <div>
                <strong className="text-neutral-900 block">Tempo de Resposta Previsto:</strong>
                <p className="text-neutral-600 mt-0.5">{activeStage.delayNotice}</p>
              </div>

              <div className="pt-2 border-t border-neutral-200">
                <strong className="text-emerald-900 flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Conformidade Ética OAB:</span>
                </strong>
                <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">{activeStage.oabRule}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={() =>
                  handleCopy(
                    activeStage.botReply(clientName, meetingFormat),
                    `stage-copy-${activeStage.id}`
                  )
                }
                className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {copiedId === `stage-copy-${activeStage.id}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Texto Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Copiar Este Script</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentStageIndex((prev) => (prev + 1) % stagesData.length);
                }}
                className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>Avançar Etapa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: WhatsApp Phone Simulation Mockup (7 Cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[420px] bg-neutral-900 rounded-[38px] p-3 shadow-2xl ring-1 ring-neutral-800">
            {/* Phone Top Notch / Speaker Bar */}
            <div className="flex items-center justify-between px-6 pt-1 pb-2">
              <span className="text-[10px] font-semibold text-white/70">09:41</span>
              <div className="w-20 h-4 bg-neutral-800 rounded-full" />
              <div className="flex items-center gap-1.5 text-white/70 text-[10px]">
                <span>5G</span>
                <div className="w-4 h-2.5 border border-white/70 rounded-xs flex items-center p-0.5">
                  <div className="w-full h-full bg-white/70 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* WhatsApp Screen Body */}
            <div className="bg-[#EFEAE2] rounded-[28px] overflow-hidden flex flex-col h-[580px] relative border border-neutral-300">
              {/* WhatsApp App Header */}
              <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src="/assets/aistudio/foto_perfil_reinaldo_site-essa_870179fe.jpg"
                      alt="Dr. Reinaldo Dias"
                      className="w-10 h-10 rounded-full object-cover object-[center_12%] shadow-xs border-2 border-white bg-neutral-900"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-semibold text-xs leading-tight truncate flex items-center gap-1">
                      <span>RED Advogados Associados</span>
                    </h5>
                    <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                      {isTyping ? (
                        <span className="animate-pulse font-medium">digitando...</span>
                      ) : (
                        <span>online · Dr. Reinaldo & Dra. Paula</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white/90">
                  <Video className="w-4 h-4 cursor-pointer hover:opacity-80" />
                  <Phone className="w-4 h-4 cursor-pointer hover:opacity-80" />
                  <MoreVertical className="w-4 h-4 cursor-pointer hover:opacity-80" />
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-[radial-gradient(#dfd7cb_1px,transparent_1px)] [background-size:16px_16px]">
                {/* Encryption Pill */}
                <div className="flex justify-center">
                  <div className="bg-[#FCF5C7] text-neutral-700 text-[10px] px-3 py-1.5 rounded-lg max-w-[90%] text-center shadow-2xs border border-[#F0E6A5] leading-tight">
                    🔒 As mensagens são protegidas por criptografia e pelo sigilo profissional da OAB/MG (nº 111.989).
                  </div>
                </div>

                {/* Date Pill */}
                <div className="flex justify-center">
                  <span className="bg-white/80 text-neutral-500 text-[9px] px-2.5 py-0.5 rounded-md font-medium shadow-2xs uppercase tracking-wider">
                    Hoje
                  </span>
                </div>

                {/* Conversation Messages */}
                {interactiveMessages.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={idx}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl p-3 text-xs shadow-xs relative leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-[#E7FFDB] text-neutral-900 rounded-tr-none'
                            : 'bg-white text-neutral-900 rounded-tl-none border border-neutral-200/60'
                        }`}
                      >
                        {!isUser && (
                          <div className="text-[10px] font-bold text-red-950 mb-1 flex items-center justify-between">
                            <span>Dr. Reinaldo Dias | RED Advogados</span>
                            <span className="text-[9px] font-normal text-neutral-400">Oficial</span>
                          </div>
                        )}
                        <p className="text-[11.5px]">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-neutral-400">
                          <span>{msg.time}</span>
                          {isUser ? (
                            <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                          ) : (
                            <CheckCheck className="w-3.5 h-3.5 text-neutral-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Interactive Simulated Quick Reply Buttons */}
                {activeStage.id === 2 && !isTyping && (
                  <div className="space-y-1.5 pt-1 pl-1">
                    <div className="bg-white/95 border border-neutral-300 rounded-xl p-2.5 text-[11px] shadow-xs">
                      <p className="font-semibold text-neutral-800 mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-900" />
                        <span>Acesso Rápido à Localização:</span>
                      </p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Avenida+do+Contorno%2C+7174+-+Santo+Ant%C3%B4nio%2C+Belo+Horizonte+-+MG%2C+30110-047"
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-[11px] transition-colors"
                      >
                        Abrir Rota no Google Maps
                      </a>
                    </div>
                  </div>
                )}

                {activeStage.id === 7 && !isTyping && (
                  <div className="space-y-1.5 pt-1 pl-1">
                    <div className="bg-white/95 border border-neutral-300 rounded-xl p-2.5 text-[11px] shadow-xs">
                      <p className="font-semibold text-neutral-800 mb-1.5 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Avaliação no Google Meu Negócio:</span>
                      </p>
                      <button
                        onClick={() =>
                          handleCopy(
                            'https://g.page/r/red-advogados-bh/review',
                            'review-link-copy'
                          )
                        }
                        className="w-full text-center py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-md font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Copiar Link de Avaliação</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-xl py-2 px-3 shadow-xs border border-neutral-200/60 rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Input Footer Mockup */}
              <div className="p-2 bg-[#F0F2F5] flex items-center gap-2 shrink-0 border-t border-neutral-300">
                <button className="text-neutral-500 hover:text-neutral-700 p-1">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="text-neutral-500 hover:text-neutral-700 p-1">
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 bg-white rounded-full px-3.5 py-1.5 text-xs text-neutral-500 border border-neutral-200 flex items-center justify-between">
                  <span className="truncate">Mensagem para Dr. Reinaldo...</span>
                </div>

                <button
                  onClick={() => {
                    setCurrentStageIndex((prev) => (prev + 1) % stagesData.length);
                  }}
                  title="Avançar para o próximo script"
                  className="w-8 h-8 rounded-full bg-[#00A884] hover:bg-[#008f70] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 -rotate-45" />
                </button>
              </div>
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>

      {/* Educational Footer on How to Deploy This to Real WhatsApp */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 shadow-xs">
        <h4 className="font-serif font-bold text-neutral-900 text-sm mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>Como Integrar esses 8 Scripts no seu WhatsApp Real:</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-600 mt-4">
          <div className="p-3.5 bg-white border border-neutral-200 rounded-xl space-y-1.5">
            <strong className="text-neutral-900 block font-semibold">1. WhatsApp Business Gratuito:</strong>
            <p>
              Cadastre as 8 mensagens no menu <em>"Respostas Rápidas"</em> (atalhos como <code className="text-red-950 font-mono">/boasvindas</code>, <code className="text-red-950 font-mono">/confirmacao</code>, <code className="text-red-950 font-mono">/posconsulta</code>) para responder em 3 segundos.
            </p>
          </div>
          <div className="p-3.5 bg-white border border-neutral-200 rounded-xl space-y-1.5">
            <strong className="text-neutral-900 block font-semibold">2. Automação via Webhooks:</strong>
            <p>
              Conecte o formulário da Landing Page a uma ferramenta como Typebot, Evolution API ou Z-API para disparar a mensagem 1 automaticamente quando o lead preencher o contato.
            </p>
          </div>
          <div className="p-3.5 bg-white border border-neutral-200 rounded-xl space-y-1.5">
            <strong className="text-neutral-900 block font-semibold">3. Humanização Contínua:</strong>
            <p>
              A tecnologia serve apenas para garantir agilidade no primeiro toque; toda a condução técnica e análise fática permanece sob a responsabilidade do Dr. Reinaldo e da Dra. Paula.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
