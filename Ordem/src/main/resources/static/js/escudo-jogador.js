'use strict';
/* Ordem Up — Escudo do Jogador
   Integração: GET/PUT /api/personagem/personagens, catálogo de perícias, itens, habilidades e rituais.
   PV/PE/SAN são compartilhados pelo PostgreSQL; condições, notas e rolagens continuam locais.
   ?demo=1 abre uma demonstração isolada, sem modificar o banco de dados. */

const $ = id => document.getElementById(id);
const demo = new URLSearchParams(window.location.search).has('demo') || document.documentElement.dataset.demo === 'true';
const RESOURCES = ['pv', 'pe', 'san'];
const ATTRS = [
  { key: 'forca', short: 'FOR', name: 'FORÇA' },
  { key: 'destreza', short: 'DES', name: 'DESTREZA' },
  { key: 'inteligencia', short: 'INT', name: 'INTELIGÊNCIA' },
  { key: 'vontade', short: 'VON', name: 'VONTADE' },
  { key: 'fortitude', short: 'FRT', name: 'FORTITUDE' }
];
const CONDITIONS = ['Abalado', 'Caído', 'Cego', 'Enjoado', 'Exausto', 'Ferido', 'Lento', 'Machucado', 'Paralisado', 'Sangrando'];
const ABILITY_CONFIG = {
  trilha: { endpoint: 'trilha', select: 'trilha-select', list: 'ability-trilhas', catalog: 'trilhas', dataKey: 'trilhas', count: 'count-trilhas', name: 'trilhaPersonagem', desc: 'descTrilhaPersonagem' },
  classe: { endpoint: 'poderes', select: 'classe-select', list: 'ability-classe', catalog: 'poderes', dataKey: 'poderesClasse', count: 'count-classe', name: 'nomePoderPersonagem', desc: 'poderPersonagem' },
  paranormais: { endpoint: 'poderes-paranormais', select: 'paranormal-select', list: 'ability-paranormais', catalog: 'paranormais', dataKey: 'poderesParanormais', count: 'count-paranormais', name: 'nomePoderParanormal', desc: 'descPoderParanormal' }
};
let personagens = [];
let personagem = null;
let skills = new Map(); // IDs => valores; contém perícias previamente cadastradas e as alteradas
let skillsDirty = false;
let dirty = false;
let items = [];
let abilities = { trilhas: [], poderesClasse: [], poderesParanormais: [] };
let catalogs = { pericias: [], itens: [], trilhas: [], poderes: [], paranormais: [], rituais: [] };
let session = null;
// Escritas são enfileiradas por recurso para evitar reverter cliques rápidos.
const resourceQueues = new Map();
let lastRoll = null;
let isLoadingCharacter = false;
let toastTimeout;

const demoData = {
  personagens: [
    { id: 7, nome: 'Santiago Vilar', nomeJogador: 'Jogador 01', nivel: 5, forca: 3, destreza: 2, inteligencia: 3, vontade: 2, fortitude: 1, pericias: [
      { pericia: { id: 1, pericia: 'Investigação' }, valorPericia: 10 },
      { pericia: { id: 2, pericia: 'Luta' }, valorPericia: 5 },
      { pericia: { id: 3, pericia: 'Percepção' }, valorPericia: 10 },
      { pericia: { id: 4, pericia: 'Ocultismo' }, valorPericia: 5 },
      { pericia: { id: 5, pericia: 'Pontaria' }, valorPericia: 0 }
    ] },
    { id: 12, nome: 'Sara Dominique', nomeJogador: 'Jogador 02', nivel: 3, forca: 1, destreza: 3, inteligencia: 4, vontade: 2, fortitude: 1, pericias: [
      { pericia: { id: 1, pericia: 'Investigação' }, valorPericia: 5 },
      { pericia: { id: 4, pericia: 'Ocultismo' }, valorPericia: 10 },
      { pericia: { id: 6, pericia: 'Diplomacia' }, valorPericia: 5 }
    ] }
  ],
  pericias: ['Investigação', 'Luta', 'Percepção', 'Ocultismo', 'Pontaria', 'Diplomacia', 'Acrobacia', 'Atletismo', 'Furtividade', 'Iniciativa', 'Medicina', 'Intuição', 'Reflexos', 'Tática', 'Tecnologia'].map((pericia, i) => ({ id: i + 1, pericia })),
  itens: [
    { id: 1, nome: 'Machado da Meia Lua', categoria: 'Arma', classificacao: 'II', dano: '2d8+3', critico: 'x3', quantidade: 1 },
    { id: 2, nome: 'Kit de Investigação', categoria: 'Equipamento', classificacao: 'I', dano: '', critico: '', quantidade: 1 },
    { id: 3, nome: 'Pistola', categoria: 'Arma', classificacao: 'I', dano: '2d6', critico: '18/x2', quantidade: 1 }
  ],
  habilidades: { trilhas: [{ id: 1, classePersonagem: 'Combatente', trilhaPersonagem: 'Aniquilador', nomeHabilidadeTrilhaPersonagem: 'A Favorita', descTrilhaPersonagem: 'Uma técnica de combate especializada.' }], poderesClasse: [{ id: 1, nomePoderPersonagem: 'Combater com Duas Armas', poderPersonagem: 'Técnica de combate utilizada pelo agente.' }], poderesParanormais: [{ id: 2, nomePoderParanormal: 'Visão do Oculto', elementoPoder: 'Conhecimento', descPoderParanormal: 'Seu contato com o paranormal alterou sua percepção.' }] },
  rituais: [{ id: 1, nomeRitual: 'Decadência', elementoRitual: 'Morte', execucaoRitual: 'Padrão', alvoRitual: 'Um ser', duracaoRitual: 'Instantânea', descRitual: 'Uma manifestação da Morte.' }, { id: 2, nomeRitual: 'Eletrocussão', elementoRitual: 'Energia', execucaoRitual: 'Padrão', alvoRitual: 'Um ser', descRitual: 'Uma descarga de energia paranormal.' }]
};

function clone(data) { return JSON.parse(JSON.stringify(data)); }
function node(tag, className = '', content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = String(content);
  return element;
}
function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
function text(value, fallback = '—') { return value === undefined || value === null || value === '' ? fallback : String(value); }
function storageGet(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
function storageRemove(key) { try { localStorage.removeItem(key); } catch (_) {} }
function toast(message, bad = false) {
  const div = $('toast');
  div.textContent = message;
  div.style.borderLeftColor = bad ? '#ffb456' : '#f32337';
  div.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { div.hidden = true; }, 4300);
}
function setConnection(message, type = '') {
  $('connection-status').textContent = message;
  $('connection-status').className = `connection ${type}`;
}
function saveNotice(message, type = '') {
  $('save-status').textContent = message;
  $('save-status').className = `save-status ${type}`;
}
function markDirty() {
  if (!personagem || isLoadingCharacter) return;
  dirty = true;
  saveNotice('Alterações na ficha ainda não salvas.', 'dirty');
}
function requireCharacter() {
  if (personagem) return true;
  toast('Selecione um personagem primeiro.', true);
  return false;
}
async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${response.status} ${url} ${body.slice(0, 120)}`);
  }
  if (response.status === 204) return null;
  return response.json();
}
function getSessionKey() { return `ordemup-escudo-jogador-v1:${personagem.id}`; }
function defaultSession() {
  return { pv: { current: 20, max: 20 }, pe: { current: 10, max: 10 }, san: { current: 30, max: 30 }, defesa: 10, iniciativa: 0, nex: 0, deslocamento: 9, conditions: [], notes: '', history: [] };
}
function loadSession() {
  const baseline = defaultSession();
  try {
    const saved = JSON.parse(storageGet(getSessionKey()) || 'null');
    if (saved && typeof saved === 'object') {
      return { ...baseline, ...saved, pv: { ...baseline.pv, ...saved.pv }, pe: { ...baseline.pe, ...saved.pe }, san: { ...baseline.san, ...saved.san }, conditions: Array.isArray(saved.conditions) ? saved.conditions : [], history: Array.isArray(saved.history) ? saved.history.slice(0, 30) : [] };
    }
  } catch (_) {}
  return baseline;
}
function saveSession() { if (personagem && session) storageSet(getSessionKey(), JSON.stringify(session)); }

async function writeResource(key, targetId = personagem?.id) {
  if (demo || targetId == null || !session) return;
  const id = String(targetId);
  const tag = `${id}:${key}`;
  const payload = { current: number(session[key].current), max: number(session[key].max) };
  const previous = resourceQueues.get(tag) || Promise.resolve();
  const job = previous.catch(() => {}).then(() => fetchJson(
    `/api/personagem/personagens/${encodeURIComponent(id)}/recursos/${key}`,
    { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
  ));
  resourceQueues.set(tag, job);
  job.then(
    () => { if (resourceQueues.get(tag) === job) resourceQueues.delete(tag); },
    error => {
      console.error(`Falha ao sincronizar ${key}:`, error);
      if (resourceQueues.get(tag) === job) {
        resourceQueues.delete(tag);
        if (personagem && String(personagem.id) === id) toast(`Falha ao sincronizar ${key.toUpperCase()} com o servidor.`, true);
      }
    }
  );
  return job;
}

async function refreshSharedResources(id = personagem?.id) {
  if (demo || id == null || !session) return;
  const requestedId = String(id);
  const remote = await fetchJson(`/api/personagem/personagens/${encodeURIComponent(requestedId)}/recursos`, {cache:'no-store'});
  if (!personagem || String(personagem.id) !== requestedId) return;

  if (!remote.initialized) {
    // Primeira abertura após instalar a sincronização: migra PV/PE/SAN do localStorage.
    // No primeiro acesso sem dados locais, também inicializa os valores padrão.
    if (RESOURCES.some(key => resourceQueues.has(`${requestedId}:${key}`))) return;
    for (const key of RESOURCES) {
      if (!personagem || String(personagem.id) !== requestedId) return;
      await writeResource(key, requestedId);
    }
    return;
  }
  for (const key of RESOURCES) {
    if (resourceQueues.has(`${requestedId}:${key}`)) continue;
    if (remote[key] && typeof remote[key].current === 'number') {
      session[key] = { current: remote[key].current, max: remote[key].max };
    }
  }
  saveSession();
  renderResourceMeters();
}

async function loadCatalogs() {
  if (demo) {
    catalogs = { pericias: clone(demoData.pericias), itens: clone(demoData.itens), trilhas: clone(demoData.habilidades.trilhas), poderes: clone(demoData.habilidades.poderesClasse), paranormais: clone(demoData.habilidades.poderesParanormais), rituais: clone(demoData.rituais) };
    return;
  }
  const paths = {
    pericias: '/api/personagem/pericias', itens: '/api/item', trilhas: '/api/personagem/trilha', poderes: '/api/personagem/poder', paranormais: '/api/personagem/poderParanormal', rituais: '/api/personagem/ritual'
  };
  await Promise.all(Object.entries(paths).map(async ([name, url]) => {
    try {
      const result = await fetchJson(url);
      catalogs[name] = Array.isArray(result) ? result : [];
    } catch (error) {
      console.warn(`Catálogo indisponível: ${name}`, error);
      catalogs[name] = [];
    }
  }));
}
async function init() {
  bindEvents();
  setConnection(demo ? 'MODO DEMONSTRAÇÃO' : 'CONECTANDO À API', demo ? 'demo' : '');
  try {
    const [list] = await Promise.all([
      demo ? Promise.resolve(clone(demoData.personagens)) : fetchJson('/api/personagem/personagens'),
      loadCatalogs()
    ]);
    personagens = Array.isArray(list) ? list : [];
    renderPicker();
    if (!personagens.length) {
      setConnection('SEM PERSONAGENS CADASTRADOS', 'error');
      saveNotice('Cadastre um personagem em /personagem.');
      return;
    }
    setConnection(demo ? 'MODO DEMONSTRAÇÃO' : 'CONECTADO AO ORDEM UP', demo ? 'demo' : 'connected');
    const requested = new URLSearchParams(location.search).get('id');
    const stored = storageGet('ordemup-escudo-ultimo-id');
    const first = personagens.find(p => String(p.id) === String(requested || stored)) || personagens[0];
    await selectCharacter(first.id);
  } catch (error) {
    console.error('Falha na conexão com o Ordem Up:', error);
    setConnection('API INDISPONÍVEL', 'error');
    $('character-select').innerHTML = '';
    $('character-select').append(node('option', '', 'Não foi possível carregar personagens'));
    saveNotice('Verifique /api/personagem/personagens e o servidor Spring Boot.', 'failed');
    const message = node('div', 'empty');
    message.append('Não foi possível conectar ao Spring Boot. ');
    const demoLink = node('a', '', 'Abrir uma demonstração da tela ↗');
    demoLink.href = '/escudo-jogador?demo=1'; demoLink.style.color = '#ff5b68';
    message.append(demoLink);
    $('top-skills').replaceChildren(message);
  }
}
function renderPicker() {
  const select = $('character-select');
  select.replaceChildren(node('option', '', 'Selecione um personagem...'));
  select.firstElementChild.value = '';
  personagens.forEach(p => {
    const option = node('option', '', text(p.nome, 'Sem nome'));
    option.value = String(p.id);
    select.append(option);
  });
  $('character-count').textContent = String(personagens.length).padStart(2, '0');
}
async function selectCharacter(id) {
  const next = personagens.find(p => String(p.id) === String(id));
  if (!next) return;
  if (dirty && !confirm('Existem alterações na ficha ainda não salvas. Deseja trocar de personagem e descartá-las?')) {
    $('character-select').value = String(personagem.id);
    return;
  }
  isLoadingCharacter = true;
  personagem = clone(next);
  $('character-select').value = String(personagem.id);
  storageSet('ordemup-escudo-ultimo-id', String(personagem.id));
  skills = new Map();
  (personagem.pericias || []).forEach(rel => {
    const id = rel.pericia?.id ?? rel.periciaId;
    if (id != null) skills.set(String(id), number(rel.valorPericia));
  });
  skillsDirty = false;
  dirty = false;
  session = loadSession();
  lastRoll = null;
  items = [];
  abilities = { trilhas: [], poderesClasse: [], poderesParanormais: [] };
  renderCharacter();
  renderSession();
  renderSkills();
  renderInventory();
  renderAbilities();
  renderRituals();
  renderOverview();
  renderNotesAndHistory();
  isLoadingCharacter = false;
  saveNotice(demo ? 'Demonstração — não conectado ao banco.' : 'Ficha carregada. Pronto para jogar.', 'saved');
  const currentId = String(personagem.id);
  if (demo) {
    items = clone(demoData.itens).slice(0, 2);
    abilities = clone(demoData.habilidades);
  } else {
    const [resItems, resAbilities, resResources] = await Promise.allSettled([
      fetchJson(`/api/personagem/personagens/${currentId}/itens`),
      fetchJson(`/api/personagem/personagens/${currentId}/habilidades`),
      refreshSharedResources(currentId)
    ]);
    if (!personagem || String(personagem.id) !== currentId) return;
    if (resItems.status === 'fulfilled') items = Array.isArray(resItems.value) ? resItems.value : [];
    else console.warn('Não foi possível carregar itens:', resItems.reason);
    if (resAbilities.status === 'fulfilled') abilities = { ...abilities, ...(resAbilities.value || {}) };
    else console.warn('Não foi possível carregar habilidades:', resAbilities.reason);
    if (resResources.status === 'rejected') {
      console.warn('Recursos não sincronizados: confira a nova API:', resResources.reason);
      saveNotice('PV/PE/SAN sem conexão com a API — cópia local ativa.', 'failed');
    }
  }
  renderInventory();
  renderAbilities();
  renderOverview();
}
function renderCharacter() {
  $('nome').value = personagem.nome || '';
  $('nomeJogador').value = personagem.nomeJogador || '';
  $('nivel').value = number(personagem.nivel, 1);
  $('hero-id').textContent = `ID / ${String(personagem.id).padStart(3, '0')}`;
  setPortrait();
  renderAttributes();
}
function setPortrait() {
  const initials = ($('nome').value || '?').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  $('portrait-initials').textContent = initials || '?';
}
function renderAttributes() {
  const box = $('attributes'); box.replaceChildren();
  ATTRS.forEach(a => {
    const card = node('div', 'attribute');
    const short = node('div', 'abbr', a.short);
    const name = node('div', 'attr-name', a.name);
    const row = node('div', 'attribute-row');
    const input = node('input', 'attribute-number');
    input.type = 'number'; input.min = '0'; input.max = '20'; input.value = number(personagem[a.key]); input.dataset.field = a.key;
    input.setAttribute('aria-label', a.name);
    const roll = node('button', 'attribute-die', '20');
    roll.type = 'button'; roll.setAttribute('aria-label', `Rolar ${a.name}`);
    roll.addEventListener('click', () => rollAttribute(a.key, a.name));
    input.addEventListener('input', markDirty);
    row.append(input, roll); card.append(short, name, row); box.append(card);
  });
}
function renderResourceMeters() {
  if (!session) return;
  RESOURCES.forEach(key => {
    const card = document.querySelector(`.resource[data-resource="${key}"]`);
    const resource = session[key];
    // Não altera o campo enquanto o jogador está digitando.
    if (document.activeElement !== card.querySelector('.resource-current'))
      card.querySelector('.resource-current').value = number(resource.current);
    if (document.activeElement !== card.querySelector('.resource-max'))
      card.querySelector('.resource-max').value = number(resource.max, 1);
    card.querySelector('.meter-fill').style.width = `${clamp(number(resource.current) / Math.max(1, number(resource.max, 1)) * 100, 0, 100)}%`;
  });
}
function renderSession() {
  renderResourceMeters();
  ['defesa', 'iniciativa', 'nex', 'deslocamento'].forEach(key => { $(key).value = number(session[key]); });
  $('notes').value = session.notes || '';
  renderConditions();
  renderHistory();
  renderRecentRolls();
}
function updateResource(key, delta) {
  if (!requireCharacter()) return;
  const resource = session[key];
  resource.max = clamp(Math.floor(number(resource.max, 1)), 1, 9999);
  resource.current = clamp(Math.floor(number(resource.current) + delta), 0, resource.max);
  renderResourceMeters(); saveSession(); writeResource(key);
}
function renderConditions() {
  const area = $('conditions'); area.replaceChildren();
  CONDITIONS.forEach(name => {
    const chosen = session.conditions.includes(name);
    const button = node('button', `condition${chosen ? ' selected' : ''}`, name);
    button.type = 'button'; button.setAttribute('aria-pressed', String(chosen));
    button.addEventListener('click', () => {
      if (!requireCharacter()) return;
      session.conditions = session.conditions.includes(name) ? session.conditions.filter(c => c !== name) : [...session.conditions, name];
      saveSession(); renderConditions();
    });
    area.append(button);
  });
}
function skillEntries() {
  const catalog = new Map();
  catalogs.pericias.forEach(p => { if (p.id != null) catalog.set(String(p.id), { id: p.id, name: p.pericia || p.nome || 'Perícia' }); });
  // Se o catálogo estiver indisponível, ainda renderiza as perícias associadas existentes.
  (personagem?.pericias || []).forEach(rel => {
    const obj = rel.pericia || {};
    const id = obj.id ?? rel.periciaId;
    if (id != null && !catalog.has(String(id))) catalog.set(String(id), { id, name: obj.pericia || obj.nome || `Perícia ${id}` });
  });
  return [...catalog.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}
function renderSkills() {
  const list = $('skills-list'); list.replaceChildren();
  if (!personagem) return;
  const query = $('skill-filter').value.trim().toLocaleLowerCase('pt-BR');
  const filtered = skillEntries().filter(s => s.name.toLocaleLowerCase('pt-BR').includes(query));
  if (!filtered.length) {
    list.append(node('div', 'empty', 'Nenhuma perícia encontrada. Confira /api/personagem/pericias.'));
    renderOverview(); return;
  }
  filtered.forEach(skill => {
    const row = node('div', 'skill-row');
    const name = node('span', 'skill-label', skill.name);
    const value = node('input', 'skill-input');
    value.type = 'number'; value.min = '-99'; value.max = '999'; value.value = number(skills.get(String(skill.id)));
    value.setAttribute('aria-label', `Bônus de ${skill.name}`);
    value.addEventListener('input', () => {
      skills.set(String(skill.id), number(value.value));
      skillsDirty = true; markDirty(); renderOverview();
    });
    const button = node('button', 'skill-roll', '⚄ ROLAR');
    button.type = 'button'; button.setAttribute('aria-label', `Rolar perícia ${skill.name}`);
    button.addEventListener('click', () => {
      const dice = clamp(Math.floor(number($('skill-dice').value, 1)), 1, 20);
      const bonus = number(value.value);
      rollSkill(skill.name, dice, bonus);
    });
    row.append(name, value, button); list.append(row);
  });
  renderOverview();
}
function renderOverview() {
  if (!personagem) return;
  $('summary-level').textContent = $('nivel').value || '—';
  $('summary-skills').textContent = [...skills.values()].filter(v => number(v) !== 0).length;
  $('summary-items').textContent = items.reduce((sum, obj) => sum + number(obj.quantidade, 1), 0);
  $('summary-abilities').textContent = (abilities.trilhas || []).length + (abilities.poderesClasse || []).length + (abilities.poderesParanormais || []).length;
  const top = $('top-skills'); top.replaceChildren();
  const ordered = skillEntries().map(s => ({ ...s, value: number(skills.get(String(s.id))) })).sort((a,b) => b.value - a.value || a.name.localeCompare(b.name,'pt-BR')).slice(0,4);
  if (!ordered.length) { top.append(node('p', 'muted', 'Nenhuma perícia disponível.')); return; }
  ordered.forEach(skill => {
    const row = node('div', 'summary-skill');
    row.append(node('span', '', skill.name));
    const button = node('button', '', `${skill.value >= 0 ? '+' : ''}${skill.value}  ⚄`);
    button.type = 'button'; button.addEventListener('click', () => rollSkill(skill.name, clamp(Math.floor(number($('skill-dice').value, 1)), 1, 20), skill.value));
    row.append(button); top.append(row);
  });
}
function inventoryName(item) { return item.nome || item.item?.nome || 'Item'; }
function renderInventory() {
  const area = $('inventory-list'); area.replaceChildren();
  fillSelect('item-select', catalogs.itens, i => `${i.nome || 'Item'} — ${i.categoria || 'Sem categoria'}`);
  if (!items.length) { area.append(node('div', 'empty', 'Nenhum item vinculado à ficha. Escolha um item do catálogo acima.')); return; }
  items.forEach(item => {
    const card = node('article', 'inventory-card');
    card.append(node('h3', 'card-title', inventoryName(item)));
    card.append(node('p', 'card-subtitle', `CATEGORIA: ${text(item.categoria, 'NÃO INFORMADA')}  ·  CLASSIFICAÇÃO: ${text(item.classificacao)}  ·  QTD: ${number(item.quantidade, 1)}`));
    const bottom = node('div', 'card-bottom');
    const tag = node('span', 'tag', item.dano ? `DANO ${item.dano} / CRÍTICO ${text(item.critico)}` : 'EQUIPAMENTO');
    const controls = node('div', 'card-actions');
    if (item.dano) {
      const die = node('button', 'mini-btn', '⚄ ROLAR DANO');
      die.type = 'button'; die.addEventListener('click', () => {
        const expression = String(item.dano).replace(/\s/g, '');
        try { rollExpression(expression, `Dano: ${inventoryName(item)}`); }
        catch (_) { $('dice-expression').value = expression; toast('A fórmula do dano não está no formato suportado. Ajuste o rolador manualmente.', true); }
      });
      controls.append(die);
    }
    const remove = node('button', 'mini-btn remove', 'REMOVER');
    remove.type = 'button'; remove.addEventListener('click', () => removeItem(item));
    controls.append(remove); bottom.append(tag, controls); card.append(bottom); area.append(card);
  });
}
function fillSelect(selectId, records, label) {
  const sel = $(selectId); const selected = sel.value; sel.replaceChildren();
  const first = node('option', '', records.length ? 'Selecionar do catálogo...' : 'Catálogo indisponível'); first.value = ''; sel.append(first);
  records.forEach(rec => { const opt = node('option', '', label(rec)); opt.value = rec.id; sel.append(opt); });
  if ([...sel.options].some(o => o.value === selected)) sel.value = selected;
}
async function addItem() {
  if (!requireCharacter()) return;
  const id = number($('item-select').value);
  const qty = Math.floor(number($('item-quantity').value, 1));
  if (!id || qty < 1 || qty > 999) return toast('Selecione um item e uma quantidade válida.', true);
  if (demo) {
    const original = catalogs.itens.find(i => Number(i.id) === id);
    const found = items.find(i => Number(i.itemId ?? i.id) === id);
    if (found) found.quantidade = number(found.quantidade, 1) + qty;
    else items.push({ ...clone(original), itemId: id, quantidade: qty });
    renderInventory(); renderOverview(); return toast('Item adicionado na demonstração.');
  }
  try {
    await fetchJson(`/api/personagem/personagens/${personagem.id}/itens`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ itemId: id, quantidade: qty }) });
    await refreshInventory(); toast('Item adicionado à ficha.');
  } catch (error) { console.error(error); toast('Não foi possível adicionar o item. Verifique a API.', true); }
}
async function removeItem(item) {
  if (!requireCharacter() || !confirm(`Remover ${inventoryName(item)} da ficha?`)) return;
  const id = item.itemId ?? item.id;
  if (demo) { items = items.filter(i => String(i.itemId ?? i.id) !== String(id)); renderInventory(); renderOverview(); return; }
  try {
    await fetchJson(`/api/personagem/personagens/${personagem.id}/itens/${id}`, { method: 'DELETE' });
    await refreshInventory(); toast('Item removido da ficha.');
  } catch (error) { console.error(error); toast('Não foi possível remover o item.', true); }
}
async function refreshInventory() {
  if (!personagem || demo) return;
  const id = String(personagem.id);
  const result = await fetchJson(`/api/personagem/personagens/${id}/itens`);
  if (personagem && String(personagem.id) === id) { items = Array.isArray(result) ? result : []; renderInventory(); renderOverview(); }
}
function abilityTitle(item, config) { return item[config.name] || item.nome || 'Habilidade'; }
function renderAbilities() {
  for (const [type, config] of Object.entries(ABILITY_CONFIG)) {
    const selected = abilities[config.dataKey] || [];
    $(config.count).textContent = String(selected.length);
    fillSelect(config.select, catalogs[config.catalog], item => abilityTitle(item, config));
    const area = $(config.list); area.replaceChildren();
    if (!selected.length) { area.append(node('div', 'empty', 'Nenhum registro vinculado.')); continue; }
    selected.forEach(item => {
      const card = node('article', 'ability-card');
      card.append(node('h3', 'card-title', abilityTitle(item, config)));
      const subtitle = type === 'trilha' ? `${text(item.classePersonagem, 'Classe não informada')} · ${item.nexTrilha != null ? 'NEX ' + item.nexTrilha + '%' : 'Trilha'}` : (type === 'paranormais' ? `ELEMENTO: ${text(item.elementoPoder)}` : 'PODER DE CLASSE');
      card.append(node('p', 'card-subtitle', subtitle));
      if (type === 'trilha' && item.nomeHabilidadeTrilhaPersonagem) card.append(node('div', 'card-subtitle', `HABILIDADE: ${item.nomeHabilidadeTrilhaPersonagem}`));
      if (item[config.desc]) card.append(node('p', 'card-description', item[config.desc]));
      const footer = node('div', 'card-bottom');
      const btn = node('button', 'mini-btn remove', 'DESVINCULAR'); btn.type = 'button';
      btn.addEventListener('click', () => unlinkAbility(type, item)); footer.append(btn);
      card.append(footer); area.append(card);
    });
  }
}
async function refreshAbilities() {
  if (!personagem || demo) return;
  const id = String(personagem.id);
  const result = await fetchJson(`/api/personagem/personagens/${id}/habilidades`);
  if (personagem && String(personagem.id) === id) { abilities = { ...abilities, ...(result || {}) }; renderAbilities(); renderOverview(); }
}
async function linkAbility(type) {
  if (!requireCharacter()) return;
  const config = ABILITY_CONFIG[type];
  const id = number($(config.select).value);
  if (!id) return toast('Selecione uma habilidade.', true);
  if (demo) {
    const item = catalogs[config.catalog].find(i => Number(i.id) === id);
    if (!abilities[config.dataKey].some(i => Number(i.id) === id)) abilities[config.dataKey].push(clone(item));
    renderAbilities(); renderOverview(); return toast('Habilidade vinculada na demonstração.');
  }
  try {
    await fetchJson(`/api/personagem/personagens/${personagem.id}/${config.endpoint}/${id}`, { method: 'PUT' });
    await refreshAbilities(); toast('Habilidade vinculada.');
  } catch (error) { console.error(error); toast('Não foi possível vincular a habilidade.', true); }
}
async function unlinkAbility(type, item) {
  if (!requireCharacter() || !confirm('Desvincular esta habilidade da ficha?')) return;
  const config = ABILITY_CONFIG[type];
  if (demo) {
    abilities[config.dataKey] = abilities[config.dataKey].filter(a => String(a.id) !== String(item.id));
    renderAbilities(); renderOverview(); return;
  }
  try {
    await fetchJson(`/api/personagem/personagens/${personagem.id}/${config.endpoint}/${item.id}`, { method: 'DELETE' });
    await refreshAbilities(); toast('Habilidade desvinculada.');
  } catch (error) { console.error(error); toast('Não foi possível desvincular.', true); }
}
function renderRituals() {
  const target = $('ritual-list'); target.replaceChildren();
  const q = $('ritual-filter').value.trim().toLocaleLowerCase('pt-BR');
  const matches = [...catalogs.rituais].filter(r => `${r.nomeRitual || ''} ${r.elementoRitual || ''}`.toLocaleLowerCase('pt-BR').includes(q))
    .sort((a, b) => String(a.nomeRitual || '').localeCompare(String(b.nomeRitual || ''), 'pt-BR'));
  if (!matches.length) return target.append(node('div', 'empty', 'Nenhum ritual encontrado no catálogo.'));
  matches.forEach(r => {
    const card = node('article', 'ritual-card');
    card.append(node('h3', 'card-title', r.nomeRitual || 'Ritual'));
    card.append(node('p', 'card-subtitle', `ELEMENTO: ${text(r.elementoRitual, 'NÃO DEFINIDO')}  ·  EXECUÇÃO: ${text(r.execucaoRitual)}  ·  ALVO: ${text(r.alvoRitual)}`));
    if (r.descRitual) card.append(node('p', 'card-description', r.descRitual));
    target.append(card);
  });
}
function renderNotesAndHistory() { $('notes').value = session?.notes || ''; renderHistory(); }
function renderRecentRolls() {
  const box = $('recent-rolls'); box.replaceChildren();
  const history = session?.history || [];
  if (!history.length) return box.append(node('p', 'muted small', 'Nenhuma rolagem ainda.'));
  history.slice(0, 3).forEach(entry => box.append(makeRollRow(entry)));
}
function makeRollRow(entry) {
  const row = node('div', 'recent-roll');
  const side = node('div'); side.append(node('div', 'name', entry.label)); side.append(node('div', 'expr', entry.expr));
  row.append(side, node('strong', '', entry.total)); return row;
}
function renderHistory() {
  const box = $('roll-history'); box.replaceChildren();
  const history = session?.history || [];
  if (!history.length) return box.append(node('div', 'empty', 'Seu histórico de dados aparecerá aqui.'));
  history.forEach(entry => {
    const row = makeRollRow(entry);
    const detail = node('div', 'roll-meta', `${entry.time}  ·  ${entry.detail}`);
    const holder = node('div'); holder.append(row, detail); box.append(holder);
  });
}
function recordRoll(roll) {
  if (personagem && session) {
    session.history.unshift({ ...roll, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) });
    session.history = session.history.slice(0, 30);
    saveSession(); renderHistory(); renderRecentRolls();
  }
  $('dice-result').querySelector('.roll-caption').textContent = roll.label.toUpperCase();
  $('dice-result').querySelector('.roll-score').textContent = roll.total;
  $('dice-result').querySelector('.roll-meta').textContent = `${roll.expr} · ${roll.detail}`;
  activateDiceHighlight();
}
function activateDiceHighlight() { $('dice-result').animate?.([{ transform: 'scale(.97)' }, { transform: 'scale(1)' }], { duration: 160 }); }
function diceRoll(faces) { return Math.floor(Math.random() * faces) + 1; }
function parseRoll(expression) {
  const clean = String(expression).replace(/\s/g, '').toLowerCase();
  if (!clean || clean.length > 100 || !/^[\d+\-d]+$/.test(clean)) throw new Error('Use uma expressão como 2d20+5.');
  const tokens = clean.match(/[+-]?[^+-]+/g) || [];
  if (!tokens.length || tokens.join('') !== clean) throw new Error('Expressão inválida.');
  let total = 0, diceCount = 0;
  const parts = [];
  for (const token of tokens) {
    const sign = token.startsWith('-') ? -1 : 1;
    const plain = token.replace(/^[+-]/, '');
    const die = plain.match(/^(\d{1,2})?d(4|6|8|10|12|20|100)$/);
    if (die) {
      const count = number(die[1], 1); const faces = number(die[2]);
      if (count < 1) throw new Error('Informe pelo menos um dado.');
      diceCount += count;
      if (diceCount > 100) throw new Error('Limite de 100 dados por rolagem.');
      const results = Array.from({ length: count }, () => diceRoll(faces));
      total += sign * results.reduce((a,b) => a+b, 0);
      parts.push(`${sign < 0 ? '−' : ''}[${results.join(', ')}]`);
    } else if (/^\d{1,4}$/.test(plain)) {
      const value = number(plain); total += sign * value; parts.push(`${sign < 0 ? '−' : '+'}${value}`);
    } else throw new Error('Formato não suportado. Use Nd4, Nd6, Nd8, Nd10, Nd12, Nd20, Nd100 e números.');
  }
  return { total, detail: parts.join(' ') };
}
function rollExpression(expression, label = 'Rolagem personalizada') {
  const result = parseRoll(expression);
  recordRoll({ label, expr: expression, total: result.total, detail: result.detail });
  lastRoll = () => rollExpression(expression, label);
  $('dice-expression').value = expression;
  return result;
}
function rollAttribute(key, label) {
  if (!requireCharacter()) return;
  const input = document.querySelector(`.attribute-number[data-field="${key}"]`);
  const points = clamp(Math.floor(number(input?.value)), 0, 20);
  const count = points === 0 ? 2 : points;
  const results = Array.from({ length: count }, () => diceRoll(20));
  const total = points === 0 ? Math.min(...results) : Math.max(...results);
  const expr = `${count}d20 · ${points === 0 ? 'MENOR' : 'MAIOR'}`;
  recordRoll({ label: `Atributo: ${label}`, expr, total, detail: `[${results.join(', ')}]` });
  lastRoll = () => rollAttribute(key, label);
}
function rollSkill(name, dice, bonus) {
  if (!requireCharacter()) return;
  const results = Array.from({ length: dice }, () => diceRoll(20));
  const picked = Math.max(...results);
  const total = picked + bonus;
  const expr = `${dice}d20 (maior) ${bonus < 0 ? '− ' + Math.abs(bonus) : '+ ' + bonus}`;
  recordRoll({ label: `Perícia: ${name}`, expr, total, detail: `[${results.join(', ')}] → ${picked} ${bonus < 0 ? '−' : '+'} ${Math.abs(bonus)}` });
  lastRoll = () => rollSkill(name, dice, bonus);
}
async function saveCharacter() {
  if (!requireCharacter()) return;
  const nome = $('nome').value.trim();
  if (!nome) return toast('O nome do personagem não pode ficar vazio.', true);
  const payload = {
    nome, nomeJogador: $('nomeJogador').value.trim(), nivel: Math.max(1, Math.floor(number($('nivel').value, 1)))
  };
  ATTRS.forEach(a => { payload[a.key] = clamp(Math.floor(number(document.querySelector(`.attribute-number[data-field="${a.key}"]`).value)), 0, 20); });
  if (skillsDirty) {
    payload.pericias = [...skills.entries()].filter(([id]) => Number.isInteger(Number(id)) && Number(id) > 0)
      .map(([id, valorPericia]) => ({ periciaId: Number(id), valorPericia: Math.floor(number(valorPericia)) }));
  }
  if (demo) {
    personagem = { ...personagem, ...payload };
    personagem.pericias = skillEntries().filter(s => skills.has(String(s.id))).map(s => ({ pericia: { id: s.id, pericia: s.name }, valorPericia: skills.get(String(s.id)) }));
    personagens = personagens.map(p => String(p.id) === String(personagem.id) ? clone(personagem) : p);
    dirty = false; skillsDirty = false;
    setPortrait(); renderPicker(); $('character-select').value = String(personagem.id);
    saveNotice('Ficha demonstrativa atualizada (não salva no banco).', 'saved');
    return toast('Ficha atualizada na demonstração.');
  }
  $('btn-save').disabled = true;
  saveNotice('Salvando no PostgreSQL...');
  try {
    await fetchJson(`/api/personagem/personagens/${personagem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const list = await fetchJson('/api/personagem/personagens');
    personagens = Array.isArray(list) ? list : [];
    const saved = personagens.find(p => String(p.id) === String(personagem.id));
    if (saved) personagem = clone(saved);
    dirty = false; skillsDirty = false;
    saveNotice('Ficha salva no PostgreSQL com sucesso.', 'saved');
    setPortrait(); renderPicker(); $('character-select').value = String(personagem.id);
    renderOverview(); toast('Ficha salva com sucesso!');
  } catch (error) { console.error(error); saveNotice('Não foi possível salvar. Confira a API.', 'failed'); toast('Falha ao salvar ficha. Veja o console.', true); }
  finally { $('btn-save').disabled = false; }
}
function setActiveTab(target) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === target));
  document.querySelectorAll('.tab-content').forEach(p => p.classList.toggle('active', p.dataset.panel === target));
}
function bindEvents() {
  $('character-select').addEventListener('change', event => selectCharacter(event.target.value));
  $('btn-refresh').addEventListener('click', () => {
    if (dirty && !confirm('Descartar alterações não salvas e recarregar a ficha?')) return;
    dirty = false; skillsDirty = false; initRefresh();
  });
  $('btn-save').addEventListener('click', saveCharacter);
  ['nome', 'nomeJogador', 'nivel'].forEach(id => $(id).addEventListener('input', () => { markDirty(); if (id === 'nome') setPortrait(); if (id === 'nivel') $('summary-level').textContent = $(id).value; }));
  document.querySelectorAll('.resource').forEach(card => {
    const key = card.dataset.resource;
    card.querySelectorAll('[data-adjust]').forEach(button => button.addEventListener('click', () => updateResource(key, number(button.dataset.adjust))));
    card.querySelector('.resource-current').addEventListener('change', event => {
      if (!requireCharacter()) return;
      session[key].current = clamp(Math.floor(number(event.target.value)), 0, Math.max(1, number(session[key].max)));
      saveSession(); renderResourceMeters(); writeResource(key);
    });
    card.querySelector('.resource-max').addEventListener('change', event => {
      if (!requireCharacter()) return;
      session[key].max = clamp(Math.floor(number(event.target.value, 1)), 1, 9999);
      session[key].current = clamp(number(session[key].current), 0, session[key].max);
      saveSession(); renderResourceMeters(); writeResource(key);
    });
  });
  ['defesa', 'iniciativa', 'nex', 'deslocamento'].forEach(id => $(id).addEventListener('change', event => {
    if (!requireCharacter()) return;
    session[id] = number(event.target.value);
    saveSession();
  }));
  $('btn-iniciativa').addEventListener('click', () => {
    if (!requireCharacter()) return;
    const bonus = number($('iniciativa').value);
    rollExpression(`1d20${bonus < 0 ? bonus : '+' + bonus}`, 'Iniciativa');
  });
  document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => setActiveTab(button.dataset.tab)));
  document.querySelectorAll('[data-go-tab]').forEach(button => button.addEventListener('click', () => setActiveTab(button.dataset.goTab)));
  $('skill-filter').addEventListener('input', renderSkills);
  $('item-select').addEventListener('change', () => {});
  $('btn-add-item').addEventListener('click', addItem);
  document.querySelectorAll('[data-link-ability]').forEach(b => b.addEventListener('click', () => linkAbility(b.dataset.linkAbility)));
  $('ritual-filter').addEventListener('input', renderRituals);
  $('notes').addEventListener('input', () => { if (!personagem) return; session.notes = $('notes').value; saveSession(); });
  $('btn-clear-history').addEventListener('click', () => {
    if (!requireCharacter() || !confirm('Apagar o histórico local de rolagens deste personagem?')) return;
    session.history = []; saveSession(); renderHistory(); renderRecentRolls();
  });
  $('btn-roll').addEventListener('click', () => {
    try { rollExpression($('dice-expression').value); }
    catch (error) { toast(error.message, true); }
  });
  $('dice-expression').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); $('btn-roll').click(); } });
  document.querySelectorAll('[data-dice]').forEach(button => button.addEventListener('click', () => {
    try { rollExpression(button.dataset.dice, `Dado rápido ${button.dataset.dice.toUpperCase()}`); }
    catch (error) { toast(error.message, true); }
  }));
  $('btn-repeat-roll').addEventListener('click', () => { if (lastRoll) lastRoll(); else toast('Faça uma rolagem primeiro.'); });
  window.addEventListener('beforeunload', event => { if (dirty && !demo) { event.preventDefault(); event.returnValue = ''; } });
}
async function initRefresh() {
  setConnection('ATUALIZANDO API...');
  try {
    await loadCatalogs();
    const selected = personagem?.id;
    personagens = demo ? clone(demoData.personagens) : await fetchJson('/api/personagem/personagens');
    renderPicker();
    if (personagens.length) {
      const match = personagens.find(p => String(p.id) === String(selected)) || personagens[0];
      await selectCharacter(match.id);
    }
    setConnection(demo ? 'MODO DEMONSTRAÇÃO' : 'CONECTADO AO ORDEM UP', demo ? 'demo' : 'connected');
    toast('Dados atualizados.');
  } catch (error) { console.error(error); setConnection('FALHA NA ATUALIZAÇÃO', 'error'); toast('Não foi possível atualizar.', true); }
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  // Consulta o mesmo estado da ficha que o mestre utiliza, sem recarregar a página.
  setInterval(() => {
    if (demo || document.hidden || !personagem || isLoadingCharacter) return;
    refreshSharedResources(String(personagem.id)).catch(error =>
      console.warn('Não foi possível atualizar PV/PE/SAN:', error));
  }, 4000);
});
