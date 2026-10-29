/* ORDEM UP — GERADOR DE LOJA
   Endpoints existentes: GET /api/loja/pequena | /media | /grande
   O modo ?demo=1 utiliza exclusivamente dados fictícios para testar a interface.
*/
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const urls = {
    pequena: '/api/loja/pequena',
    media: '/api/loja/media',
    grande: '/api/loja/grande'
  };
  const configuracoes = {
    pequena: { nome: 'PEQUENA', texto: 'PEQUENA · 5 ITENS · CATEGORIAS 0–II' },
    media: { nome: 'MÉDIA', texto: 'MÉDIA · 8 ITENS · CATEGORIAS 0–III' },
    grande: { nome: 'GRANDE', texto: 'GRANDE · 12 ITENS · CATEGORIAS 0–IV' }
  };
  const modoDemo = new URLSearchParams(window.location.search).get('demo') === '1';
  const estado = { tamanho: 'media', itens: [], vista: 'cards', gerado: false, aguardando: false };

  const exemplos = [
    { nome: 'Pistola de Serviço', categoria: 'I', classificacao: 'Armas', dano: '2d6', critico: '18/x2', alcance: 'Curto', espaco: 1, descricao: 'Equipamento comum de uma operação de campo.' },
    { nome: 'Kit de Primeiros Socorros', categoria: '0', classificacao: 'Itens Gerais', dano: '—', critico: '—', alcance: 'Toque', espaco: 1, descricao: 'Ataduras, antissépticos e suprimentos emergenciais.' },
    { nome: 'Lanterna Tática', categoria: '0', classificacao: 'Itens Gerais', dano: '—', critico: '—', alcance: '—', espaco: 1, descricao: 'Iluminação portátil para ambientes escuros.' },
    { nome: 'Lâmina Ritualística', categoria: 'II', classificacao: 'Armas', dano: '1d6', critico: '19/x2', alcance: 'Corpo a corpo', espaco: 1, descricao: 'Lâmina de origem incerta, marcada com símbolos.' },
    { nome: 'Colete Reforçado', categoria: 'II', classificacao: 'Itens Gerais', dano: '—', critico: '—', alcance: '—', espaco: 2, descricao: 'Uma peça robusta de equipamento defensivo.' },
    { nome: 'Frasco de Recuperação', categoria: 'I', classificacao: 'Poções', dano: '—', critico: '—', alcance: 'Toque', espaco: 0.5, descricao: 'Um líquido vermelho de procedência duvidosa.' },
    { nome: 'Munição Especial', categoria: 'II', classificacao: 'Itens Gerais', dano: '—', critico: '—', alcance: '—', espaco: 1, descricao: 'Um pequeno lote de munição modificada.' },
    { nome: 'Máscara Sem Rosto', categoria: 'III', classificacao: 'Itens Amaldiçoados', dano: '—', critico: '—', alcance: '—', espaco: 1, descricao: 'Sua superfície lisa parece observar o portador.' },
    { nome: 'Amuleto de Âmbar', categoria: 'III', classificacao: 'Maldições', dano: '—', critico: '—', alcance: '—', espaco: 0.5, descricao: 'Brilha discretamente na presença de fenômenos estranhos.' },
    { nome: 'Rifle de Precisão', categoria: 'IV', classificacao: 'Armas', dano: '2d8', critico: '19/x3', alcance: 'Longo', espaco: 2, descricao: 'Arma especializada, difícil de encontrar.' },
    { nome: 'Grimório Lacrado', categoria: 'IV', classificacao: 'Itens Amaldiçoados', dano: '—', critico: '—', alcance: '—', espaco: 1, descricao: 'Páginas protegidas por um selo de cera escura.' },
    { nome: 'Cordas de Escalada', categoria: '0', classificacao: 'Itens Gerais', dano: '—', critico: '—', alcance: '—', espaco: 1, descricao: 'Material de apoio para exploração.' }
  ];

  function texto(valor, padrao = '—') {
    if (valor === undefined || valor === null || String(valor).trim() === '') return padrao;
    return String(valor);
  }
  function node(tag, classe, conteudo) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (conteudo !== undefined) el.textContent = conteudo;
    return el;
  }
  function formatarNumero(numero) { return String(numero).padStart(2, '0'); }
  function normalizarBusca(valor) { return String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function configurarTamanho(tamanho) {
    if (!configuracoes[tamanho] || estado.aguardando) return;
    estado.tamanho = tamanho;
    document.querySelectorAll('[data-tamanho]').forEach((botao) => {
      const ativo = botao.dataset.tamanho === tamanho;
      botao.classList.toggle('selected', ativo);
      botao.setAttribute('aria-pressed', String(ativo));
    });
    $('descricao-tamanho').textContent = configuracoes[tamanho].texto;
    if (!estado.gerado) $('porte-resultado').textContent = configuracoes[tamanho].nome;
  }
  function informar(textoMensagem, tipo = '') {
    const caixa = $('mensagem-geracao');
    caixa.textContent = textoMensagem;
    caixa.className = `form-message ${tipo}`.trim();
  }
  function atualizarStatus(rotulo, tipo = '') {
    $('texto-api').textContent = rotulo;
    $('estado-api').className = `result-status ${tipo}`.trim();
  }
  function itensFiltrados() {
    const filtro = normalizarBusca($('pesquisa-itens').value.trim());
    const categoria = $('filtro-categoria').value;
    return estado.itens.filter((item) => {
      const objeto = [item.nome, item.classificacao, item.categoria, item.descricao].join(' ');
      return (!filtro || normalizarBusca(objeto).includes(filtro)) && (!categoria || texto(item.categoria, '') === categoria);
    });
  }
  function atualizarCategorias() {
    const seletor = $('filtro-categoria');
    const antiga = seletor.value;
    seletor.replaceChildren(node('option', '', 'Todas categorias'));
    seletor.options[0].value = '';
    const categorias = [...new Set(estado.itens.map((item) => texto(item.categoria, 'Sem categoria')))];
    categorias.sort((a,b) => a.localeCompare(b, 'pt-BR', {numeric:true}));
    categorias.forEach((categoria) => {
      const opcao = node('option', '', categoria);
      opcao.value = categoria;
      seletor.appendChild(opcao);
    });
    seletor.value = categorias.includes(antiga) ? antiga : '';
    $('total-categorias').textContent = formatarNumero(categorias.length);
  }
  function estadoVazio(titulo, destaque, descricao, erro = false) {
    const caixa = node('div', 'empty-state mensagem' + (erro ? ' state-error' : ''));
    caixa.appendChild(node('div', 'empty-emblem', erro ? '!' : '✦'));
    caixa.appendChild(node('span', 'empty-index', erro ? 'NO. 404 / SEM RESPOSTA' : 'NO. 000 / ARQUIVO VAZIO'));
    const h = node('h3', '', titulo + ' ');
    h.appendChild(node('em', '', destaque));
    caixa.appendChild(h);
    caixa.appendChild(node('p', '', descricao));
    const linhas = node('div', 'empty-tracks');
    for (let i = 0; i < 3; i++) linhas.appendChild(node('span'));
    linhas.setAttribute('aria-hidden', 'true');
    caixa.appendChild(linhas);
    return caixa;
  }
  function criarInfo(rotulo, valor) {
    const area = node('div');
    area.appendChild(node('span', '', rotulo));
    area.appendChild(node('strong', '', texto(valor)));
    return area;
  }
  function criarCard(item, pos) {
    const art = node('article', 'item');
    art.setAttribute('aria-label', `Item ${pos + 1}: ${texto(item.nome, 'Sem nome')}`);
    const cab = node('div','item-header');
    const esq = node('div');
    esq.appendChild(node('div','item-index', `EQUIPAMENTO // ${formatarNumero(pos + 1)}`));
    esq.appendChild(node('h3','',texto(item.nome,'Item sem nome')));
    cab.appendChild(esq);
    cab.appendChild(node('span','item-category', `CAT. ${texto(item.categoria,'—')}`));
    art.appendChild(cab);
    art.appendChild(node('div','item-class',texto(item.classificacao,'Não classificado')));
    const info = node('div','item-info');
    info.appendChild(criarInfo('DANO', item.dano));
    info.appendChild(criarInfo('CRÍTICO', item.critico));
    info.appendChild(criarInfo('ALCANCE', item.alcance));
    info.appendChild(criarInfo('ESPAÇO', item.espaco));
    art.appendChild(info);
    if (item.descricao) art.appendChild(node('p','item-descricao', texto(item.descricao)));
    return art;
  }
  function criarTabela(lista) {
    const tabela = node('table','inventory-table');
    const cab = node('thead');
    const tr = node('tr');
    ['ITEM', 'CATEGORIA', 'CLASSIFICAÇÃO', 'DANO', 'CRÍTICO', 'ALCANCE', 'ESPAÇO', 'DESCRIÇÃO'].forEach((col) => tr.appendChild(node('th','',col)));
    cab.appendChild(tr); tabela.appendChild(cab);
    const corpo = node('tbody');
    lista.forEach((item) => {
      const linha = node('tr');
      const colunas = [item.nome, item.categoria, item.classificacao, item.dano, item.critico, item.alcance, item.espaco, item.descricao];
      colunas.forEach((dado, i) => {
        const celula = node('td', i === 1 ? 'category-cell' : '');
        if (i === 0) celula.appendChild(node('strong', '', texto(dado, 'Sem nome')));
        else celula.textContent = texto(dado);
        linha.appendChild(celula);
      });
      corpo.appendChild(linha);
    });
    tabela.appendChild(corpo);return tabela;
  }
  function renderizar() {
    const caixa = $('lista-itens');
    caixa.replaceChildren();
    caixa.classList.toggle('table-mode', estado.vista === 'tabela');
    const encontrados = itensFiltrados();
    $('quantidade-itens').textContent = formatarNumero(estado.itens.length);
    $('contagem-filtrada').textContent = `${formatarNumero(encontrados.length)} REGISTROS VISÍVEIS`;
    const permitido = estado.itens.length > 0;
    $('btn-copiar').disabled = !permitido;
    $('btn-exportar').disabled = !permitido;
    if (!estado.gerado) {
      caixa.appendChild(estadoVazio('O ESTOQUE', 'AINDA ESTÁ VAZIO.', 'Selecione o porte do estabelecimento e clique em GERAR INVENTÁRIO.'));
    } else if (estado.itens.length === 0) {
      caixa.appendChild(estadoVazio('NENHUM ITEM', 'ENCONTRADO.', 'A API retornou uma lista vazia. Verifique os itens cadastrados e as categorias aceitas pela loja.'));
    } else if (encontrados.length === 0) {
      caixa.appendChild(estadoVazio('NENHUM ITEM', 'NESSE FILTRO.', 'Altere a pesquisa ou selecione outra categoria para ver os equipamentos disponíveis.'));
    } else if (estado.vista === 'tabela') {
      caixa.appendChild(criarTabela(encontrados));
    } else {
      encontrados.forEach((item, pos) => caixa.appendChild(criarCard(item, pos)));
    }
  }
  function renderizarErro(erro) {
    console.error('Falha ao gerar loja:', erro);
    $('lista-itens').replaceChildren(estadoVazio('CONEXÃO', 'INTERROMPIDA.', `Não foi possível consultar ${urls[estado.tamanho]}. Verifique o servidor Spring Boot e tente novamente.`, true));
    $('quantidade-itens').textContent = '00';
    $('total-categorias').textContent = '00';
    $('contagem-filtrada').textContent = '00 REGISTROS VISÍVEIS';
    atualizarStatus('ERRO DE CONEXÃO', 'error');
    informar('Falha ao buscar os itens da loja. Consulte o Console (F12) para detalhes.', 'error');
  }
  function montarDemo(tamanho) {
    // Apenas para prévia: não representa dados reais do banco de dados.
    const permitidas = { pequena: ['0','I','II'], media: ['0','I','II','III'], grande: ['0','I','II','III','IV'] }[tamanho];
    const total = { pequena: 5, media: 8, grande: 12 }[tamanho];
    const lista = exemplos.filter((item) => permitidas.includes(item.categoria));
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista.slice(0, total);
  }
  async function gerarLoja() {
    if (estado.aguardando) return;
    const tamanhoPedido = estado.tamanho;
    estado.aguardando = true;
    $('btn-gerar').disabled = true;
    $('texto-gerar').textContent = 'SORTEANDO ESTOQUE...';
    atualizarStatus('CONSULTANDO CATÁLOGO');
    informar('Buscando os equipamentos da loja...');
    try {
      let lista;
      if (modoDemo) {
        lista = montarDemo(tamanhoPedido);
      } else {
        const resposta = await fetch(urls[tamanhoPedido], { method: 'GET', headers: {Accept: 'application/json'} });
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}: ${urls[tamanhoPedido]}`);
        const json = await resposta.json();
        lista = Array.isArray(json) ? json : (json?.itens ?? json?.content ?? json?.resultado);
      }
      if (!Array.isArray(lista)) throw new Error('A API deve retornar uma lista JSON de itens (ou objeto com "itens").');
      estado.itens = lista.filter((item) => item && typeof item === 'object');
      estado.gerado = true;
      $('pesquisa-itens').value = '';
      $('filtro-categoria').value = '';
      $('porte-resultado').textContent = configuracoes[tamanhoPedido].nome;
      $('subtitulo-resultado').textContent = `Estoque ${configuracoes[tamanhoPedido].nome.toLowerCase()} gerado ${modoDemo ? 'em modo demonstrativo' : 'pelo servidor'} — pronto para consulta.`;
      atualizarCategorias();
      renderizar();
      atualizarStatus(modoDemo ? 'MODO DEMONSTRAÇÃO' : 'ESTOQUE GERADO', 'ready');
      informar(estado.itens.length ? `${estado.itens.length} itens encontrados. Você pode pesquisar, copiar ou exportar a lista.` : 'O sistema não encontrou itens disponíveis.', 'success');
    } catch (erro) {
      estado.itens = [];
      estado.gerado = false;
      renderizarErro(erro);
    } finally {
      estado.aguardando = false;
      $('btn-gerar').disabled = false;
      $('texto-gerar').textContent = 'GERAR OUTRA LOJA';
    }
  }
  function mudarVista(vista) {
    estado.vista = vista;
    [['cards','vista-cards'], ['tabela','vista-tabela']].forEach(([tipo,id]) => {
      const ativo = vista === tipo;
      $(id).classList.toggle('active', ativo);
      $(id).setAttribute('aria-pressed', String(ativo));
    });
    renderizar();
  }
  function textoExportacao() {
    const cab = [`ORDEM UP — INVENTÁRIO DA LOJA`, `Porte: ${configuracoes[estado.tamanho].nome}`, `Quantidade: ${estado.itens.length}`, ''];
    const corpo = estado.itens.flatMap((item,i) => [
      `${i+1}. ${texto(item.nome, 'Sem nome')} | Categoria: ${texto(item.categoria)} | ${texto(item.classificacao)}`,
      `Dano: ${texto(item.dano)} | Crítico: ${texto(item.critico)} | Alcance: ${texto(item.alcance)} | Espaço: ${texto(item.espaco)}`,
      `Descrição: ${texto(item.descricao)}`,'']);
    return [...cab,...corpo].join('\n');
  }
  async function copiarLista() {
    const saida = textoExportacao();
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(saida);
      else {
        const area = node('textarea'); area.value = saida; area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.appendChild(area); area.select();
        if (!document.execCommand('copy')) throw new Error('Não foi possível copiar');
        area.remove();
      }
      informar('Lista copiada para a área de transferência.', 'success');
    } catch (erro) {
      console.error(erro); informar('O navegador bloqueou a cópia. Use Exportar TXT.', 'error');
    }
  }
  function exportar() {
    const arquivo = new Blob(['\uFEFF', textoExportacao()], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(arquivo);
    const a = document.createElement('a');a.href=url;a.download=`ordem-up-loja-${estado.tamanho}.txt`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    informar('Arquivo TXT preparado para download.', 'success');
  }
  document.querySelectorAll('[data-tamanho]').forEach((botao) => botao.addEventListener('click', () => configurarTamanho(botao.dataset.tamanho)));
  $('btn-gerar').addEventListener('click', gerarLoja);
  $('pesquisa-itens').addEventListener('input', renderizar);
  $('filtro-categoria').addEventListener('change', renderizar);
  $('vista-cards').addEventListener('click', () => mudarVista('cards'));
  $('vista-tabela').addEventListener('click', () => mudarVista('tabela'));
  $('btn-copiar').addEventListener('click', copiarLista);
  $('btn-exportar').addEventListener('click', exportar);
  configurarTamanho('media');
  if (modoDemo) gerarLoja();
})();
