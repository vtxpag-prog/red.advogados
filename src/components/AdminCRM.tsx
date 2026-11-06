import React, { useState, useEffect } from 'react';
import {
  Users,
  Kanban,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  UserPlus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Eye,
  Key,
  MessageSquare,
  Sparkles,
  RefreshCw,
  X,
  GripVertical,
  Move,
  LayoutDashboard,
  BarChart3
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'master_admin' | 'admin' | 'colaborador';
  mustChangePassword?: boolean;
  createdAt: string;
}

interface Note {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Lead {
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

interface SiteSettings {
  avisoBanner: string;
  mostrarAviso: boolean;
  telefonePrincipal: string;
  emailPrincipal: string;
  endereco: string;
  layoutTheme: 'classic' | 'modern' | 'compact';
  permiteCadastroPublico: boolean;
}

const KANBAN_COLUMNS: {
  id: Lead['status'];
  title: string;
  color: string;
  badge: string;
  desc: string;
}[] = [
  {
    id: 'novo',
    title: 'Novos Contatos',
    color: 'border-t-blue-500 bg-blue-50/30',
    badge: 'bg-blue-100 text-blue-900 border-blue-200',
    desc: 'Visitas recentes aguardando primeiro contato'
  },
  {
    id: 'em_atendimento',
    title: 'Em Triagem / Análise',
    color: 'border-t-amber-500 bg-amber-50/30',
    badge: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: 'Caso em estudo fático ou contato preliminar'
  },
  {
    id: 'agendado',
    title: 'Consulta Agendada',
    color: 'border-t-purple-500 bg-purple-50/30',
    badge: 'bg-purple-100 text-purple-900 border-purple-200',
    desc: 'Reunião marcada (Presencial ou Online)'
  },
  {
    id: 'proposta',
    title: 'Proposta / Contrato',
    color: 'border-t-indigo-500 bg-indigo-50/30',
    badge: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    desc: 'Honorários e estratégia apresentados'
  },
  {
    id: 'concluido',
    title: 'Cliente Ativo / Fechado',
    color: 'border-t-emerald-500 bg-emerald-50/30',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    desc: 'Procuração assinada ou causa em andamento'
  },
  {
    id: 'arquivado',
    title: 'Arquivados',
    color: 'border-t-neutral-400 bg-neutral-50/30',
    badge: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    desc: 'Sem viabilidade jurídica ou desistência'
  }
];

export default function AdminCRM() {
  // Auth states
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('red_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('red_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login form
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Force Password Change state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdChangeLoading, setPwdChangeLoading] = useState(false);
  const [pwdChangeError, setPwdChangeError] = useState('');
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState('');

  // Dashboard Subtab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kanban' | 'users' | 'settings'>('dashboard');

  // Leads CRM State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Drag and Drop State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<Lead['status'] | null>(null);

  // New Lead Modal
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newLeadNome, setNewLeadNome] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadCpf, setNewLeadCpf] = useState('');
  const [newLeadTelefone, setNewLeadTelefone] = useState('');
  const [newLeadProcesso, setNewLeadProcesso] = useState('');
  const [newLeadArea, setNewLeadArea] = useState('Direito Administrativo & Servidores Públicos');
  const [newLeadMensagem, setNewLeadMensagem] = useState('');
  const [newLeadStatus, setNewLeadStatus] = useState<Lead['status']>('novo');

  // Users Management State
  const [usersList, setUsersList] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPasswordUser, setNewPasswordUser] = useState('');
  const [newNameUser, setNewNameUser] = useState('');
  const [newRoleUser, setNewRoleUser] = useState<'admin' | 'colaborador'>('colaborador');
  const [userActionMsg, setUserActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Content Settings State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch leads
  const fetchLeads = async () => {
    if (!token) return;
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    if (!token) return;
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/settings/public');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchUsers();
      fetchSettings();
    }
  }, [token]);

  // Check if current user must change password
  useEffect(() => {
    if (currentUser?.mustChangePassword) {
      setShowPasswordChangeModal(true);
    }
  }, [currentUser]);

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('red_token', data.token);
      localStorage.setItem('red_user', JSON.stringify(data.user));

      if (data.user.mustChangePassword) {
        setShowPasswordChangeModal(true);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (_) {}
    }
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('red_token');
    localStorage.removeItem('red_user');
    setSelectedLead(null);
  };

  // Force Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeError('');
    setPwdChangeSuccess('');

    if (newPassword.length < 6) {
      setPwdChangeError('A nova senha deve possuir ao menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdChangeError('A confirmação da senha não coincide.');
      return;
    }

    setPwdChangeLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao alterar senha.');
      }

      setPwdChangeSuccess('Senha alterada com sucesso! Bem-vindo ao painel.');
      if (currentUser) {
        const updated = { ...currentUser, mustChangePassword: false };
        setCurrentUser(updated);
        localStorage.setItem('red_user', JSON.stringify(updated));
      }
      setTimeout(() => {
        setShowPasswordChangeModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setPwdChangeSuccess('');
      }, 1500);
    } catch (err: any) {
      setPwdChangeError(err.message || 'Erro ao alterar senha.');
    } finally {
      setPwdChangeLoading(false);
    }
  };

  // Move Lead Status (Kanban)
  const handleMoveStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updatedLead = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Add Note to Lead
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newNoteText.trim() })
      });

      if (res.ok) {
        const updatedLead = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
        setSelectedLead(updatedLead);
        setNewNoteText('');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Deseja realmente excluir este registro de lead?')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // Create Manual Lead
  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: newLeadNome,
          email: newLeadEmail,
          cpf: newLeadCpf,
          telefone: newLeadTelefone,
          processo: newLeadProcesso,
          area: newLeadArea,
          mensagem: newLeadMensagem,
          status: newLeadStatus
        })
      });

      if (res.ok) {
        const created = await res.json();
        setLeads((prev) => [created, ...prev]);
        setShowNewLeadModal(false);
        setNewLeadNome('');
        setNewLeadEmail('');
        setNewLeadCpf('');
        setNewLeadTelefone('');
        setNewLeadProcesso('');
        setNewLeadMensagem('');
      }
    } catch (err) {
      console.error('Error creating manual lead:', err);
    }
  };

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserActionMsg(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPasswordUser,
          name: newNameUser,
          role: newRoleUser
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar usuário.');
      }

      setUserActionMsg({ type: 'success', text: `Usuário ${data.username} criado com sucesso!` });
      setNewUsername('');
      setNewPasswordUser('');
      setNewNameUser('');
      fetchUsers();
    } catch (err: any) {
      setUserActionMsg({ type: 'error', text: err.message || 'Erro ao criar usuário.' });
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userToDelete: User) => {
    setUserActionMsg(null);
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userToDelete.username}"?`)) return;

    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir usuário.');
      }

      setUserActionMsg({ type: 'success', text: data.message });
      fetchUsers();
    } catch (err: any) {
      setUserActionMsg({ type: 'error', text: err.message || 'Erro ao excluir usuário.' });
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSettingsSaveMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar configurações.');
      }

      setSettings(data.settings);
      setSettingsSaveMsg({ type: 'success', text: 'Configurações atualizadas com sucesso!' });
    } catch (err: any) {
      setSettingsSaveMsg({ type: 'error', text: err.message || 'Erro ao atualizar configurações.' });
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      !searchQuery ||
      l.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.cpf.includes(searchQuery) ||
      l.telefone.includes(searchQuery) ||
      (l.processo && l.processo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesArea = selectedAreaFilter === 'all' || l.area === selectedAreaFilter;
    return matchesSearch && matchesArea;
  });

  // =========================================================================
  // RENDER: NOT LOGGED IN -> LOGIN SCREEN
  // =========================================================================
  if (!token || !currentUser) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-neutral-900">
            Acesso Restrito ao CRM
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Gestão de Visitas & Painel Administrativo — RED Advogados
          </p>
        </div>

        {/* Quick Credentials Info Box */}
        <div className="mb-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2.5">
          <span className="font-bold text-neutral-900 block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Credenciais Configuradas no Sistema:</span>
          </span>
          <div className="grid grid-cols-1 gap-2 pt-1 font-mono text-[11px]">
            <div
              onClick={() => {
                setLoginUser('master_admin');
                setLoginPass('admin3256');
              }}
              className="p-2.5 bg-white rounded-lg border border-neutral-200 hover:border-neutral-400 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-neutral-900 font-bold">
                <span>1. master_admin</span>
                <span className="text-[9px] bg-red-100 text-red-900 px-1.5 py-0.5 rounded font-sans">Poder Total</span>
              </div>
              <p className="text-neutral-500 mt-0.5">Senha: <code className="text-red-950 font-bold">admin3256</code></p>
              <span className="text-[10px] text-neutral-400 font-sans block mt-1">
                (Clique para preencher)
              </span>
            </div>

            <div
              onClick={() => {
                setLoginUser('Reinaldo');
                setLoginPass('mudar1234');
              }}
              className="p-2.5 bg-white rounded-lg border border-neutral-200 hover:border-neutral-400 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-neutral-900 font-bold">
                <span>2. Reinaldo (Dr. Reinaldo)</span>
                <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-sans">Administrador</span>
              </div>
              <p className="text-neutral-500 mt-0.5">Senha inicial: <code className="text-red-950 font-bold">mudar1234</code></p>
              <span className="text-[10px] text-amber-800 font-sans block mt-1">
                ⚠️ Exige troca de senha no 1º login
              </span>
            </div>
          </div>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Usuário:
            </label>
            <input
              type="text"
              required
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              placeholder="Ex: master_admin ou Reinaldo"
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Senha:
            </label>
            <input
              type="password"
              required
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {loginLoading ? <span>Entrando...</span> : <span>Acessar Painel CRM</span>}
          </button>
        </form>
      </div>
    );
  }

  // =========================================================================
  // RENDER: LOGGED IN DASHBOARD
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Forced Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-neutral-900 text-center">
              Troca Obrigatória de Senha
            </h3>
            <p className="text-xs text-neutral-600 text-center mt-1 leading-relaxed">
              Olá, <strong>{currentUser.name}</strong>! Conforme determinado nas diretrizes do escritório, você deve cadastrar sua nova senha definitiva no primeiro acesso.
            </p>

            {pwdChangeError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{pwdChangeError}</span>
              </div>
            )}

            {pwdChangeSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pwdChangeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nova Senha (mínimo 6 dígitos):
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha secreta"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Confirmar Nova Senha:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={pwdChangeLoading}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {pwdChangeLoading ? <span>Salvando...</span> : <span>Salvar Nova Senha & Acessar</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Top Bar with User Info and Subtabs */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950 text-amber-400 font-serif font-bold text-sm flex items-center justify-center shadow-xs">
            {currentUser.username.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-neutral-900">
                {currentUser.name}
              </h3>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  currentUser.role === 'master_admin'
                    ? 'bg-red-100 text-red-900 border border-red-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {currentUser.role === 'master_admin' ? 'Master Admin' : 'Administrador'}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Usuário: <code className="text-neutral-700 font-mono font-semibold">{currentUser.username}</code> · Painel de Gestão e CRM Ativo
            </p>
          </div>
        </div>

        {/* Sub-navigation & Logout */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            <span className="px-1.5 py-0.2 bg-amber-400 text-neutral-900 text-[10px] font-bold rounded-full">
              Métricas
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'kanban'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>CRM & Kanban</span>
            <span className="px-1.5 py-0.2 bg-white/20 text-white text-[10px] rounded-full">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Usuários</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Conteúdo & Layout</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
            title="Sair do Sistema"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 0: DASHBOARD MÉTRICAS (RECHARTS) */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <AdminDashboard
          leads={leads}
          onGoToKanban={() => {
            setActiveTab('kanban');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 1: KANBAN CRM */}
      {/* ========================================================================= */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filter, Refresh, Add */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por Nome, CPF, Telefone ou Nº do Processo..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <select
                value={selectedAreaFilter}
                onChange={(e) => setSelectedAreaFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-700 max-w-xs truncate"
              >
                <option value="all">Todas as Áreas</option>
                <option value="Direito Administrativo & Servidores Públicos">Direito Administrativo</option>
                <option value="Direito Cível, Indenizações & Contratos">Direito Cível & Contratos</option>
                <option value="Direito Empresarial & Gestão de Riscos">Direito Empresarial</option>
                <option value="Direito da Cultura & Editais">Direito da Cultura</option>
                <option value="Parcerias Público-Privadas (PPP)">Parcerias Público-Privadas</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchLeads}
                className="p-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-xl transition-colors"
                title="Atualizar Lista"
              >
                <RefreshCw className={`w-4 h-4 ${leadsLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setShowNewLeadModal(true)}
                className="px-3.5 py-2 bg-red-950 hover:bg-red-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Novo Lead Manual</span>
              </button>
            </div>
          </div>

          {/* Drag and Drop Instruction Banner */}
          <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/90 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                <Move className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span>
                <strong>Mude de etapa arrastando o mouse:</strong> Clique, segure e arraste qualquer card para a coluna desejada para atualizar o status instantaneamente.
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 shrink-0 font-medium hidden sm:inline">
              🖱️ Suporte a Drag & Drop Ativo
            </span>
          </div>

          {/* Kanban Board Container (Horizontal Scroll on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const columnLeads = filteredLeads.filter((l) => l.status === col.id);
              const isDragOver = dragOverColumnId === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverColumnId !== col.id) {
                      setDragOverColumnId(col.id);
                    }
                  }}
                  onDragLeave={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setDragOverColumnId(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
                    if (leadId) {
                      handleMoveStatus(leadId, col.id);
                    }
                    setDraggedLeadId(null);
                    setDragOverColumnId(null);
                  }}
                  className={`rounded-2xl border border-t-4 p-3 flex flex-col min-w-[250px] lg:min-w-0 transition-all ${
                    isDragOver
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-50/80 shadow-md scale-[1.01]'
                      : `border-neutral-200 ${col.color}`
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif font-bold text-xs text-neutral-900 line-clamp-1">
                      {col.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {columnLeads.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mb-3 line-clamp-1 leading-tight">
                    {col.desc}
                  </p>

                  {/* Drop zone placeholder when dragging over column */}
                  {isDragOver && (
                    <div className="p-3 mb-2.5 border-2 border-dashed border-emerald-500 bg-emerald-100/70 rounded-xl text-center text-[11px] font-bold text-emerald-950 animate-pulse flex items-center justify-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Solte aqui para mover para "{col.title}"</span>
                    </div>
                  )}

                  {/* Cards inside column */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[600px] pr-0.5">
                    {columnLeads.length === 0 && !isDragOver ? (
                      <div className="p-4 border border-dashed border-neutral-200 rounded-xl text-center text-[11px] text-neutral-400">
                        Nenhum registro
                      </div>
                    ) : (
                      columnLeads.map((lead) => {
                        const isBeingDragged = draggedLeadId === lead.id;

                        return (
                          <div
                            key={lead.id}
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', lead.id);
                              e.dataTransfer.effectAllowed = 'move';
                              setDraggedLeadId(lead.id);
                            }}
                            onDragEnd={() => {
                              setDraggedLeadId(null);
                              setDragOverColumnId(null);
                            }}
                            onClick={() => setSelectedLead(lead)}
                            className={`bg-white border rounded-xl p-3 shadow-2xs hover:shadow-xs transition-all space-y-2 relative group select-none cursor-grab active:cursor-grabbing ${
                              isBeingDragged
                                ? 'opacity-40 border-dashed border-amber-500 ring-2 ring-amber-300 scale-95'
                                : 'border-neutral-200 hover:border-neutral-400 hover:scale-[1.01]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-xs text-neutral-900 line-clamp-1">
                                {lead.nome}
                              </span>
                              <span title="Clique e segure para arrastar">
                                <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 shrink-0 cursor-grab" />
                              </span>
                            </div>

                            <div className="space-y-1 text-[11px] text-neutral-600">
                              <div className="flex items-center gap-1.5 truncate">
                                <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{lead.telefone}</span>
                              </div>

                              <div className="flex items-center gap-1.5 truncate">
                                <FileText className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span className="truncate">CPF: {lead.cpf}</span>
                              </div>

                              {lead.processo && (
                                <div className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-mono text-neutral-700 truncate">
                                  Proc: {lead.processo}
                                </div>
                              )}
                            </div>

                            <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                              <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                              {lead.notes.length > 0 && (
                                <span className="flex items-center gap-0.5 text-neutral-500 font-medium">
                                  <MessageSquare className="w-3 h-3" />
                                  {lead.notes.length}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: USERS MANAGEMENT (RBAC) */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-sm">Diretrizes de Acesso & Hierarquia (RBAC):</strong>
              <p className="mt-1 leading-relaxed">
                • <strong>master_admin:</strong> Permissão irrestrita. Não pode ser excluído por ninguém.<br />
                • <strong>Reinaldo:</strong> Possui poderes administrativos e pode criar novos usuários. <em>Não tem permissão para alterar o layout do site e não pode excluir o Master Admin.</em>
              </p>
            </div>
          </div>

          {userActionMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                userActionMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {userActionMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{userActionMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Create User Card (Left - 5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <h4 className="font-serif font-bold text-base text-neutral-900 mb-1 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-red-950" />
                <span>Criar Novo Usuário</span>
              </h4>
              <p className="text-xs text-neutral-600 mb-4">
                Cadastre advogados associados ou colaboradores para acompanhamento do CRM.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    required
                    value={newNameUser}
                    onChange={(e) => setNewNameUser(e.target.value)}
                    placeholder="Ex: Dra. Paula Mattos"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Login / Usuário:
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Ex: paula_mattos"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Senha Provisória:
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasswordUser}
                    onChange={(e) => setNewPasswordUser(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nível de Acesso (Cargo):
                  </label>
                  <select
                    value={newRoleUser}
                    onChange={(e) => setNewRoleUser(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-800"
                  >
                    <option value="colaborador">Colaborador / Triagem (Acesso ao CRM)</option>
                    <option value="admin">Administrador (Gestão de CRM e Conteúdos)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Cadastrar Usuário</span>
                </button>
              </form>
            </div>

            {/* Users List (Right - 7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif font-bold text-base text-neutral-900">
                  Usuários Cadastrados ({usersList.length})
                </h4>
                <button
                  onClick={fetchUsers}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500"
                  title="Atualizar Lista"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {usersList.map((user) => {
                  const isMaster = user.username === 'master_admin';
                  const isCurrent = user.id === currentUser.id;

                  return (
                    <div key={user.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-neutral-900">{user.name}</strong>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              user.role === 'master_admin'
                                ? 'bg-red-100 text-red-900'
                                : user.role === 'admin'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {user.role}
                          </span>
                          {user.mustChangePassword && (
                            <span className="text-[9px] bg-yellow-100 text-yellow-900 px-1 py-0.2 rounded font-semibold">
                              Troca pendente
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Login: <code className="font-mono text-neutral-700">{user.username}</code>
                        </p>
                      </div>

                      <div>
                        {isMaster ? (
                          <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-1 rounded-md font-medium cursor-not-allowed">
                            🔒 Protegido
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[10px] text-neutral-400 px-2 py-1">Sua Conta</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: SETTINGS & CONTENT */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {settingsSaveMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                settingsSaveMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {settingsSaveMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{settingsSaveMsg.text}</span>
            </div>
          )}

          {settings && (
            <form onSubmit={handleSaveSettings} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div>
                <h4 className="font-serif font-bold text-lg text-neutral-900">
                  Administração de Conteúdos & Contatos do Site
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Atualize avisos públicos, dados de contato e políticas exibidas aos visitantes.
                </p>
              </div>

              {/* Aviso Banner */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800">
                    Mensagem de Aviso do Topo (Banner):
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.mostrarAviso}
                      onChange={(e) =>
                        setSettings({ ...settings, mostrarAviso: e.target.checked })
                      }
                      className="rounded text-red-950 focus:ring-red-900"
                    />
                    <span>Exibir no site</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={settings.avisoBanner}
                  onChange={(e) =>
                    setSettings({ ...settings, avisoBanner: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {/* Contatos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Telefone / WhatsApp Principal:
                  </label>
                  <input
                    type="text"
                    value={settings.telefonePrincipal}
                    onChange={(e) =>
                      setSettings({ ...settings, telefonePrincipal: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    E-mail Institucional:
                  </label>
                  <input
                    type="email"
                    value={settings.emailPrincipal}
                    onChange={(e) =>
                      setSettings({ ...settings, emailPrincipal: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Endereço Oficial Sede:
                </label>
                <input
                  type="text"
                  value={settings.endereco}
                  onChange={(e) =>
                    setSettings({ ...settings, endereco: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {/* Layout Theme Control - RESTRICTED TO MASTER_ADMIN */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-red-950" />
                    <span>Personalização de Layout do Site</span>
                  </span>
                  {currentUser.role !== 'master_admin' && (
                    <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                      🔒 Restrito ao Master Admin
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {currentUser.role === 'master_admin'
                    ? 'Você possui privilégio de Master Admin para alternar o estilo e tema geral do layout da presença digital.'
                    : 'Regra de negócio: O administrador Reinaldo não possui permissão para modificar a estrutura e o layout geral do site.'}
                </p>

                <select
                  disabled={currentUser.role !== 'master_admin'}
                  value={settings.layoutTheme}
                  onChange={(e) =>
                    setSettings({ ...settings, layoutTheme: e.target.value as any })
                  }
                  className={`w-full px-3 py-2 text-xs border rounded-xl ${
                    currentUser.role === 'master_admin'
                      ? 'bg-white border-neutral-300 cursor-pointer'
                      : 'bg-neutral-100 border-neutral-200 cursor-not-allowed text-neutral-400'
                  }`}
                >
                  <option value="classic">Layout Clássico Jurídico (Vinho e Dourado Institucional)</option>
                  <option value="modern">Layout Moderno Boutique (Tipografia Alta Visibilidade)</option>
                  <option value="compact">Layout Compacto Executivo</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Salvar Alterações de Conteúdo
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEAD DETAIL MODAL / DRAWER */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-neutral-900 text-white p-5 rounded-t-3xl flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Registro de Visita & Lead #{selectedLead.id}
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {selectedLead.nome}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://wa.me/55${selectedLead.telefone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(
                    selectedLead.nome
                  )},%20sou%20o%20Dr.%20Reinaldo%20Dias%20da%20RED%20Advogados.%20Recebi%20seu%20contato%20no%20nosso%20site.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chamar no WhatsApp</span>
                </a>

                <a
                  href={`mailto:${selectedLead.email}?subject=RED%20Advogados%20-%20Atendimento%20ao%20seu%20caso`}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enviar E-mail</span>
                </a>

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-semibold">Mover p/:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleMoveStatus(selectedLead.id, e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-semibold"
                  >
                    {KANBAN_COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">CPF</span>
                  <strong className="text-neutral-900 font-mono text-sm">{selectedLead.cpf}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Telefone</span>
                  <strong className="text-neutral-900 font-mono text-sm">{selectedLead.telefone}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">E-mail</span>
                  <span className="text-neutral-800 break-all">{selectedLead.email}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Nº Processo</span>
                  <span className="text-neutral-800 font-mono">
                    {selectedLead.processo || <em className="text-neutral-400">Não informado</em>}
                  </span>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-neutral-200/80">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Área de Interesse</span>
                  <span className="text-red-950 font-semibold text-xs">{selectedLead.area}</span>
                </div>

                {selectedLead.mensagem && (
                  <div className="sm:col-span-2 pt-2 border-t border-neutral-200/80">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Relato do Cliente</span>
                    <p className="text-neutral-700 leading-relaxed italic mt-0.5">
                      "{selectedLead.mensagem}"
                    </p>
                  </div>
                )}
              </div>

              {/* Notes Timeline */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-neutral-500" />
                  <span>Histórico & Notas Internas de Atendimento</span>
                </h4>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Adicionar nota interna (ex: Liguei e combinamos reunião para sexta)..."
                    className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Adicionar
                  </button>
                </form>

                <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
                  {selectedLead.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <strong className="text-neutral-700 font-semibold">{note.author}</strong>
                        <span>{new Date(note.createdAt).toLocaleString('pt-BR')}</span>
                      </div>
                      <p className="text-neutral-800 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                <button
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Lead</span>
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEW LEAD MANUAL MODAL */}
      {/* ========================================================================= */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                Cadastrar Lead Manual no CRM
              </h3>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadNome}
                  onChange={(e) => setNewLeadNome(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadCpf}
                    onChange={(e) => setNewLeadCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadTelefone}
                    onChange={(e) => setNewLeadTelefone(e.target.value)}
                    placeholder="(31) 90000-0000"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Nº do Processo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newLeadProcesso}
                    onChange={(e) => setNewLeadProcesso(e.target.value)}
                    placeholder="Ex: 5014829-12.2024"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Área de Interesse
                </label>
                <select
                  value={newLeadArea}
                  onChange={(e) => setNewLeadArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-800"
                >
                  <option value="Direito Administrativo & Servidores Públicos">Direito Administrativo & Servidores</option>
                  <option value="Direito Cível, Indenizações & Contratos">Direito Cível & Contratos</option>
                  <option value="Direito Empresarial & Gestão de Riscos">Direito Empresarial</option>
                  <option value="Direito da Cultura & Editais">Direito da Cultura</option>
                  <option value="Parcerias Público-Privadas (PPP)">Parcerias Público-Privadas</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Coluna Inicial do Kanban
                </label>
                <select
                  value={newLeadStatus}
                  onChange={(e) => setNewLeadStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-800"
                >
                  {KANBAN_COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Resumo do Caso
                </label>
                <textarea
                  rows={2}
                  value={newLeadMensagem}
                  onChange={(e) => setNewLeadMensagem(e.target.value)}
                  placeholder="Anotações preliminares do atendimento..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Salvar no Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
