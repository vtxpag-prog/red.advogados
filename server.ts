import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent database path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface User {
  id: string;
  username: string;
  passwordHash: string; // Plaintext or hashed for this applet
  name: string;
  role: 'master_admin' | 'admin' | 'colaborador';
  mustChangePassword?: boolean;
  cpf?: string;
  oab?: string;
  temporaryPassword?: string;
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
  updatedAt: string;
  updatedBy: string;
}

interface DatabaseSchema {
  users: User[];
  leads: Lead[];
  settings: SiteSettings;
  sessions: { [token: string]: { userId: string; createdAt: number } };
}

// Initial seed
function getInitialData(): DatabaseSchema {
  return {
    users: [
      {
        id: 'usr-master-001',
        username: 'master_admin',
        passwordHash: 'admin3256',
        name: 'Master Admin (Diretoria Técnica)',
        role: 'master_admin',
        mustChangePassword: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-reinaldo-002',
        username: 'Reinaldo',
        passwordHash: 'mudar1234',
        name: 'Dr. Reinaldo Eustáquio Dias',
        role: 'admin',
        mustChangePassword: true, // DEVERÁ MUDAR A SENHA NO PRIMEIRO LOGIN
        oab: '111.989',
        cpf: '111.989.000-00',
        temporaryPassword: 'mudar1234',
        createdAt: new Date().toISOString()
      }
    ],
    leads: [
      {
        id: 'lead-001',
        nome: 'Marcos Vinicius de Souza',
        email: 'marcos.souza@gmail.com',
        cpf: '089.452.126-30',
        telefone: '(31) 99874-5521',
        processo: '5014829-12.2024.8.13.0024',
        area: 'Direito Administrativo & Servidores Públicos',
        mensagem: 'Fui notificado com abertura de sindicância administrativa no meu órgão estadual. Preciso de auxílio urgente.',
        status: 'novo',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        notes: [
          {
            id: 'n-1',
            author: 'Sistema',
            text: 'Lead recebido através da Caixa de Coleta do Site.',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
          }
        ],
        source: 'Formulário do Site'
      },
      {
        id: 'lead-002',
        nome: 'Camila Fernandes Costa',
        email: 'camila.costa@empresa.com.br',
        cpf: '124.632.786-90',
        telefone: '(31) 98711-4030',
        processo: '',
        area: 'Direito Empresarial & Gestão de Riscos',
        mensagem: 'Queremos revisar nossos contratos de prestação de serviços e evitar passivos trabalhistas/cíveis.',
        status: 'em_atendimento',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        notes: [
          {
            id: 'n-2',
            author: 'Reinaldo',
            text: 'Entrei em contato pelo WhatsApp. Cliente solicitou proposta de diagnóstico preventivo.',
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
          }
        ],
        source: 'Formulário do Site'
      },
      {
        id: 'lead-003',
        nome: 'Prof. Sérgio Augusto Moreira',
        email: 'sergio.moreira@educacao.mg.gov.br',
        cpf: '045.789.321-15',
        telefone: '(31) 99120-8844',
        processo: '0024.19.854.120-1',
        area: 'Direito Administrativo & Servidores Públicos',
        mensagem: 'Cálculo de quinquênios e férias-prêmio represadas após aposentadoria.',
        status: 'agendado',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        notes: [
          {
            id: 'n-3',
            author: 'Reinaldo',
            text: 'Reunião confirmada no escritório presencial (Av. do Contorno, 7174) para amanhã às 15h.',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        source: 'Formulário do Site'
      },
      {
        id: 'lead-004',
        nome: 'Juliana Beatriz de Castro',
        email: 'juliana.castro.arte@gmail.com',
        cpf: '741.852.963-00',
        telefone: '(31) 98455-7090',
        processo: '',
        area: 'Direito da Cultura & Editais',
        mensagem: 'Dúvidas na prestação de contas de edital estadual da Lei Paulo Gustavo.',
        status: 'proposta',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: [
          {
            id: 'n-4',
            author: 'Reinaldo',
            text: 'Minuta de contrato de assessoria jurídica enviada para assinatura.',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
          }
        ],
        source: 'Simulador WhatsApp'
      },
      {
        id: 'lead-005',
        nome: 'Eduardo Martins Peixoto',
        email: 'edu.martins@yahoo.com.br',
        cpf: '556.889.123-44',
        telefone: '(31) 99763-1200',
        processo: '5003412-44.2023.8.13.0024',
        area: 'Direito Cível, Indenizações & Contratos',
        mensagem: 'Ação indenizatória julgada procedente. Alvará expedido com sucesso.',
        status: 'concluido',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        notes: [
          {
            id: 'n-5',
            author: 'Reinaldo',
            text: 'Prestação de contas efetuada. Cliente extremamente satisfeito.',
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
          }
        ],
        source: 'Indicação'
      }
    ],
    settings: {
      avisoBanner: 'Atendimento presencial na Av. do Contorno, 7174 (Santo Antônio) ou por videoconferência com os titulares.',
      mostrarAviso: true,
      telefonePrincipal: '(31) 98334-7116',
      emailPrincipal: 'reinaldodias.advogado@gmail.com',
      endereco: 'Avenida do Contorno, 7174 — Sala 09 — Santo Antônio — Belo Horizonte/MG — CEP 30110-047',
      layoutTheme: 'classic',
      permiteCadastroPublico: true,
      updatedAt: new Date().toISOString(),
      updatedBy: 'master_admin'
    },
    sessions: {}
  };
}

// Database helper functions
function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return getInitialData();
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// Token session helper
function generateToken(): string {
  return 'tkn_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Authentication Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token ausente.' });
  }

  const token = authHeader.split(' ')[1];
  const db = readDb();
  const session = db.sessions[token];

  if (!session) {
    return res.status(401).json({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Usuário não encontrado.' });
  }

  (req as any).user = user;
  (req as any).token = token;
  next();
}

// ==========================================
// API ROUTES
// ==========================================

// 1. PUBLIC: Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 2. PUBLIC: Visitor Data Capture (Caixa de Visita)
// Mandatory: nome, email, cpf, telefone
// Optional: processo
app.post('/api/leads/public', (req: Request, res: Response) => {
  const { nome, email, cpf, telefone, processo, area, mensagem } = req.body;

  // Validation of mandatory fields
  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'O campo Nome Completo é obrigatório.' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'O campo E-mail é obrigatório e deve ser válido.' });
  }
  if (!cpf || typeof cpf !== 'string' || cpf.trim().length < 11) {
    return res.status(400).json({ error: 'O campo CPF é obrigatório.' });
  }
  if (!telefone || typeof telefone !== 'string' || telefone.trim().length < 8) {
    return res.status(400).json({ error: 'O campo Telefone/WhatsApp é obrigatório.' });
  }

  const db = readDb();
  const newLead: Lead = {
    id: 'lead-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    cpf: cpf.trim(),
    telefone: telefone.trim(),
    processo: processo ? String(processo).trim() : '',
    area: area || 'Direito Administrativo & Servidores Públicos',
    mensagem: mensagem ? String(mensagem).trim() : '',
    status: 'novo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [
      {
        id: 'note-' + Date.now(),
        author: 'Sistema Web',
        text: 'Visita e solicitação de atendimento registradas pelo formulário do site.',
        createdAt: new Date().toISOString()
      }
    ],
    source: 'Caixa de Coleta de Visita (Site)'
  };

  db.leads.unshift(newLead);
  writeDb(db);

  return res.status(201).json({
    success: true,
    message: 'Seus dados foram recebidos com total sigilo. Entraremos em contato com brevidade!',
    leadId: newLead.id
  });
});

// 3. PUBLIC: Get Site Content / Settings
app.get('/api/settings/public', (_req, res) => {
  const db = readDb();
  res.json(db.settings);
});

// 3.5. PUBLIC: Get users pending first access (EXCLUDES master_admin completely!)
app.get('/api/auth/pending-first-access', (_req, res) => {
  const db = readDb();
  // EXCLUDE master_admin, ONLY return users where mustChangePassword === true
  const pending = db.users
    .filter(
      (u) =>
        u.mustChangePassword === true &&
        u.role !== 'master_admin' &&
        u.username.toLowerCase() !== 'master_admin'
    )
    .map((u) => ({
      username: u.username,
      name: u.name,
      role: u.role,
      temporaryPassword: u.temporaryPassword || u.passwordHash,
      hasCpf: !!u.cpf,
      hasOab: !!u.oab
    }));
  return res.json(pending);
});

// 4. AUTH: Login (Requires CPF or OAB verification strictly on first login)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password, cpfOrOab } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha.' });
  }

  const db = readDb();
  const user = db.users.find(
    (u) => u.username.toLowerCase() === String(username).trim().toLowerCase()
  );

  if (!user || user.passwordHash !== String(password)) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
  }

  // FIRST LOGIN REQUIREMENT:
  // If the user has mustChangePassword === true, we require CPF or OAB confirmation!
  if (user.mustChangePassword) {
    if (!cpfOrOab || typeof cpfOrOab !== 'string' || cpfOrOab.trim().length === 0) {
      // Prompt client to open CPF/OAB confirmation modal
      return res.status(200).json({
        requireFirstLoginVerification: true,
        username: user.username,
        name: user.name,
        role: user.role,
        message: 'Primeiro acesso detectado. Para sua segurança e conformidade, confirme seu CPF ou número da OAB cadastrado.'
      });
    }

    // Validate provided cpfOrOab
    const cleanProvided = String(cpfOrOab).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const cleanCpf = (user.cpf || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const cleanOab = (user.oab || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    const matchesCpf = cleanCpf && (cleanProvided === cleanCpf || cleanCpf.includes(cleanProvided) || cleanProvided.includes(cleanCpf));
    const matchesOab = cleanOab && (cleanProvided === cleanOab || cleanOab.includes(cleanProvided) || cleanProvided.includes(cleanOab));

    if (!matchesCpf && !matchesOab) {
      return res.status(400).json({
        error: 'CPF ou número de inscrição na OAB não confere com o cadastro deste usuário. Verifique e tente novamente.'
      });
    }
  }

  // Session token creation
  const token = generateToken();
  db.sessions[token] = {
    userId: user.id,
    createdAt: Date.now()
  };
  writeDb(db);

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      mustChangePassword: !!user.mustChangePassword
    }
  });
});

// 5. AUTH: Change Password (Required on first login, clears mustChangePassword & temporaryPassword)
app.post('/api/auth/change-password', authMiddleware, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const currentUser = (req as any).user as User;

  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
    return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
  }

  const db = readDb();
  const userIndex = db.users.findIndex((u) => u.id === currentUser.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  db.users[userIndex].passwordHash = newPassword.trim();
  db.users[userIndex].mustChangePassword = false;
  delete db.users[userIndex].temporaryPassword;
  writeDb(db);

  return res.json({
    success: true,
    message: 'Senha alterada com sucesso! Você já pode utilizar todas as ferramentas do painel.'
  });
});

// 6. AUTH: Current Session info
app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  return res.json({
    id: currentUser.id,
    username: currentUser.username,
    name: currentUser.name,
    role: currentUser.role,
    mustChangePassword: !!currentUser.mustChangePassword
  });
});

// 7. AUTH: Logout
app.post('/api/auth/logout', authMiddleware, (req: Request, res: Response) => {
  const token = (req as any).token as string;
  const db = readDb();
  delete db.sessions[token];
  writeDb(db);
  return res.json({ success: true, message: 'Sessão encerrada com sucesso.' });
});

// ==========================================
// CRM LEADS / VISITAS MANAGEMENT (PROTECTED)
// ==========================================

// List Leads with optional status or search filter
app.get('/api/leads', authMiddleware, (req: Request, res: Response) => {
  const db = readDb();
  const { status, search } = req.query;

  let filtered = [...db.leads];

  if (status && typeof status === 'string' && status !== 'all') {
    filtered = filtered.filter((l) => l.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.nome.toLowerCase().includes(q) ||
        l.cpf.includes(q) ||
        l.telefone.includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.processo && l.processo.toLowerCase().includes(q))
    );
  }

  return res.json(filtered);
});

// Create Lead manually from CRM dashboard
app.post('/api/leads', authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const { nome, email, cpf, telefone, processo, area, mensagem, status } = req.body;

  if (!nome || !email || !cpf || !telefone) {
    return res.status(400).json({ error: 'Nome, E-mail, CPF e Telefone são campos obrigatórios.' });
  }

  const db = readDb();
  const newLead: Lead = {
    id: 'lead-' + Date.now().toString(36),
    nome: String(nome).trim(),
    email: String(email).trim().toLowerCase(),
    cpf: String(cpf).trim(),
    telefone: String(telefone).trim(),
    processo: processo ? String(processo).trim() : '',
    area: area || 'Direito Administrativo & Servidores Públicos',
    mensagem: mensagem ? String(mensagem).trim() : '',
    status: status || 'novo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [
      {
        id: 'note-' + Date.now(),
        author: currentUser.name,
        text: 'Lead cadastrado manualmente no CRM pelo painel administrativo.',
        createdAt: new Date().toISOString()
      }
    ],
    source: 'Cadastro Manual CRM'
  };

  db.leads.unshift(newLead);
  writeDb(db);

  return res.status(201).json(newLead);
});

// Update Lead Status (Kanban drag-and-drop or column switch)
app.patch('/api/leads/:id/status', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const currentUser = (req as any).user as User;

  const validStatuses = ['novo', 'em_atendimento', 'agendado', 'proposta', 'concluido', 'arquivado'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status de Kanban inválido.' });
  }

  const db = readDb();
  const lead = db.leads.find((l) => l.id === id);

  if (!lead) {
    return res.status(404).json({ error: 'Lead não encontrado.' });
  }

  const oldStatus = lead.status;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  lead.notes.unshift({
    id: 'n-' + Date.now(),
    author: currentUser.name,
    text: `Status alterado de "${oldStatus}" para "${status}".`,
    createdAt: new Date().toISOString()
  });

  writeDb(db);
  return res.json(lead);
});

// Add Internal Note to Lead
app.post('/api/leads/:id/notes', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const currentUser = (req as any).user as User;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'O texto da nota não pode ser vazio.' });
  }

  const db = readDb();
  const lead = db.leads.find((l) => l.id === id);

  if (!lead) {
    return res.status(404).json({ error: 'Lead não encontrado.' });
  }

  const note: Note = {
    id: 'note-' + Date.now(),
    author: currentUser.name,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  lead.notes.unshift(note);
  lead.updatedAt = new Date().toISOString();
  writeDb(db);

  return res.status(201).json(lead);
});

// Delete Lead
app.delete('/api/leads/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.leads.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead não encontrado.' });
  }

  db.leads.splice(index, 1);
  writeDb(db);
  return res.json({ success: true, message: 'Lead excluído com sucesso.' });
});

// ==========================================
// USER MANAGEMENT (RBAC)
// ==========================================

// List Users
app.get('/api/users', authMiddleware, (req: Request, res: Response) => {
  const db = readDb();
  // Return users without passwordHash
  const safeUsers = db.users.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    mustChangePassword: !!u.mustChangePassword,
    createdAt: u.createdAt
  }));
  return res.json(safeUsers);
});

// Create User (Both master_admin and Reinaldo can create users!)
app.post('/api/users', authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const { username, password, name, role, cpf, oab } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Usuário, senha e nome são obrigatórios.' });
  }

  // Reinaldo cannot create master_admin users; only master_admin can create master_admin
  if (role === 'master_admin' && currentUser.role !== 'master_admin') {
    return res.status(403).json({ error: 'Apenas o Master Admin pode criar outro usuário Master Admin.' });
  }

  const db = readDb();
  const existing = db.users.find((u) => u.username.toLowerCase() === String(username).trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Nome de usuário já existe.' });
  }

  const newUser: User = {
    id: 'usr-' + Date.now().toString(36),
    username: String(username).trim(),
    passwordHash: String(password).trim(),
    name: String(name).trim(),
    role: role || 'colaborador',
    mustChangePassword: true, // Novos usuários precisam confirmar identidade e trocar a senha no 1º acesso!
    temporaryPassword: String(password).trim(),
    cpf: cpf ? String(cpf).trim() : undefined,
    oab: oab ? String(oab).trim() : undefined,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  return res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    role: newUser.role,
    mustChangePassword: true,
    cpf: newUser.cpf,
    oab: newUser.oab,
    createdAt: newUser.createdAt
  });
});

// Delete User (ENFORCE RULE: Reinaldo cannot delete master_admin. master_admin cannot be deleted.)
app.delete('/api/users/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = (req as any).user as User;
  const db = readDb();

  const targetUser = db.users.find((u) => u.id === id);
  if (!targetUser) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Rule 1: master_admin user CANNOT be deleted by anyone!
  if (targetUser.username === 'master_admin' || targetUser.role === 'master_admin') {
    return res.status(403).json({
      error: 'Operação proibida: O usuário master_admin possui proteção permanente e não pode ser excluído.'
    });
  }

  // Rule 2: Cannot delete self
  if (targetUser.id === currentUser.id) {
    return res.status(400).json({ error: 'Você não pode excluir sua própria conta.' });
  }

  db.users = db.users.filter((u) => u.id !== id);
  writeDb(db);

  return res.json({ success: true, message: `Usuário ${targetUser.username} excluído com sucesso.` });
});

// ==========================================
// CONTENT & SETTINGS MANAGEMENT
// ==========================================

// Update Settings
// RULE: Reinaldo can update announcements, phone and email, BUT CANNOT CHANGE LAYOUT.
// Only master_admin can change layout!
app.put('/api/settings', authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const { avisoBanner, mostrarAviso, telefonePrincipal, emailPrincipal, endereco, layoutTheme } = req.body;

  const db = readDb();

  // Check layout alteration restriction
  if (layoutTheme && layoutTheme !== db.settings.layoutTheme && currentUser.role !== 'master_admin') {
    return res.status(403).json({
      error: 'Permissão negada: Somente o usuário Master Admin possui permissão para alterar o layout do site.'
    });
  }

  db.settings = {
    ...db.settings,
    avisoBanner: avisoBanner !== undefined ? String(avisoBanner) : db.settings.avisoBanner,
    mostrarAviso: mostrarAviso !== undefined ? Boolean(mostrarAviso) : db.settings.mostrarAviso,
    telefonePrincipal: telefonePrincipal !== undefined ? String(telefonePrincipal) : db.settings.telefonePrincipal,
    emailPrincipal: emailPrincipal !== undefined ? String(emailPrincipal) : db.settings.emailPrincipal,
    endereco: endereco !== undefined ? String(endereco) : db.settings.endereco,
    layoutTheme: currentUser.role === 'master_admin' && layoutTheme ? layoutTheme : db.settings.layoutTheme,
    updatedAt: new Date().toISOString(),
    updatedBy: currentUser.username
  };

  writeDb(db);
  return res.json({ success: true, settings: db.settings });
});

// ==========================================
// STATIC ASSETS & VITE INTEGRATION
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RED Advogados] Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
