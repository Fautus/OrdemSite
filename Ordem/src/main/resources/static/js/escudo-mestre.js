/* ORDEM UP — ESCUDO DO MESTRE
 * Personagens e PV/PE/SAN: leitura e escrita nas APIs compartilhadas do PostgreSQL.
 * Criaturas: API /api/mestre/criaturas (ou catálogo local quando a API não estiver instalada).
 * Iniciativa, notas, referências e histórico de rolagens: localStorage, por navegador.
 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const E = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const N = (value, fallback = 0) => { const n = Number(value); return Number.isFinite(n) ? n : fallback; };
  const fmt = n => String(Math.max(0, N(n))).padStart(2,'0');
  const demo = document.documentElement.dataset.demo === 'true' || new URLSearchParams(location.search).get('demo') === '1';
  const STORE = demo ? 'ordem-up-mestre-demo-v1' : 'ordem-up-mestre-v1';
  const getSaved = (key, fallback) => { try { const x = JSON.parse(localStorage.getItem(`${STORE}:${key}`)); return x == null ? fallback : x; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(`${STORE}:${key}`, JSON.stringify(value)); } catch { console.warn('Armazenamento local indisponível neste ambiente.'); } };
  const starterRules = [
    {id:'padrao-1',grupo:'Combate',titulo:'Ordem de iniciativa',conteudo:'Registre os participantes, organize por iniciativa e avance a rodada depois que todos tiverem agido. Confira no livro quais ações são permitidas por turno.'},
    {id:'padrao-2',grupo:'Combate',titulo:'Defesa e dano',conteudo:'Confira a Defesa do alvo, o resultado do ataque e os efeitos de resistência, imunidade e vulnerabilidade definidos para a criatura.'},
    {id:'padrao-3',grupo:'Testes',titulo:'Testes e dificuldades',conteudo:'Determine o objetivo e a dificuldade antes da rolagem. Consulte a ficha e a edição do sistema para definir dados, modificadores e consequências.'},
    {id:'padrao-4',grupo:'Condições',titulo:'Efeitos temporários',conteudo:'Anote o nome da condição, sua origem, seu efeito e quando termina. Use a descrição oficial do livro como referência.'},
    {id:'padrao-5',grupo:'Investigação',titulo:'Pistas essenciais',conteudo:'Registre o que pode ser descoberto, onde está cada pista e qual informação ela revela. Prepare caminhos alternativos para a investigação.'},
    {id:'padrao-6',grupo:'Investigação',titulo:'Condução da cena',conteudo:'Descreva a situação, pergunte o que os agentes fazem e registre como o mundo reage às decisões. Anote consequências para cenas futuras.'},
    {id:'padrao-7',grupo:'Outros',titulo:'Rituais e efeitos',conteudo:'Tenha à mão execução, alvo, duração, resistência, alcance e custo do ritual. Verifique a ficha ou livro antes de aplicar efeitos.'},
    {id:'padrao-8',grupo:'Combate',titulo:'Ficha da ameaça',conteudo:'Confira PV, Defesa, deslocamento, ataques, habilidades especiais e resistências antes de agir. Registre no controle da cena os PV atuais.'}
  ];
  const demoPlayers = [
    {id:101,nome:'KENAN VASCONCELOS',nomeJogador:'Jogador 01',nivel:12,forca:3,destreza:2,inteligencia:1,vontade:2,fortitude:3,pericias:[{pericia:{id:1,pericia:'Luta'},valorPericia:10},{pericia:{id:2,pericia:'Fortitude'},valorPericia:5},{pericia:{id:3,pericia:'Intimidação'},valorPericia:5}]},
    {id:102,nome:'SARA DOMINIQUE',nomeJogador:'Jogador 02',nivel:10,forca:1,destreza:2,inteligencia:4,vontade:3,fortitude:1,pericias:[{pericia:{id:1,pericia:'Ocultismo'},valorPericia:10},{pericia:{id:2,pericia:'Investigação'},valorPericia:5}]},
    {id:103,nome:'ESTOICO',nomeJogador:'Jogador 03',nivel:9,forca:2,destreza:3,inteligencia:2,vontade:1,fortitude:2,pericias:[{pericia:{id:1,pericia:'Pontaria'},valorPericia:10},{pericia:{id:2,pericia:'Reflexos'},valorPericia:5}]}
  ];
  const demoMonsters = [
    {id:'demo-1',nome:'DEVORADOR DA NÉVOA',elemento:'Morte',vd:100,pvMax:160,defesa:22,deslocamento:'9 m',forca:3,agilidade:2,intelecto:0,presenca:2,vigor:4,resistencias:'Névoa densa: adapte os efeitos à sua mesa.',ataques:'Garras — ataque corpo a corpo; dano conforme encontro.',habilidades:'Visão na Névoa — percebe formas em meio à névoa.',descricao:'Uma silhueta alta e fraturada, coberta por véus cinzentos.',observacoes:'Criatura fictícia para demonstração.'},
    {id:'demo-2',nome:'SENTINELA DE CINZAS',elemento:'Sangue',vd:80,pvMax:120,defesa:19,deslocamento:'6 m',forca:4,agilidade:1,intelecto:1,presenca:1,vigor:3,resistencias:'Defina resistências conforme sua campanha.',ataques:'Impacto de Cinzas — ataque próximo.',habilidades:'Marca Ardente — sinaliza o alvo.',descricao:'Uma armadura vazia por onde escorre fuligem rubra.',observacoes:'Criatura fictícia para demonstração.'},
    {id:'demo-3',nome:'ECO DO LAGO',elemento:'Conhecimento',vd:60,pvMax:75,defesa:16,deslocamento:'6 m / nado',forca:1,agilidade:3,intelecto:4,presenca:4,vigor:1,resistencias:'Vulnerabilidades a definir.',ataques:'Voz Ressonante — efeito narrativo.',habilidades:'Memórias Afogadas — imita vozes esquecidas.',descricao:'Rosto espelhado que se deforma sobre a água.',observacoes:'Criatura fictícia para demonstração.'},
    {id:'demo-4',nome:'VULTO DO SINAL',elemento:'Sinal',vd:90,pvMax:100,defesa:20,deslocamento:'12 m',forca:2,agilidade:4,intelecto:2,presenca:3,vigor:2,resistencias:'Configure conforme o encontro.',ataques:'Descarga Fria — ataque à distância.',habilidades:'Ruído Estático — interfere nas comunicações.',descricao:'Um contorno oscilante de luz que só aparece em telas.',observacoes:'Criatura fictícia para demonstração.'}
  ];
  const blankCombat = () => ({round:1,turnIndex:0,combatants:[]});
  const state = {
    players:[],playerResources:{},monsters:[],rituals:[],monsterMode:demo?'demo':'api', playersOnline:false,
    combat:getSaved('combat',blankCombat()),rules:getSaved('rules',starterRules),
    rulesGroup:'',monsterQuery:'',monsterElement:'',
    session:getSaved('session',demo?{title:'OPERAÇÃO LUA DE GELO',scene:'Os agentes se aproximam de uma estação abandonada. Há marcas de arrasto na plataforma e uma luz vermelha pisca na torre de sinalização.',secrets:'A estação serve de ponto de encontro para a seita. Um registro antigo aponta para um túnel sob os trilhos.',updated:null,clues:[{id:'c1',text:'Investigar o sinal vindo da torre',done:false},{id:'c2',text:'Encontrar a chave da sala de controle',done:true}]}:{title:'',scene:'',secrets:'',updated:null,clues:[]}),
    rolls:getSaved('rolls',[]),activeTab:'visao', editingMonster:null,activeMonster:null,editingRule:null, characterSerial:0
  };
  if(!state.combat || !Array.isArray(state.combat.combatants)) state.combat = blankCombat();
  if(!Array.isArray(state.rules)) state.rules = [...starterRules];
  if(!state.session || typeof state.session !== 'object') state.session={title:'',scene:'',secrets:'',clues:[]};
  if(!Array.isArray(state.session.clues)) state.session.clues=[];
  const RESOURCE_NAMES = {pv:'PV',pe:'PE',san:'SAN'};
  const resourceWrites = new Map();
  let resourceFetchBusy = false;
  let toastTimer;
  function toast(message) { const el=$('toast'); el.textContent=message; el.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{el.hidden=true;},3700); }
  function alertBanner(message) { $('app-alert').textContent=message; $('app-alert').hidden=!message; }
  function stamp() { return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); }
  function saveCombat(){save('combat',state.combat);renderCombat();renderStats();}
  function saveSession(){state.session.updated=stamp();save('session',state.session);renderScene();}
  async function getJson(url){const r=await fetch(url,{cache:'no-store',headers:{'Accept':'application/json'}});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json();}
  function mergeResources(id, remote) {
    const old = state.playerResources[id] || {};
    const next = { ...remote };
    for (const key of Object.keys(RESOURCE_NAMES)) {
      if (resourceWrites.has(`${id}:${key}`) && old[key]) next[key] = old[key];
    }
    state.playerResources[id] = next;
  }
  function resourceSummary(id) {
    const r = state.playerResources[String(id)];
    if (r?.error) return '<p class="resource-alert">RECURSOS: API INDISPONÍVEL</p>';
    const cells = Object.keys(RESOURCE_NAMES).map(key => {
      const obj = r?.[key];
      const current = obj?.current ?? '—';
      const max = obj?.max ?? '—';
      const canEdit = !!obj;
      return `<div class="master-resource master-${key}"><div class="master-resource-label"><span>${RESOURCE_NAMES[key]}</span><strong>${E(current)} / ${E(max)}</strong></div><div class="master-resource-buttons"><button type="button" data-master-player="${E(id)}" data-master-kind="${key}" data-master-delta="-1" aria-label="Diminuir ${key.toUpperCase()}" ${canEdit?'':'disabled'}>−</button><button type="button" data-master-player="${E(id)}" data-master-kind="${key}" data-master-delta="1" aria-label="Aumentar ${key.toUpperCase()}" ${canEdit?'':'disabled'}>+</button></div></div>`;
    }).join('');
    return `<div class="master-resource-grid">${cells}</div>${r && !r.initialized && !r.error ? '<small class="resource-wait">VALORES PADRÃO — O JOGADOR AINDA NÃO INICIALIZOU A FICHA</small>':''}`;
  }
  function refreshCharacterModalResources(){
    const area=$('character-live-resources');
    if(area && state.modalPlayerId!=null) area.innerHTML=`<h3>PV / PE / SAN — SINCRONIZADOS</h3>${resourceSummary(state.modalPlayerId)}`;
  }
  function refreshCombatFromResources(){
    let changed=false;
    for(const c of state.combat.combatants){
      if(c.personagemId==null)continue;
      const id=String(c.personagemId);
      const remote=state.playerResources[id];
      if(!remote?.initialized || resourceWrites.has(`${id}:pv`))continue;
      const pv=remote.pv;
      if(!pv)continue;
      if(c.pv!==pv.current || c.pvMax!==pv.max){c.pv=pv.current;c.pvMax=pv.max;changed=true;}
    }
    if(changed){
      save('combat',state.combat);
      if(!document.activeElement?.closest('#combat-list')) renderCombat();
    }
  }
  async function loadPlayerResources(){
    if(resourceFetchBusy || !state.players.length) return;
    resourceFetchBusy=true;
    try {
      const results=await Promise.all(state.players.map(async p=>{
        const id=String(p.id);
        if(demo){const base=20+N(p.nivel)*2;return [id,{initialized:true,pv:{current:base,max:base},pe:{current:10,max:10},san:{current:30,max:30}}];}
        try { return [id,await getJson(`/api/personagem/personagens/${encodeURIComponent(id)}/recursos`)]; }
        catch(error){console.warn('Não foi possível consultar recursos do personagem '+id,error);return [id,{error:true,initialized:false}];}
      }));
      for(const [id,res] of results)mergeResources(id,res);
      renderPlayers();refreshCharacterModalResources();refreshCombatFromResources();
    } finally {resourceFetchBusy=false;}
  }
  function queueMasterResource(id,key,payload){
    if(demo)return;
    const tag=`${id}:${key}`;
    const prev=resourceWrites.get(tag)||Promise.resolve();
    const job=prev.catch(()=>{}).then(async()=>{
      const r=await fetch(`/api/personagem/personagens/${encodeURIComponent(id)}/recursos/${key}`,{
        method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
      });
      if(!r.ok)throw Error(`HTTP ${r.status}`);
      return r.json();
    });
    resourceWrites.set(tag,job);
    job.then(remote=>{
      if(resourceWrites.get(tag)!==job)return;
      resourceWrites.delete(tag);mergeResources(id,remote);
      renderPlayers();refreshCharacterModalResources();refreshCombatFromResources();
    },error=>{
      console.error('Falha ao salvar recursos:',error);
      if(resourceWrites.get(tag)===job){
        resourceWrites.delete(tag);
        toast('Não foi possível salvar PV/PE/SAN no PostgreSQL.');
        loadPlayerResources();
      }
    });
  }
  function adjustPlayerResource(id,key,delta){
    const remote=state.playerResources[String(id)];
    const value=remote?.[key];
    if(!value)return toast('Recursos indisponíveis; verifique a API.');
    const max=Math.max(1,N(value.max,1));
    const current=Math.max(0,Math.min(max,N(value.current)+N(delta)));
    state.playerResources[String(id)]={...remote,[key]:{current,max},initialized:true};
    renderPlayers();refreshCharacterModalResources();refreshCombatFromResources();
    queueMasterResource(String(id),key,{current,max});
  }
  function syncCombatPlayerPv(combatant){
    if(combatant.personagemId==null || combatant.pv==null)return;
    const id=String(combatant.personagemId);
    const previous=state.playerResources[id];
    if(!previous?.pv)return;
    const max=Math.max(1,N(combatant.pvMax,previous.pv.max));
    const current=Math.max(0,Math.min(max,N(combatant.pv)));
    combatant.pv=current;combatant.pvMax=max;
    state.playerResources[id]={...previous,pv:{current,max},initialized:true};
    renderPlayers();refreshCharacterModalResources();
    queueMasterResource(id,'pv',{current,max});
  }

  async function loadPlayers(){
    if(demo){state.players=demoPlayers.map(x=>({...x}));state.playersOnline=false;renderPlayers();await loadPlayerResources();return;}
    try{const data=await getJson('/api/personagem/personagens');if(!Array.isArray(data))throw Error('Formato inesperado de personagens');state.players=data;state.playersOnline=true;alertBanner('');}
    catch(error){console.error(error);state.players=[];state.playersOnline=false;alertBanner('Não foi possível carregar os personagens de /api/personagem/personagens. Verifique se o Spring Boot está executando.');}
    renderPlayers();renderCombatPicker();await loadPlayerResources();
  }
  async function loadMonsters(){
    if(demo){state.monsters=demoMonsters.map(x=>({...x}));state.monsterMode='demo';}
    else{try{const data=await getJson('/api/mestre/criaturas');if(!Array.isArray(data))throw Error('Resposta de criaturas inválida');state.monsters=data;state.monsterMode='api';}
      catch(error){console.warn('API do bestiário não disponível: usando catálogo local.',error);state.monsterMode='local';state.monsters=getSaved('localMonsters',[]);}}
    renderMonsters();renderCombatPicker();renderStats();
  }
  async function loadRituals(){if(demo){state.rituals=[];return;}try{const data=await getJson('/api/personagem/ritual');state.rituals=Array.isArray(data)?data:[];}catch{state.rituals=[];}}
  function goTab(tab){if(!document.querySelector(`[data-page="${tab}"]`))return;state.activeTab=tab;$$('[data-page]').forEach(x=>x.hidden=x.dataset.page!==tab);$$('.rail-link').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));window.scrollTo({top:0,behavior:'smooth'});if(tab==='bestiario')renderMonsters();if(tab==='combate')renderCombat();if(tab==='regras')renderRules();if(tab==='notas')renderNotes();}
  function renderStats(){
    $('metric-players').textContent=fmt(state.players.length);$('metric-monsters').textContent=fmt(state.monsters.length);$('metric-initiative').textContent=fmt(state.combat.combatants.length);$('metric-round').textContent=fmt(state.combat.round);
    $('connection-state').textContent=demo?'DEMONSTRAÇÃO / DADOS FICTÍCIOS':state.playersOnline?'FICHAS / API CONECTADA':'FICHAS / SEM CONEXÃO';
    $('monster-source').textContent=state.monsterMode==='api'?'BESTIÁRIO / POSTGRESQL':state.monsterMode==='demo'?'DADOS FICTÍCIOS':'BESTIÁRIO / NAVEGADOR';
  }
  function playerHTML(p){
    const attrs=[['FOR',p.forca],['DES',p.destreza],['INT',p.inteligencia],['VON',p.vontade],['FORT',p.fortitude]];
    const initials=String(p.nome||'?').split(/\s+/).slice(0,2).map(s=>s[0]).join('');
    return `<article class="player-card"><div class="player-card-top"><div class="player-avatar">${E(initials)}</div><div style="min-width:0"><h4>${E(p.nome||'SEM NOME')}</h4><p class="player-sub">${E(p.nomeJogador||'Jogador não informado')}</p></div><span class="player-tag">NV ${E(p.nivel??'—')}</span></div><div class="player-stat-grid">${attrs.map(([k,v])=>`<div><span>${k}</span><b>${E(v??'—')}</b></div>`).join('')}</div>${resourceSummary(p.id)}<div class="player-card-bottom"><small>PV / PE / SAN · ${demo?'DEMONSTRAÇÃO':'API COMPARTILHADA'}</small><button class="text-button" type="button" data-character-id="${E(p.id)}">VER FICHA ↗</button></div></article>`;
  }
  function renderPlayers(){
    $('players-count-label').textContent=`${state.players.length} AGENTE(S) CADASTRADO(S)`;
    $('players-grid').innerHTML=state.players.length?state.players.map(playerHTML).join(''):`<div class="empty-state">Nenhuma ficha disponível. Cadastre personagens no módulo Personagens e sincronize aqui.</div>`;
    renderStats();
  }
  function monsterMini(m){return `<div class="monster-mini"><div class="monster-mini-symbol">◈</div><div class="monster-mini-main"><b>${E(m.nome)}</b><small>${E(m.elemento||'SEM ELEMENTO')} · DEF ${E(m.defesa??'—')}</small></div><span class="monster-mini-vd">VD ${E(m.vd??0)}</span></div>`;}
  function renderMonsters(){
    const q=state.monsterQuery.toLocaleLowerCase('pt-BR');const element=state.monsterElement;
    const filtered=state.monsters.filter(m=>(!q||[m.nome,m.habilidades,m.descricao].some(v=>String(v||'').toLocaleLowerCase('pt-BR').includes(q)))&&(!element|| (element==='Outros'?!['Conhecimento','Energia','Morte','Sangue','Medo','Intenção','Sinal'].includes(m.elemento):m.elemento===element)));
    $('monster-grid').innerHTML=filtered.length?filtered.map(m=>`<article class="monster-card"><div class="monster-card-top"><span class="element">◈ ${E(m.elemento||'INDEFINIDO')}</span><span class="vd">VD ${E(m.vd??0)}</span></div><h3>${E(m.nome)}</h3><p class="description">${E(m.descricao||m.habilidades||'Sem descrição cadastrada.')}</p><div class="monster-metrics"><div><small>PV</small><b>${E(m.pvMax??0)}</b></div><div><small>DEF</small><b>${E(m.defesa??0)}</b></div><div><small>AGI</small><b>${E(m.agilidade??0)}</b></div></div><div class="monster-actions"><button class="btn btn-outline" type="button" data-monster-detail="${E(m.id)}">VER FICHA ↗</button><button class="btn btn-red" type="button" data-monster-combat="${E(m.id)}">⚔ CENA</button></div></article>`).join(''):`<div class="empty-state">Nenhuma criatura encontrada. Clique em + Nova Criatura para cadastrar uma ficha.</div>`;
    $('monster-highlights').innerHTML=state.monsters.length?state.monsters.slice(0,3).map(monsterMini).join(''):`<div class="empty-state">Adicione criaturas ao bestiário para consultá-las durante a sessão.</div>`;
    renderStats();
  }
  function renderScene(){
    $('scene-summary').textContent=state.session.scene?.trim() || 'Nenhuma cena anotada. Abra Anotações para preparar sua sessão.';
    $('scene-update').textContent=state.session.updated || 'SEM REGISTRO';$('session-title-small').value=state.session.title||'';
  }
  function renderNotes(){
    $('session-title').value=state.session.title||'';$('session-scene').value=state.session.scene||'';$('session-secrets').value=state.session.secrets||'';
    $('clue-count').textContent=`${state.session.clues.length} PISTAS`;
    $('clue-list').innerHTML=state.session.clues.length?state.session.clues.map(c=>`<div class="clue-row ${c.done?'checked':''}"><input type="checkbox" aria-label="Marcar pista" data-clue-check="${E(c.id)}" ${c.done?'checked':''}><span>${E(c.text)}</span><button type="button" data-clue-remove="${E(c.id)}" title="Remover pista" aria-label="Remover pista">×</button></div>`).join(''):`<p class="small muted">Nenhuma pista registrada.</p>`;
  }
  function renderCombatPicker(){
    const mode=$('combat-source').value;const select=$('combat-select');const isCustom=mode==='livre';select.hidden=isCustom;$('combat-custom-name').hidden=!isCustom;
    if(isCustom)return;
    const objects=mode==='personagem'?state.players:state.monsters;
    select.innerHTML=`<option value="">${objects.length?'Selecione...':'Nenhum registro disponível'}</option>`+objects.map(x=>`<option value="${E(x.id)}">${E(x.nome)}</option>`).join('');
  }
  function renderCombat(){
    const c=state.combat;c.round=Math.max(1,Math.floor(N(c.round,1)));
    if(c.turnIndex>=c.combatants.length)c.turnIndex=0;
    $('encounter-round').textContent=fmt(c.round);const current=c.combatants[c.turnIndex];$('current-turn-name').textContent=current?current.nome:'NENHUM COMBATENTE';$('current-turn-number').textContent=current?`TURNO ${c.turnIndex+1} DE ${c.combatants.length}`:'Adicione participantes para iniciar.';
    $('combat-list').innerHTML=c.combatants.length?c.combatants.map((x,i)=>`<article class="combatant ${i===c.turnIndex?'is-current':''}" data-combat-row="${E(x.uid)}"><div class="combat-order">${fmt(i+1)}</div><div class="combatant-name"><b>${E(x.nome)}</b><small>${E(x.tipo)} ${i===c.turnIndex?' · TURNO ATIVO':''}</small></div><label>INIC<input data-combat-field="init" type="number" value="${E(x.init)}" min="-99" max="999"></label><div class="combatant-hp"><button type="button" data-combat-adjust="-1" data-uid="${E(x.uid)}" title="Diminuir PV">−</button><label>PV<input data-combat-field="pv" type="number" min="0" max="99999" value="${x.pv==null?'':E(x.pv)}" placeholder="—"></label><button type="button" data-combat-adjust="1" data-uid="${E(x.uid)}" title="Aumentar PV">+</button></div><label>MAX<input data-combat-field="pvMax" type="number" min="0" max="99999" value="${x.pvMax==null?'':E(x.pvMax)}" placeholder="—"></label><label>CONDIÇÃO<input class="condition-input" data-combat-field="condicao" value="${E(x.condicao||'')}" placeholder="Ex.: Ferido"></label><button class="combat-remove" type="button" data-combat-remove="${E(x.uid)}" title="Remover da cena" aria-label="Remover combatente">×</button></article>`).join(''):`<div class="empty-state">Encontro vazio. Escolha um personagem, uma criatura ou adicione um participante personalizado.</div>`;
  }
  function addCombatant({nome,tipo='PERSONAGEM',personagemId=null,init=null,pv=null,pvMax=null,condicao=''}){
    if(!nome?.trim())return toast('Informe o nome do combatente.');
    const c=state.combat;const currentUid=c.combatants[c.turnIndex]?.uid;
    const next={uid:`c-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,nome:String(nome).trim(),tipo,personagemId,init:init==null?1+Math.floor(Math.random()*20):N(init),pv:pv==null?null:Math.max(0,N(pv)),pvMax:pvMax==null?null:Math.max(0,N(pvMax)),condicao};
    c.combatants.push(next);c.combatants.sort((a,b)=>b.init-a.init);
    c.turnIndex=currentUid?Math.max(0,c.combatants.findIndex(p=>p.uid===currentUid)):0;
    saveCombat();toast(`${next.nome} entrou na iniciativa.`);
  }
  function addMonsterCombat(m){goTab('combate');addCombatant({nome:m.nome,tipo:'CRIATURA',pv:m.pvMax??null,pvMax:m.pvMax??null});}
  function renderRules(){const filtered=state.rules.filter(r=>!state.rulesGroup||r.grupo===state.rulesGroup);$('rules-grid').innerHTML=filtered.length?filtered.map(r=>`<article class="rule-card"><p class="micro">${E(r.grupo||'Outros')} / REFERÊNCIA</p><h3>${E(r.titulo)}</h3><p>${E(r.conteudo)}</p><div class="rule-actions"><button type="button" data-rule-edit="${E(r.id)}">EDITAR ↗</button><button type="button" data-rule-delete="${E(r.id)}">REMOVER ×</button></div></article>`).join(''):`<div class="empty-state">Nenhuma referência nesta categoria.</div>`;}
  function dice(expression){
    const normalized=String(expression).toLowerCase().replace(/\s+/g,'');
    const tokens=normalized.match(/[+-]?(?:\d*d\d+|\d+)/g);
    if(!tokens?.length||tokens.join('')!==normalized)throw Error('Use expressões como 1d20, 2d6+3 ou 1d8+1d4.');
    let total=0,numberOfDice=0,description=[];
    for(const token of tokens){let sign=1,part=token;if(part.startsWith('+')||part.startsWith('-')){sign=part[0]==='-'?-1:1;part=part.slice(1);}
      if(part.includes('d')){const [countStr,facesStr]=part.split('d');const count=countStr?Number(countStr):1,faces=Number(facesStr);if(!Number.isInteger(count)||count<1||count>100||!Number.isInteger(faces)||faces<2||faces>1000||numberOfDice+count>100)throw Error('Limite de 100 dados e até 1000 faces por dado.');numberOfDice+=count;const rolls=Array.from({length:count},()=>1+Math.floor(Math.random()*faces));const subtotal=rolls.reduce((a,b)=>a+b,0);total+=sign*subtotal;description.push(`${sign<0?'-':''}${count}d${faces}: [${rolls.join(', ')}]`);}
      else{const value=Number(part);if(!Number.isSafeInteger(value)||value>100000)throw Error('Modificador muito alto.');total+=sign*value;description.push(`${sign===-1?'-':'+'}${value}`);}
    }
    return {total,detail:description.join(' · '),expression:normalized};
  }
  function roll(expression){try{const result=dice(expression);$('dice-result').textContent=result.total;$('dice-detail').textContent=result.detail;state.rolls.unshift({...result,time:stamp()});state.rolls=state.rolls.slice(0,20);save('rolls',state.rolls);renderRolls();}catch(error){toast(error.message);}}
  function renderRolls(){$('dice-history').innerHTML=state.rolls.length?state.rolls.slice(0,8).map(r=>`<div class="roll-row"><span>${E(r.expression)} <small>${E(r.time||'')}</small></span><b>${E(r.total)}</b></div>`).join(''):`<p class="small muted">Nenhuma rolagem.</p>`;}
  function openDialog(id){const x=$(id);if(!x.open)x.showModal();}
  function closeDialog(id){const x=$(id);if(x.open)x.close();}
  async function showCharacter(id){const p=state.players.find(x=>String(x.id)===String(id));if(!p)return toast('Personagem não encontrado.');state.modalPlayerId=String(p.id);const serial=++state.characterSerial;
    $('character-modal-name').textContent=p.nome||'PERSONAGEM';$('character-modal-content').innerHTML='<p class="muted">Carregando inventário e habilidades...</p>';openDialog('character-dialog');
    let items=[],abilities={trilhas:[],poderesClasse:[],poderesParanormais:[]};
    if(!demo){const results=await Promise.allSettled([getJson(`/api/personagem/personagens/${p.id}/itens`),getJson(`/api/personagem/personagens/${p.id}/habilidades`)]);if(results[0].status==='fulfilled')items=results[0].value;if(results[1].status==='fulfilled')abilities=results[1].value;}
    else{items=[{nome:'Lanterna',quantidade:1},{nome:'Kit de investigação',quantidade:1}];abilities={trilhas:[{trilhaPersonagem:'Investigador',nomeHabilidadeTrilhaPersonagem:'Atenção Redobrada'}],poderesClasse:[{nomePoderPersonagem:'Observador'}],poderesParanormais:[]};}
    if(serial!==state.characterSerial || !$('character-dialog').open)return;
    const entries=(p.pericias||[]).map(rel=>({nome:rel.pericia?.pericia||rel.nome||'Perícia',valor:rel.valorPericia??rel.valor??0})).sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
    const stats=[['FOR',p.forca],['DES',p.destreza],['INT',p.inteligencia],['VON',p.vontade],['FORT',p.fortitude]];
    $('character-modal-content').innerHTML=`<div class="detail-badges"><span>NÍVEL ${E(p.nivel??'—')}</span><span>JOGADOR: ${E(p.nomeJogador||'—')}</span><span>FICHA #${E(p.id)}</span></div><div class="stat-badges">${stats.map(([k,v])=>`<div><span>${k}</span><strong>${E(v??'—')}</strong></div>`).join('')}</div><section class="modal-section" id="character-live-resources"><h3>PV / PE / SAN — SINCRONIZADOS</h3>${resourceSummary(p.id)}</section><section class="modal-section"><h3>PERÍCIAS (${entries.length})</h3>${entries.length?`<div class="modal-skills">${entries.map(s=>`<div><span>${E(s.nome)}</span><b>${E(s.valor)}</b></div>`).join('')}</div>`:'<p>Sem perícias na ficha.</p>'}</section><section class="modal-section"><h3>INVENTÁRIO (${items.length})</h3>${items.length?items.map(x=>`<p>• ${E(x.nome)} ${x.quantidade!=null?`× ${E(x.quantidade)}`:''}</p>`).join(''):'<p>Sem itens vinculados ou rota indisponível.</p>'}</section><section class="modal-section"><h3>TRILHAS & PODERES</h3>${(abilities.trilhas||[]).map(x=>`<p>◈ ${E(x.trilhaPersonagem)} — ${E(x.nomeHabilidadeTrilhaPersonagem||'')}</p>`).join('')}${(abilities.poderesClasse||[]).map(x=>`<p>✦ ${E(x.nomePoderPersonagem)}</p>`).join('')}${(abilities.poderesParanormais||[]).map(x=>`<p>✧ ${E(x.nomePoderParanormal)}</p>`).join('')||(!abilities.trilhas?.length&&!abilities.poderesClasse?.length&&!abilities.poderesParanormais?.length?'<p>Sem habilidades vinculadas ou rota indisponível.</p>':'')}</section><p class="small muted">PV/PE/SAN são consultados e editados pela API compartilhada. Condições e notas ainda são locais a cada navegador.</p>`;
  }
  function showMonster(id){const m=state.monsters.find(x=>String(x.id)===String(id));if(!m)return toast('Criatura não encontrada.');state.activeMonster=id;$('detail-monster-name').textContent=m.nome;
    const attrs=[['FOR',m.forca],['AGI',m.agilidade],['INT',m.intelecto],['PRE',m.presenca],['VIG',m.vigor]];
    $('monster-detail-content').innerHTML=`<div class="detail-badges"><span>ELEMENTO: ${E(m.elemento||'—')}</span><span>VD ${E(m.vd??'—')}</span><span>PV ${E(m.pvMax??'—')}</span><span>DEFESA ${E(m.defesa??'—')}</span><span>DESLOCAMENTO: ${E(m.deslocamento||'—')}</span></div><div class="stat-badges">${attrs.map(([k,v])=>`<div><span>${k}</span><strong>${E(v??0)}</strong></div>`).join('')}</div>${[['Descrição',m.descricao],['Ataques',m.ataques],['Habilidades',m.habilidades],['Resistências e imunidades',m.resistencias],['Notas do mestre',m.observacoes]].map(([heading,v])=>`<section class="modal-section"><h3>${E(heading)}</h3><p>${E(v||'Não informado.')}</p></section>`).join('')}<button type="button" class="btn btn-outline danger-outline" data-monster-delete="${E(m.id)}">EXCLUIR CRIATURA</button>`;
    openDialog('monster-detail-dialog');
  }
  function showMonsterForm(id){const m=id!=null?state.monsters.find(x=>String(x.id)===String(id)):null;state.editingMonster=m?.id??null;$('monster-modal-heading').textContent=m?'EDITAR CRIATURA':'CADASTRAR CRIATURA';const form=$('monster-form');form.reset();const defaults={vd:0,pvMax:10,defesa:10,forca:1,agilidade:1,intelecto:1,presenca:1,vigor:1};for(const field of $$('[name]',form)){const v=m?.[field.name]??defaults[field.name]??'';field.value=String(v);}
    closeDialog('monster-detail-dialog');openDialog('monster-dialog');
  }
  function monsterPayload(){const form=$('monster-form');const f=new FormData(form);const obj={};for(const [key,value] of f.entries()){obj[key]=String(value).trim();}for(const k of ['vd','pvMax','defesa','forca','agilidade','intelecto','presenca','vigor'])obj[k]=Math.max(0,Math.floor(N(obj[k])));return obj;}
  async function submitMonster(){const record=monsterPayload();if(!record.nome)return toast('Informe o nome da criatura.');
    const id=state.editingMonster;
    if(state.monsterMode==='api'){
      try{const url=id==null?'/api/mestre/criaturas':`/api/mestre/criaturas/${id}`;const r=await fetch(url,{method:id==null?'POST':'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(record)});if(!r.ok)throw Error(`HTTP ${r.status}`);await loadMonsters();}
      catch(err){console.error(err);return toast('Erro ao salvar criatura no PostgreSQL. Consulte o Console.');}
    }else{if(id!=null){const i=state.monsters.findIndex(m=>String(m.id)===String(id));if(i>=0)state.monsters[i]={...state.monsters[i],...record};}else state.monsters.unshift({...record,id:`local-${Date.now()}`});if(state.monsterMode==='local')save('localMonsters',state.monsters);renderMonsters();renderCombatPicker();}
    closeDialog('monster-dialog');toast('Criatura salva com sucesso.');
  }
  async function deleteMonster(id){const m=state.monsters.find(x=>String(x.id)===String(id));if(!m||!confirm(`Excluir ${m.nome} do bestiário?`))return;
    if(state.monsterMode==='api'){try{const r=await fetch(`/api/mestre/criaturas/${id}`,{method:'DELETE'});if(!r.ok)throw Error(`HTTP ${r.status}`);await loadMonsters();}catch(err){console.error(err);return toast('Erro ao excluir criatura no banco.');}}
    else{state.monsters=state.monsters.filter(m=>String(m.id)!==String(id));if(state.monsterMode==='local')save('localMonsters',state.monsters);renderMonsters();renderCombatPicker();}
    closeDialog('monster-detail-dialog');toast('Criatura excluída.');
  }
  function showRuleForm(id){const r=id!=null?state.rules.find(x=>String(x.id)===String(id)):null;state.editingRule=r?.id??null;$('rule-modal-heading').textContent=r?'EDITAR REFERÊNCIA':'NOVA REFERÊNCIA';const form=$('rule-form');form.reset();if(r)for(const el of $$('[name]',form))el.value=r[el.name]||'';openDialog('rule-dialog');}
  function submitRule(){const f=new FormData($('rule-form'));const rule={titulo:String(f.get('titulo')||'').trim(),grupo:String(f.get('grupo')||'Outros'),conteudo:String(f.get('conteudo')||'').trim()};if(!rule.titulo||!rule.conteudo)return toast('Informe título e resumo.');if(state.editingRule){const i=state.rules.findIndex(x=>x.id===state.editingRule);if(i>=0)state.rules[i]={...state.rules[i],...rule};}else state.rules.unshift({...rule,id:`rule-${Date.now()}`});save('rules',state.rules);renderRules();closeDialog('rule-dialog');toast('Referência atualizada neste navegador.');}
  function exportSession(){const payload={produto:'Ordem Up — Escudo do Mestre',exportadoEm:new Date().toISOString(),session:state.session,combat:state.combat,rolls:state.rolls,rules:state.rules,monstersMode:state.monsterMode};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ordem-up-sessao-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Sessão exportada em JSON.');}
  function bind(){
    $$('.rail-link').forEach(btn=>btn.addEventListener('click',()=>goTab(btn.dataset.tab)));
    $$('[data-open-tab]').forEach(btn=>btn.addEventListener('click',()=>goTab(btn.dataset.openTab)));
    $('btn-reload').addEventListener('click',async()=>{await Promise.all([loadPlayers(),loadMonsters(),loadRituals()]);toast('Consulta atualizada.');});
    $('btn-new-monster').addEventListener('click',()=>showMonsterForm(null));
    $('monster-search').addEventListener('input',e=>{state.monsterQuery=e.target.value;renderMonsters();});
    $('monster-element').addEventListener('change',e=>{state.monsterElement=e.target.value;renderMonsters();});
    $('players-grid').addEventListener('click',e=>{
      const adjust=e.target.closest('[data-master-player]');
      if(adjust)return adjustPlayerResource(adjust.dataset.masterPlayer,adjust.dataset.masterKind,N(adjust.dataset.masterDelta));
      const btn=e.target.closest('[data-character-id]');if(btn)showCharacter(btn.dataset.characterId);
    });
    $('character-modal-content').addEventListener('click',e=>{
      const adjust=e.target.closest('[data-master-player]');
      if(adjust)adjustPlayerResource(adjust.dataset.masterPlayer,adjust.dataset.masterKind,N(adjust.dataset.masterDelta));
    });
    $('monster-grid').addEventListener('click',e=>{const detail=e.target.closest('[data-monster-detail]');if(detail)return showMonster(detail.dataset.monsterDetail);const add=e.target.closest('[data-monster-combat]');if(add){const m=state.monsters.find(x=>String(x.id)===add.dataset.monsterCombat);if(m)addMonsterCombat(m);}});
    $('monster-form').addEventListener('submit',async e=>{e.preventDefault();await submitMonster();});
    $('monster-detail-content').addEventListener('click',e=>{const b=e.target.closest('[data-monster-delete]');if(b)deleteMonster(b.dataset.monsterDelete);});
    $('btn-detail-edit').addEventListener('click',()=>showMonsterForm(state.activeMonster));
    $('btn-detail-add').addEventListener('click',()=>{const m=state.monsters.find(x=>String(x.id)===String(state.activeMonster));if(m){closeDialog('monster-detail-dialog');addMonsterCombat(m);}});
    $$('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>{const dialog=btn.closest('dialog');if(dialog?.open)dialog.close();}));
    $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
    $('combat-source').addEventListener('change',renderCombatPicker);
    $('combat-select').addEventListener('change',()=>{const mode=$('combat-source').value;const x=(mode==='personagem'?state.players:state.monsters).find(o=>String(o.id)===$('combat-select').value);$('combat-max-pv').value=mode==='criatura'&&x?.pvMax!=null?x.pvMax:mode==='personagem'?(state.playerResources[String(x?.id)]?.pv?.max??''):'';});
    $('form-add-combatant').addEventListener('submit',e=>{e.preventDefault();const mode=$('combat-source').value;const entity=(mode==='personagem'?state.players:state.monsters).find(o=>String(o.id)===$('combat-select').value);const nome=mode==='livre'?$('combat-custom-name').value.trim():entity?.nome;if(!nome)return toast('Selecione ou informe um participante.');const maxRaw=$('combat-max-pv').value.trim();const existing=mode==='personagem'?state.playerResources[String(entity?.id)]?.pv:null;const pvMax=maxRaw===''?mode==='criatura'?(entity?.pvMax??null):mode==='personagem'?(existing?.max??null):null:Math.max(1,N(maxRaw));const current=mode==='personagem'?(existing?.current!=null ? Math.min(N(existing.current),N(pvMax,existing.max)) : pvMax):pvMax;const initRaw=$('combat-init').value.trim();addCombatant({nome,tipo:mode==='personagem'?'PERSONAGEM':mode==='criatura'?'CRIATURA':'PERSONALIZADO',personagemId:mode==='personagem'?entity.id:null,init:initRaw===''?null:N(initRaw),pv:current,pvMax});$('combat-init').value='';$('combat-max-pv').value='';$('combat-custom-name').value='';});
    $('btn-next-turn').addEventListener('click',()=>{const c=state.combat;if(!c.combatants.length)return toast('A iniciativa está vazia.');c.turnIndex=(c.turnIndex+1)%c.combatants.length;if(c.turnIndex===0)c.round++;saveCombat();});
    $('btn-prev-turn').addEventListener('click',()=>{const c=state.combat;if(!c.combatants.length)return; if(c.turnIndex===0){c.turnIndex=c.combatants.length-1;c.round=Math.max(1,c.round-1);}else c.turnIndex--;saveCombat();});
    $('btn-clear-encounter').addEventListener('click',()=>{if(!confirm('Limpar todos os combatentes e reiniciar a rodada?'))return;state.combat=blankCombat();saveCombat();toast('Encontro reiniciado.');});
    $('combat-list').addEventListener('click',e=>{const remove=e.target.closest('[data-combat-remove]');if(remove){const c=state.combat;const currentUid=c.combatants[c.turnIndex]?.uid;c.combatants=c.combatants.filter(x=>x.uid!==remove.dataset.combatRemove);c.turnIndex=currentUid?Math.max(0,c.combatants.findIndex(x=>x.uid===currentUid)):0;return saveCombat();}const adj=e.target.closest('[data-combat-adjust]');if(adj){const c=state.combat.combatants.find(x=>x.uid===adj.dataset.uid);if(!c)return;if(c.pv==null)return toast('Informe primeiro os PV do combatente.');c.pv=Math.max(0,Math.min(c.pvMax??99999,c.pv+N(adj.dataset.combatAdjust)));saveCombat();syncCombatPlayerPv(c);}});
    $('combat-list').addEventListener('change',e=>{const field=e.target.dataset.combatField;if(!field)return;const row=e.target.closest('[data-combat-row]');const c=state.combat.combatants.find(x=>x.uid===row?.dataset.combatRow);if(!c)return;c[field]=field==='condicao'?e.target.value:field==='pv'&&e.target.value===''?null:Math.max(field==='init'?-99:0,N(e.target.value));if(field==='pv'||field==='pvMax') { if(c.pv!=null && c.pvMax!=null && c.pv>c.pvMax)c.pv=c.pvMax; }if(field==='init'){const uid=state.combat.combatants[state.combat.turnIndex]?.uid;state.combat.combatants.sort((a,b)=>b.init-a.init);state.combat.turnIndex=Math.max(0,state.combat.combatants.findIndex(x=>x.uid===uid));}saveCombat();if(field==='pv'||field==='pvMax')syncCombatPlayerPv(c);});
    $$('[data-dice]').forEach(btn=>btn.addEventListener('click',()=>{$('dice-expression').value=btn.dataset.dice;roll(btn.dataset.dice);}));
    $('dice-form').addEventListener('submit',e=>{e.preventDefault();roll($('dice-expression').value);});
    $('btn-clear-rolls').addEventListener('click',()=>{state.rolls=[];save('rolls',state.rolls);renderRolls();$('dice-result').textContent='—';$('dice-detail').textContent='Histórico limpo.';});
    $('btn-new-rule').addEventListener('click',()=>showRuleForm(null));
    $('rule-form').addEventListener('submit',e=>{e.preventDefault();submitRule();});
    $('rule-filters').addEventListener('click',e=>{const b=e.target.closest('[data-rule-group]');if(!b)return;state.rulesGroup=b.dataset.ruleGroup;$$('[data-rule-group]').forEach(x=>x.classList.toggle('active',x===b));renderRules();});
    $('rules-grid').addEventListener('click',e=>{const edit=e.target.closest('[data-rule-edit]');if(edit)return showRuleForm(edit.dataset.ruleEdit);const del=e.target.closest('[data-rule-delete]');if(del&&confirm('Remover esta referência?')){state.rules=state.rules.filter(r=>String(r.id)!==del.dataset.ruleDelete);save('rules',state.rules);renderRules();}});
    $('session-title').addEventListener('input',e=>{state.session.title=e.target.value;saveSession();});
    $('session-title-small').addEventListener('input',e=>{state.session.title=e.target.value;save('session',state.session);$('session-title').value=state.session.title;});
    $('session-scene').addEventListener('input',e=>{state.session.scene=e.target.value;saveSession();});
    $('session-secrets').addEventListener('input',e=>{state.session.secrets=e.target.value;saveSession();});
    $('form-clue').addEventListener('submit',e=>{e.preventDefault();const text=$('new-clue').value.trim();if(!text)return;state.session.clues.push({id:`clue-${Date.now()}`,text,done:false});$('new-clue').value='';saveSession();renderNotes();});
    $('clue-list').addEventListener('change',e=>{const el=e.target.closest('[data-clue-check]');if(!el)return;const c=state.session.clues.find(x=>String(x.id)===el.dataset.clueCheck);if(c)c.done=el.checked;saveSession();renderNotes();});
    $('clue-list').addEventListener('click',e=>{const b=e.target.closest('[data-clue-remove]');if(!b)return;state.session.clues=state.session.clues.filter(c=>String(c.id)!==b.dataset.clueRemove);saveSession();renderNotes();});
    $('btn-export-session').addEventListener('click',exportSession);
  }
  async function start(){
    $('session-date').textContent=new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).toUpperCase();
    bind();renderScene();renderNotes();renderRolls();renderRules();renderCombat();renderCombatPicker();renderStats();
    if(demo)alertBanner('MODO DEMONSTRAÇÃO — personagens e criaturas fictícios; nenhuma alteração é enviada ao servidor.');
    await Promise.all([loadPlayers(),loadMonsters(),loadRituals()]);
    renderCombatPicker();renderScene();
    setInterval(() => {
      if (!document.hidden && state.players.length) loadPlayerResources().catch(error =>
        console.warn('Falha de atualização automática dos recursos:', error));
    }, 4000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
