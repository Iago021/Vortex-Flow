(function () {
  "use strict";

  var pagina = location.pathname.split("/").pop() || "index.html";
  var agora = new Date();
  var hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 12);
  var CHAVE_OPERACOES = "kemetforge_operacoes_v2";
  var CHAVE_DADOS = "kemetforge_dados_v1";
  var meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var mesesTitulo = meses.map(function (mes) { return mes.charAt(0).toUpperCase() + mes.slice(1); });
  var calendarioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 12);
  var calendarioDia = dataIso(hoje);
  var filtroAgenda = "Todos";
  var receitaAtiva = "Bolo de Chocolate";

  function selecionar(seletor, raiz) {
    return (raiz || document).querySelector(seletor);
  }

  function selecionarTodos(seletor, raiz) {
    return Array.prototype.slice.call((raiz || document).querySelectorAll(seletor));
  }

  function normalizar(texto) {
    return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function capitalizar(texto) {
    texto = String(texto || "");
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function adicionarDias(data, quantidade) {
    var nova = new Date(data);
    nova.setDate(nova.getDate() + quantidade);
    return nova;
  }

  function dataIso(data) {
    return data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0") + "-" + String(data.getDate()).padStart(2, "0");
  }

  function lerDataIso(valor) {
    var partes = String(valor || "").split("-").map(Number);
    return partes.length === 3 ? new Date(partes[0], partes[1] - 1, partes[2], 12) : new Date(hoje);
  }

  function dataCurta(data, comAno) {
    return String(data.getDate()).padStart(2, "0") + "/" + String(data.getMonth() + 1).padStart(2, "0") + (comAno ? "/" + data.getFullYear() : "");
  }

  function dataLonga(data, comSemana) {
    var opcoes = comSemana ? { weekday: "long", day: "numeric", month: "long" } : { day: "numeric", month: "long" };
    return capitalizar(new Intl.DateTimeFormat("pt-BR", opcoes).format(data));
  }

  function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function numeroMoeda(texto) {
    var limpo = String(texto || "").replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
    return Number(limpo) || 0;
  }

  function lerJson(chave, padrao) {
    try {
      var valor = JSON.parse(localStorage.getItem(chave) || "{}");
      return valor && typeof valor === "object" ? valor : padrao;
    } catch (erro) {
      return padrao;
    }
  }

  function dadosOperacoesIniciais() {
    return {
      entradasProdutos: [],
      compras: [],
      ingredientes: [],
      movimentacoes: [],
      receitasEditadas: []
    };
  }

  function carregarOperacoes() {
    var padrao = dadosOperacoesIniciais();
    var salvo = lerJson(CHAVE_OPERACOES, {});
    Object.keys(padrao).forEach(function (chave) {
      if (Array.isArray(salvo[chave])) padrao[chave] = salvo[chave];
    });
    return padrao;
  }

  var operacoes = carregarOperacoes();

  function salvarOperacoes() {
    try {
      localStorage.setItem(CHAVE_OPERACOES, JSON.stringify(operacoes));
      return true;
    } catch (erro) {
      avisar("Não foi possível salvar os dados neste navegador.");
      return false;
    }
  }

  var tempoAviso;
  function avisar(mensagem) {
    var aviso = selecionar("[data-aviso]");
    if (!aviso) {
      aviso = document.createElement("div");
      aviso.className = "aviso";
      aviso.dataset.aviso = "";
      aviso.setAttribute("role", "status");
      aviso.setAttribute("aria-live", "polite");
      document.body.appendChild(aviso);
    }
    aviso.textContent = mensagem;
    aviso.classList.add("visivel");
    window.clearTimeout(tempoAviso);
    tempoAviso = window.setTimeout(function () { aviso.classList.remove("visivel"); }, 3400);
  }

  function criarModal(titulo) {
    var focoAnterior = document.activeElement;
    var fundo = document.createElement("div");
    fundo.className = "modal-fundo";
    fundo.dataset.modalRevisao = "";

    var modal = document.createElement("section");
    modal.className = "modal app-card modal-revisao";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "titulo-modal-revisao");

    var topo = document.createElement("div");
    topo.className = "modal-topo";
    var h2 = document.createElement("h2");
    h2.id = "titulo-modal-revisao";
    h2.textContent = titulo;
    var fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "fechar-modal";
    fechar.setAttribute("aria-label", "Fechar");
    fechar.textContent = "×";
    topo.appendChild(h2);
    topo.appendChild(fechar);
    modal.appendChild(topo);
    fundo.appendChild(modal);

    function encerrar() {
      document.removeEventListener("keydown", aoTeclado, true);
      document.body.classList.remove("modal-aberto-revisao");
      fundo.remove();
      if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
    }

    function aoTeclado(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        encerrar();
      }
    }

    fechar.addEventListener("click", encerrar);
    fundo.addEventListener("click", function (evento) {
      if (evento.target === fundo) encerrar();
    });
    document.addEventListener("keydown", aoTeclado, true);
    document.body.classList.add("modal-aberto-revisao");
    document.body.appendChild(fundo);
    window.setTimeout(function () { fechar.focus(); }, 0);
    return { fundo: fundo, modal: modal, fechar: encerrar };
  }

  function criarCampo(configuracao) {
    var rotulo = document.createElement("label");
    rotulo.className = "campo-compacto" + (configuracao.largo ? " campo-largo" : "");
    var texto = document.createElement("span");
    texto.textContent = configuracao.rotulo;
    rotulo.appendChild(texto);

    var controle;
    if (configuracao.tipo === "select") {
      controle = document.createElement("select");
      (configuracao.opcoes || []).forEach(function (opcao) {
        var item = document.createElement("option");
        item.value = typeof opcao === "string" ? opcao : opcao.valor;
        item.textContent = typeof opcao === "string" ? opcao : opcao.rotulo;
        controle.appendChild(item);
      });
    } else if (configuracao.tipo === "textarea") {
      controle = document.createElement("textarea");
      controle.rows = configuracao.linhas || 4;
    } else {
      controle = document.createElement("input");
      controle.type = configuracao.tipo || "text";
      if (configuracao.min !== undefined) controle.min = configuracao.min;
      if (configuracao.max !== undefined) controle.max = configuracao.max;
      if (configuracao.step !== undefined) controle.step = configuracao.step;
    }
    controle.name = configuracao.nome;
    controle.required = configuracao.obrigatorio !== false;
    if (configuracao.valor !== undefined && configuracao.valor !== null) controle.value = configuracao.valor;
    if (configuracao.placeholder) controle.placeholder = configuracao.placeholder;
    rotulo.appendChild(controle);
    return rotulo;
  }

  function abrirFormulario(configuracao, aoSalvar) {
    var base = criarModal(configuracao.titulo);
    var formulario = document.createElement("form");
    formulario.className = "mini-form";
    var grade = document.createElement("div");
    grade.className = "form-grade";
    (configuracao.campos || []).forEach(function (campo) { grade.appendChild(criarCampo(campo)); });
    formulario.appendChild(grade);

    var acoes = document.createElement("div");
    acoes.className = "topo-acoes acoes-modal";
    var cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "app-botao secundario";
    cancelar.textContent = "Cancelar";
    var salvar = document.createElement("button");
    salvar.type = "submit";
    salvar.className = "app-botao";
    salvar.textContent = configuracao.rotuloSalvar || "Salvar";
    acoes.appendChild(cancelar);
    acoes.appendChild(salvar);
    formulario.appendChild(acoes);
    base.modal.appendChild(formulario);

    cancelar.addEventListener("click", base.fechar);
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }
      var registro = {};
      (configuracao.campos || []).forEach(function (campo) {
        var controle = formulario.elements[campo.nome];
        var valor = controle ? controle.value.trim() : "";
        if (campo.tipo === "number") valor = Number(valor || 0);
        registro[campo.nome] = valor;
      });
      registro.id = Date.now();
      registro.criadoEm = new Date().toISOString();
      if (aoSalvar(registro) !== false) base.fechar();
    });

    var primeiro = selecionar("input, select, textarea", formulario);
    if (primeiro) window.setTimeout(function () { primeiro.focus(); }, 20);
  }

  function abrirRelatorio(titulo, linhas, acoesExtras) {
    var base = criarModal(titulo);
    var lista = document.createElement("div");
    lista.className = "lista-relatorio";
    if (!linhas.length) {
      var vazio = document.createElement("p");
      vazio.className = "agenda-vazia";
      vazio.textContent = "Ainda não há registros para exibir.";
      lista.appendChild(vazio);
    } else {
      linhas.forEach(function (linha) {
        var item = document.createElement("div");
        var rotulo = document.createElement("span");
        rotulo.textContent = linha[0];
        var valor = document.createElement("strong");
        valor.textContent = linha[1];
        item.appendChild(rotulo);
        item.appendChild(valor);
        lista.appendChild(item);
      });
    }
    base.modal.appendChild(lista);
    var acoes = document.createElement("div");
    acoes.className = "topo-acoes acoes-modal";
    (acoesExtras || []).forEach(function (extra) {
      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "app-botao" + (extra.secundario ? " secundario" : "");
      botao.textContent = extra.rotulo;
      botao.addEventListener("click", function () { extra.acao(base); });
      acoes.appendChild(botao);
    });
    var concluir = document.createElement("button");
    concluir.type = "button";
    concluir.className = "app-botao";
    concluir.textContent = "Concluir";
    concluir.addEventListener("click", base.fechar);
    acoes.appendChild(concluir);
    base.modal.appendChild(acoes);
  }

  function nomesDaTabela(seletorTabela, indice) {
    return selecionarTodos(seletorTabela + " tbody tr").map(function (linha) {
      return linha.cells[indice] ? linha.cells[indice].textContent.trim() : "";
    }).filter(Boolean).filter(function (nome, posicao, lista) { return lista.indexOf(nome) === posicao; });
  }

  function nomesProdutos() {
    var nomes = nomesDaTabela(".produtos-workspace .tabela-dados", 0);
    return nomes.length ? nomes : ["Bolo de Chocolate", "Brigadeiro Gourmet", "Pavê Tradicional", "Café Cremoso"];
  }

  function nomesIngredientes() {
    var nomes = nomesDaTabela(".ingredientes-workspace .tabela-dados", 1);
    operacoes.ingredientes.forEach(function (item) {
      if (nomes.indexOf(item.nome) < 0) nomes.push(item.nome);
    });
    return nomes.length ? nomes : ["Farinha de trigo", "Leite integral", "Açúcar refinado", "Chocolate em pó"];
  }

  function reaplicarFiltroAtivo() {
    var ativo = selecionar("[data-filtro].ativo");
    if (ativo) ativo.dispatchEvent(new Event("click", { bubbles: true }));
  }

  function atualizarSaudacao() {
    var saudacao = selecionar(".dashboard-boas-vindas h1 span");
    if (!saudacao) return;
    var hora = new Date().getHours();
    saudacao.textContent = hora < 12 ? "Bom dia." : hora < 18 ? "Boa tarde." : "Boa noite.";
  }

  function atualizarPrimeiraCelula(seletor, deslocamentos) {
    selecionarTodos(seletor).forEach(function (linha, indice) {
      if (!linha.cells.length) return;
      var data = adicionarDias(hoje, -(deslocamentos[indice] || 0));
      var texto = linha.cells[0].textContent;
      var separador = texto.indexOf("•");
      var horario = separador >= 0 ? " • " + texto.slice(separador + 1).trim() : "";
      linha.cells[0].textContent = dataCurta(data, false) + horario;
      linha.dataset.data = dataIso(data);
    });
  }

  function atualizarDatasDaInterface() {
    atualizarSaudacao();

    var campoVenda = selecionar('.vendas-workspace') ? selecionar('.pagina-ferramentas input[type="date"]') : null;
    if (campoVenda) {
      campoVenda.value = dataIso(hoje);
      selecionarTodos(".vendas-workspace .tabela-dados tbody tr:not(.registro-salvo)").forEach(function (linha) {
        linha.dataset.data = dataIso(hoje);
      });
      var tituloVenda = selecionar(".vendas-workspace .modulo-cabecalho h2");
      if (tituloVenda) tituloVenda.textContent = dataLonga(hoje, true);
      campoVenda.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (pagina === "perdas.html") {
      atualizarPrimeiraCelula(".perdas-workspace .tabela-dados tbody tr:not(.registro-salvo)", [0, 0, 1, 3, 5]);
      var inicio = adicionarDias(hoje, -6);
      var periodo = selecionar(".pagina-ferramentas > .status");
      if (periodo) {
        periodo.textContent = inicio.getMonth() === hoje.getMonth()
          ? inicio.getDate() + " a " + hoje.getDate() + " de " + meses[hoje.getMonth()]
          : dataCurta(inicio, false) + " a " + dataCurta(hoje, false);
      }
      var blocoPeriodo = selecionar("[data-periodo-perdas]");
      if (blocoPeriodo) {
        var inicioCampo = selecionar("[data-periodo-inicio]", blocoPeriodo);
        var fimCampo = selecionar("[data-periodo-fim]", blocoPeriodo);
        if (inicioCampo) inicioCampo.value = dataIso(new Date(hoje.getFullYear(), hoje.getMonth(), 1, 12));
        if (fimCampo) fimCampo.value = dataIso(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 12));
      }
    }

    if (pagina === "estoque.html") atualizarPrimeiraCelula(".estoque-workspace .tabela-dados tbody tr:not(.registro-revisao)", [0, 0, 0, 1]);
    if (pagina === "financeiro.html") {
      atualizarPrimeiraCelula(".movimentacoes-financeiras tbody tr:not(.registro-salvo)", [0, 0, 1, 2]);
      var fluxo = selecionar(".fluxo-caixa .modulo-cabecalho h2");
      if (fluxo) fluxo.textContent = "Fluxo de caixa • " + meses[hoje.getMonth()];
    }
    if (pagina === "ingredientes.html") {
      var linhasIngrediente = selecionarTodos(".ingredientes-workspace tbody tr");
      if (linhasIngrediente[1] && linhasIngrediente[1].cells[4]) linhasIngrediente[1].cells[4].textContent = dataCurta(adicionarDias(hoje, 3), true);
      var dataCompra = selecionar(".ingredientes-workspace .resumo-lateral .indicador-linha strong");
      if (dataCompra) dataCompra.textContent = dataCurta(hoje, true);
    }
  }

  function criarCelula(linha, texto, classe) {
    var celula = document.createElement("td");
    celula.textContent = texto;
    if (classe) celula.className = classe;
    linha.appendChild(celula);
    return celula;
  }

  function statusIngrediente(registro) {
    if (Number(registro.atual) <= Number(registro.minimo)) return { texto: "Baixo", classe: " alerta" };
    if (registro.validade) {
      var diferenca = (lerDataIso(registro.validade) - hoje) / 86400000;
      if (diferenca >= 0 && diferenca <= 7) return { texto: "Vence em " + Math.ceil(diferenca) + " dias", classe: " alerta" };
    }
    return { texto: "Normal", classe: "" };
  }

  function renderizarIngredientes() {
    var corpo = selecionar(".ingredientes-workspace .tabela-dados tbody");
    if (!corpo) return;
    selecionarTodos(".registro-revisao", corpo).forEach(function (item) { item.remove(); });
    operacoes.ingredientes.forEach(function (registro, indice) {
      var linha = document.createElement("tr");
      linha.className = "registro-revisao";
      criarCelula(linha, "ING-" + String(indice + 5).padStart(3, "0"));
      criarCelula(linha, registro.nome);
      criarCelula(linha, registro.atual + " " + registro.unidade + " / " + registro.minimo + " " + registro.unidade);
      criarCelula(linha, moeda(registro.custoBase) + "/" + registro.unidade);
      criarCelula(linha, dataCurta(lerDataIso(registro.validade), true));
      criarCelula(linha, registro.lote);
      criarCelula(linha, registro.fornecedor);
      var status = statusIngrediente(registro);
      var celulaStatus = document.createElement("td");
      var etiqueta = document.createElement("span");
      etiqueta.className = "status" + status.classe;
      etiqueta.textContent = status.texto;
      celulaStatus.appendChild(etiqueta);
      linha.appendChild(celulaStatus);
      corpo.appendChild(linha);
    });
    renderizarCompraRecente();
  }

  function renderizarCompraRecente() {
    var lateral = selecionar(".ingredientes-workspace .resumo-lateral");
    if (!lateral) return;
    var existente = selecionar("[data-compra-recente]", lateral);
    if (existente) existente.remove();
    var registro = operacoes.compras.slice().sort(function (a, b) { return String(b.criadoEm).localeCompare(String(a.criadoEm)); })[0];
    if (!registro) return;
    var bloco = document.createElement("div");
    bloco.className = "registro-recente";
    bloco.dataset.compraRecente = "";
    var pequeno = document.createElement("small");
    pequeno.textContent = "Última compra registrada";
    var forte = document.createElement("strong");
    forte.textContent = registro.ingrediente + " • " + registro.quantidade + " " + registro.unidade;
    var detalhe = document.createElement("span");
    detalhe.textContent = registro.fornecedor + " • " + moeda(registro.valor);
    bloco.appendChild(pequeno);
    bloco.appendChild(forte);
    bloco.appendChild(detalhe);
    var botao = selecionar("button.largura-total", lateral);
    lateral.insertBefore(bloco, botao || null);
  }

  function renderizarEntradasProdutos() {
    var linhas = selecionarTodos(".produtos-workspace .tabela-dados tbody tr");
    linhas.forEach(function (linha) {
      if (!linha.cells[2]) return;
      if (!linha.dataset.quantidadeBase) linha.dataset.quantidadeBase = String(parseInt(linha.cells[2].textContent, 10) || 0);
      var nome = normalizar(linha.cells[0].textContent);
      var adicionado = operacoes.entradasProdutos.reduce(function (total, entrada) {
        return total + (normalizar(entrada.item) === nome ? Number(entrada.quantidade || 0) : 0);
      }, 0);
      linha.cells[2].innerHTML = "";
      var forte = document.createElement("strong");
      forte.textContent = (Number(linha.dataset.quantidadeBase) + adicionado) + " un.";
      linha.cells[2].appendChild(forte);
    });
  }

  function registroParaMovimento(registro, tipo) {
    if (tipo === "compra") {
      return {
        criadoEm: registro.criadoEm,
        data: registro.data,
        item: registro.ingrediente,
        inicial: "—",
        entrada: String(registro.quantidade),
        saida: "—",
        saldo: "—",
        unidade: registro.unidade,
        valor: registro.valor,
        origem: "Compra",
        classe: ""
      };
    }
    var entrada = registro.tipo === "Entrada" ? registro.quantidade : "—";
    var saldo = registro.tipo === "Ajuste" ? registro.saldo : Number(registro.inicial || 0) + Number(registro.quantidade || 0);
    return {
      criadoEm: registro.criadoEm,
      data: registro.data,
      item: registro.item,
      inicial: registro.tipo === "Entrada" ? registro.inicial : "—",
      entrada: entrada,
      saida: "—",
      saldo: saldo,
      unidade: registro.unidade,
      valor: registro.valor,
      origem: registro.tipo,
      classe: registro.tipo === "Ajuste" ? " alerta" : ""
    };
  }

  function renderizarMovimentacoes() {
    var corpo = selecionar(".estoque-workspace .tabela-dados tbody");
    if (!corpo) return;
    selecionarTodos(".registro-revisao", corpo).forEach(function (item) { item.remove(); });
    var registros = operacoes.movimentacoes.map(function (item) { return registroParaMovimento(item, "movimento"); })
      .concat(operacoes.compras.map(function (item) { return registroParaMovimento(item, "compra"); }))
      .sort(function (a, b) { return String(b.criadoEm).localeCompare(String(a.criadoEm)); });
    var fragmento = document.createDocumentFragment();
    registros.forEach(function (registro) {
      var linha = document.createElement("tr");
      linha.className = "registro-revisao";
      criarCelula(linha, dataCurta(lerDataIso(registro.data), false) + " • " + new Date(registro.criadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      criarCelula(linha, registro.item);
      criarCelula(linha, String(registro.inicial));
      criarCelula(linha, String(registro.entrada), registro.entrada !== "—" ? "bom" : "");
      criarCelula(linha, String(registro.saida));
      var saldo = criarCelula(linha, String(registro.saldo));
      saldo.innerHTML = "<strong>" + String(registro.saldo) + "</strong>";
      criarCelula(linha, registro.unidade);
      criarCelula(linha, moeda(registro.valor));
      var origem = document.createElement("td");
      var status = document.createElement("span");
      status.className = "status" + registro.classe;
      status.textContent = registro.origem;
      origem.appendChild(status);
      linha.appendChild(origem);
      fragmento.appendChild(linha);
    });
    corpo.insertBefore(fragmento, corpo.firstChild);
  }

  var receitasPadrao = {
    "Bolo de Chocolate": {
      nome: "Bolo de Chocolate", rendimento: 12, unidade: "fatias", custo: 19.20,
      ingredientes: [
        ["Farinha de trigo", "500 g", "R$ 0,004/g", "R$ 2,00"],
        ["Açúcar refinado", "300 g", "R$ 0,005/g", "R$ 1,50"],
        ["Leite integral", "250 ml", "R$ 0,006/ml", "R$ 1,50"],
        ["Chocolate em pó", "180 g", "R$ 0,029/g", "R$ 5,22"],
        ["Ovos", "4 un.", "R$ 0,85/un.", "R$ 3,40"]
      ]
    },
    "Brigadeiro Gourmet": {
      nome: "Brigadeiro Gourmet", rendimento: 30, unidade: "unidades", custo: 13.50,
      ingredientes: [
        ["Leite condensado", "395 g", "R$ 0,018/g", "R$ 7,11"],
        ["Chocolate em pó", "60 g", "R$ 0,029/g", "R$ 1,74"],
        ["Manteiga", "20 g", "R$ 0,045/g", "R$ 0,90"],
        ["Granulado", "120 g", "R$ 0,026/g", "R$ 3,12"]
      ]
    },
    "Pavê Tradicional": {
      nome: "Pavê Tradicional", rendimento: 10, unidade: "porções", custo: 16.80,
      ingredientes: [
        ["Leite integral", "700 ml", "R$ 0,006/ml", "R$ 4,20"],
        ["Leite condensado", "395 g", "R$ 0,018/g", "R$ 7,11"],
        ["Biscoito", "250 g", "R$ 0,014/g", "R$ 3,50"],
        ["Amido de milho", "40 g", "R$ 0,012/g", "R$ 0,48"]
      ]
    }
  };

  function receitaPorNome(nome) {
    var editada = operacoes.receitasEditadas.slice().reverse().find(function (item) {
      return normalizar(item.original || item.nome) === normalizar(nome);
    });
    return editada || receitasPadrao[nome] || null;
  }

  function linhasIngredientesDaReceita(registro) {
    if (Array.isArray(registro.ingredientes)) return registro.ingredientes;
    return String(registro.ingredientes || "").split(/\n|,/).map(function (item) {
      return item.trim();
    }).filter(Boolean).map(function (item) { return [item, "Informado", "—", "—"]; });
  }

  function renderizarReceitaDetalhe(registro) {
    var ficha = selecionar(".ficha-tecnica");
    if (!ficha || !registro) return;
    receitaAtiva = registro.original || registro.nome;
    var titulo = selecionar(".modulo-cabecalho h2", ficha);
    var subtitulo = selecionar(".modulo-cabecalho small", ficha);
    if (titulo) titulo.textContent = registro.nome;
    if (subtitulo) subtitulo.textContent = "Rende " + registro.rendimento + " " + registro.unidade;
    var corpo = selecionar("tbody", ficha);
    if (corpo) {
      corpo.innerHTML = "";
      linhasIngredientesDaReceita(registro).forEach(function (ingrediente) {
        var linha = document.createElement("tr");
        ingrediente.forEach(function (valor) { criarCelula(linha, valor); });
        corpo.appendChild(linha);
      });
    }
    var custo = Number(registro.custo || 0);
    var totais = selecionarTodos(".ficha-rodape strong", ficha);
    if (totais[0]) totais[0].textContent = moeda(custo * .71);
    if (totais[1]) totais[1].textContent = moeda(custo * .29);
    if (totais[2]) totais[2].textContent = moeda(custo);
    var resumo = selecionar(".ficha-resumo");
    if (resumo) {
      var calculo = selecionar(".calculo-destaque", resumo);
      var porcao = registro.rendimento ? custo / Number(registro.rendimento) : custo;
      if (calculo) {
        var conta = selecionar("small", calculo);
        var unitario = selecionar("strong", calculo);
        if (conta) conta.textContent = moeda(custo) + " ÷ " + registro.rendimento + " " + registro.unidade;
        if (unitario) unitario.textContent = moeda(porcao) + " por unidade";
      }
    }
  }

  function selecionarReceita(botao) {
    var nomeElemento = selecionar("strong", botao);
    var nome = nomeElemento ? nomeElemento.textContent.trim() : "";
    if (!nome) return false;
    receitaAtiva = nome;
    var registro = receitaPorNome(nome);
    if (!registro) return false;
    selecionarTodos(".receitas-workspace .item-selecao").forEach(function (item) { item.classList.remove("ativo"); });
    botao.classList.add("ativo");
    renderizarReceitaDetalhe(registro);
    return true;
  }

  function abrirEntradaProduto() {
    abrirFormulario({
      titulo: "Registrar entrada de produto",
      campos: [
        { nome: "item", rotulo: "Item", tipo: "select", opcoes: nomesProdutos(), largo: true },
        { nome: "quantidade", rotulo: "Quantidade", tipo: "number", min: 1, step: 1, valor: 1 },
        { nome: "data", rotulo: "Data", tipo: "date", valor: dataIso(hoje) },
        { nome: "observacao", rotulo: "Observação", tipo: "textarea", largo: true, obrigatorio: false }
      ],
      rotuloSalvar: "Registrar entrada"
    }, function (registro) {
      operacoes.entradasProdutos.push(registro);
      salvarOperacoes();
      renderizarEntradasProdutos();
      avisar("Entrada registrada e saldo atualizado.");
    });
  }

  function abrirNovoIngrediente() {
    abrirFormulario({
      titulo: "Novo ingrediente",
      campos: [
        { nome: "nome", rotulo: "Ingrediente", placeholder: "Ex.: Manteiga", largo: true },
        { nome: "unidade", rotulo: "Unidade-base", tipo: "select", opcoes: ["g", "kg", "ml", "l", "un."] },
        { nome: "atual", rotulo: "Quantidade atual", tipo: "number", min: 0, step: .01, valor: 0 },
        { nome: "minimo", rotulo: "Estoque mínimo", tipo: "number", min: 0, step: .01, valor: 0 },
        { nome: "custoBase", rotulo: "Custo por unidade-base", tipo: "number", min: 0, step: .001, valor: 0 },
        { nome: "validade", rotulo: "Validade", tipo: "date", valor: dataIso(adicionarDias(hoje, 30)) },
        { nome: "lote", rotulo: "Lote", placeholder: "Ex.: MAN-0826" },
        { nome: "fornecedor", rotulo: "Fornecedor", placeholder: "Nome do fornecedor", largo: true }
      ]
    }, function (registro) {
      operacoes.ingredientes.push(registro);
      salvarOperacoes();
      renderizarIngredientes();
      reaplicarFiltroAtivo();
      avisar("Ingrediente cadastrado com sucesso.");
    });
  }

  function abrirRegistrarCompra() {
    abrirFormulario({
      titulo: "Registrar compra",
      campos: [
        { nome: "ingrediente", rotulo: "Ingrediente", tipo: "select", opcoes: nomesIngredientes(), largo: true },
        { nome: "quantidade", rotulo: "Quantidade", tipo: "number", min: .01, step: .01, valor: 1 },
        { nome: "unidade", rotulo: "Unidade", tipo: "select", opcoes: ["g", "kg", "ml", "l", "un."] },
        { nome: "valor", rotulo: "Valor total", tipo: "number", min: 0, step: .01, valor: 0 },
        { nome: "data", rotulo: "Data", tipo: "date", valor: dataIso(hoje) },
        { nome: "validade", rotulo: "Validade", tipo: "date", valor: dataIso(adicionarDias(hoje, 30)) },
        { nome: "lote", rotulo: "Lote", placeholder: "Ex.: LOT-0826" },
        { nome: "fornecedor", rotulo: "Fornecedor", placeholder: "Nome do fornecedor", largo: true }
      ],
      rotuloSalvar: "Registrar compra"
    }, function (registro) {
      operacoes.compras.push(registro);
      salvarOperacoes();
      renderizarCompraRecente();
      renderizarMovimentacoes();
      reaplicarFiltroAtivo();
      avisar("Compra registrada no histórico e no estoque.");
    });
  }

  function abrirHistoricoCompras() {
    var linhas = operacoes.compras.slice().sort(function (a, b) {
      return String(b.criadoEm).localeCompare(String(a.criadoEm));
    }).map(function (item) {
      return [dataCurta(lerDataIso(item.data), true) + " • " + item.ingrediente, item.quantidade + " " + item.unidade + " • " + moeda(item.valor)];
    });
    abrirRelatorio("Histórico de compras", linhas);
  }

  function abrirMovimentacao(tipo) {
    var ajuste = tipo === "Ajuste";
    abrirFormulario({
      titulo: ajuste ? "Ajustar saldo" : "Nova entrada de estoque",
      campos: ajuste ? [
        { nome: "item", rotulo: "Ingrediente ou item", placeholder: "Ex.: Farinha de trigo", largo: true },
        { nome: "saldo", rotulo: "Novo saldo", tipo: "number", min: 0, step: .01, valor: 0 },
        { nome: "unidade", rotulo: "Unidade", tipo: "select", opcoes: ["g", "kg", "ml", "l", "un."] },
        { nome: "valor", rotulo: "Valor do saldo", tipo: "number", min: 0, step: .01, valor: 0 },
        { nome: "data", rotulo: "Data", tipo: "date", valor: dataIso(hoje) },
        { nome: "motivo", rotulo: "Motivo do ajuste", placeholder: "Ex.: Inventário físico", largo: true }
      ] : [
        { nome: "item", rotulo: "Ingrediente ou item", placeholder: "Ex.: Farinha de trigo", largo: true },
        { nome: "inicial", rotulo: "Saldo inicial", tipo: "number", min: 0, step: .01, valor: 0 },
        { nome: "quantidade", rotulo: "Quantidade recebida", tipo: "number", min: .01, step: .01, valor: 1 },
        { nome: "unidade", rotulo: "Unidade", tipo: "select", opcoes: ["g", "kg", "ml", "l", "un."] },
        { nome: "valor", rotulo: "Valor total", tipo: "number", min: 0, step: .01, valor: 0 },
        { nome: "data", rotulo: "Data", tipo: "date", valor: dataIso(hoje) },
        { nome: "motivo", rotulo: "Origem", placeholder: "Ex.: Compra local", largo: true }
      ],
      rotuloSalvar: ajuste ? "Salvar ajuste" : "Registrar entrada"
    }, function (registro) {
      registro.tipo = tipo;
      operacoes.movimentacoes.push(registro);
      salvarOperacoes();
      renderizarMovimentacoes();
      reaplicarFiltroAtivo();
      avisar(ajuste ? "Saldo ajustado com sucesso." : "Entrada adicionada ao estoque.");
    });
  }

  function baixarCsv(nome, linhas) {
    var conteudo = "\ufeff" + linhas.map(function (linha) {
      return linha.map(function (celula) {
        return '"' + String(celula || "").replace(/"/g, '""').replace(/\s+/g, " ").trim() + '"';
      }).join(";");
    }).join("\r\n");
    var url = URL.createObjectURL(new Blob([conteudo], { type: "text/csv;charset=utf-8" }));
    var link = document.createElement("a");
    link.href = url;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  function exportarTabelaEstoque() {
    var tabela = selecionar(".estoque-workspace table");
    if (!tabela) return;
    var linhas = selecionarTodos("tr", tabela).filter(function (linha) { return !linha.hidden; }).map(function (linha) {
      return selecionarTodos("th, td", linha).map(function (celula) { return celula.textContent; });
    });
    baixarCsv("movimentacoes-estoque-" + dataIso(hoje) + ".csv", linhas);
    avisar("Planilha exportada. Ela pode ser aberta no Excel.");
  }

  function montarListaCompras() {
    var itens = [["Farinha de trigo", "Comprar até atingir 5 kg"]];
    operacoes.ingredientes.forEach(function (item) {
      if (Number(item.atual) <= Number(item.minimo)) itens.push([item.nome, "Comprar " + Math.max(0, Number(item.minimo) - Number(item.atual)) + " " + item.unidade]);
    });
    abrirRelatorio("Lista de compras", itens, [{
      rotulo: "Baixar lista",
      secundario: true,
      acao: function () {
        baixarCsv("lista-de-compras-" + dataIso(hoje) + ".csv", [["Item", "Necessidade"]].concat(itens));
        avisar("Lista de compras baixada.");
      }
    }]);
  }

  function abrirRelatorioMensal() {
    var dados = lerJson(CHAVE_DADOS, {});
    var vendasNovas = (dados.vendas || []).reduce(function (total, venda) {
      return total + Number(venda.quantidade || 0) * Number(venda.valorUnitario || 0);
    }, 0);
    var receitasManuais = (dados.lancamentos || []).filter(function (item) { return item.tipo === "Receita"; }).reduce(function (total, item) { return total + Number(item.valor || 0); }, 0);
    var despesasManuais = (dados.lancamentos || []).filter(function (item) { return item.tipo !== "Receita"; }).reduce(function (total, item) { return total + Number(item.valor || 0); }, 0);
    var perdasNovas = (dados.perdas || []).reduce(function (total, item) {
      return total + Number(item.quantidade || 0) * Number(item.custoUnitario || 0);
    }, 0);
    var faturamento = 24680 + vendasNovas + receitasManuais;
    var gastos = 14260 + despesasManuais;
    var perdas = 284 + perdasNovas;
    var lucro = faturamento - gastos - perdas;
    abrirRelatorio("Relatório mensal • " + mesesTitulo[hoje.getMonth()], [
      ["Faturamento", moeda(faturamento)],
      ["Custos e despesas", moeda(gastos)],
      ["Perdas", moeda(perdas)],
      ["Resultado líquido", moeda(lucro)],
      ["Margem estimada", faturamento ? (lucro / faturamento * 100).toFixed(1).replace(".", ",") + "%" : "0%"]
    ]);
  }

  function abrirEditarReceita() {
    var registro = receitaPorNome(receitaAtiva);
    if (!registro) {
      var ficha = selecionar(".ficha-tecnica");
      registro = {
        nome: selecionar(".modulo-cabecalho h2", ficha) ? selecionar(".modulo-cabecalho h2", ficha).textContent.trim() : "Receita",
        rendimento: 1,
        unidade: "unidades",
        custo: numeroMoeda(selecionarTodos(".ficha-rodape strong", ficha)[2] ? selecionarTodos(".ficha-rodape strong", ficha)[2].textContent : "0"),
        ingredientes: selecionarTodos("tbody tr", ficha).map(function (linha) { return linha.cells[0] ? linha.cells[0].textContent.trim() : ""; }).filter(Boolean).join("\n")
      };
    }
    abrirFormulario({
      titulo: "Editar receita",
      campos: [
        { nome: "nome", rotulo: "Nome da receita", valor: registro.nome, largo: true },
        { nome: "rendimento", rotulo: "Rendimento", tipo: "number", min: 1, step: 1, valor: registro.rendimento },
        { nome: "unidade", rotulo: "Unidade", tipo: "select", opcoes: ["unidades", "fatias", "porções"], valor: registro.unidade },
        { nome: "ingredientes", rotulo: "Ingredientes (um por linha)", tipo: "textarea", linhas: 6, largo: true, valor: linhasIngredientesDaReceita(registro).map(function (item) { return item[0]; }).join("\n") },
        { nome: "custo", rotulo: "Custo total", tipo: "number", min: 0, step: .01, valor: registro.custo }
      ]
    }, function (editada) {
      editada.original = receitaAtiva;
      operacoes.receitasEditadas = operacoes.receitasEditadas.filter(function (item) { return normalizar(item.original) !== normalizar(receitaAtiva); });
      operacoes.receitasEditadas.push(editada);
      salvarOperacoes();
      renderizarReceitaDetalhe(editada);
      var ativo = selecionar(".receitas-workspace .item-selecao.ativo strong");
      if (ativo) ativo.textContent = editada.nome;
      avisar("Receita atualizada com sucesso.");
    });
  }

  function categoriaClasse(categoria) {
    var valor = normalizar(categoria);
    if (valor.indexOf("compra") >= 0) return "compra";
    if (valor.indexOf("conta") >= 0) return "conta";
    if (valor.indexOf("promoc") >= 0) return "promocao";
    if (valor.indexOf("valid") >= 0) return "validade";
    return "producao";
  }

  function compromissosSalvos() {
    var dados = lerJson(CHAVE_DADOS, {});
    return Array.isArray(dados.compromissos) ? dados.compromissos : [];
  }

  function eventosDoDia(iso) {
    var eventos = compromissosSalvos().filter(function (item) { return item.data === iso; }).map(function (item) {
      return { hora: item.hora, titulo: item.titulo, detalhes: item.detalhes || "Compromisso salvo", categoria: item.categoria || "Outro" };
    });
    if (iso === dataIso(hoje)) {
      eventos = [
        { hora: "08:30", titulo: "Preparar bolos", detalhes: "6 unidades • Cozinha", categoria: "Produção" },
        { hora: "10:00", titulo: "Receber fornecedor", detalhes: "Farinha e leite • Entrada do estoque", categoria: "Compra" },
        { hora: "14:00", titulo: "Pagamento de energia", detalhes: "Conta programada para hoje", categoria: "Conta" },
        { hora: "17:30", titulo: "Promoção de fim de tarde", detalhes: "Priorizar itens com sobra", categoria: "Promoção" }
      ].concat(eventos);
    }
    if (filtroAgenda !== "Todos") {
      eventos = eventos.filter(function (item) { return normalizar(item.categoria) === normalizar(filtroAgenda); });
    }
    return eventos.sort(function (a, b) { return String(a.hora).localeCompare(String(b.hora)); });
  }

  function renderizarAgenda() {
    var agenda = selecionar(".agenda-dia");
    if (!agenda) return;
    var data = lerDataIso(calendarioDia);
    var titulo = selecionar(".modulo-cabecalho h2", agenda);
    var contador = selecionar(".modulo-cabecalho small", agenda);
    var etiqueta = selecionar(".modulo-cabecalho .status", agenda);
    var lista = selecionar(".linha-tempo", agenda);
    var eventos = eventosDoDia(calendarioDia);
    if (titulo) titulo.textContent = calendarioDia === dataIso(hoje) ? "Hoje, " + dataLonga(data, false).toLowerCase() : dataLonga(data, true);
    if (contador) contador.textContent = eventos.length + (eventos.length === 1 ? " compromisso" : " compromissos") + (filtroAgenda === "Todos" ? "" : " • " + filtroAgenda);
    if (etiqueta) etiqueta.textContent = calendarioDia === dataIso(hoje) ? "Hoje" : "Selecionado";
    if (!lista) return;
    lista.innerHTML = "";
    if (!eventos.length) {
      var vazio = document.createElement("p");
      vazio.className = "agenda-vazia";
      vazio.textContent = filtroAgenda === "Todos" ? "Nenhum compromisso neste dia." : "Nenhum compromisso desta categoria.";
      lista.appendChild(vazio);
      return;
    }
    eventos.forEach(function (evento) {
      var linha = document.createElement("div");
      var hora = document.createElement("time");
      hora.textContent = evento.hora || "--:--";
      var ponto = document.createElement("i");
      ponto.className = categoriaClasse(evento.categoria);
      var conteudo = document.createElement("span");
      var forte = document.createElement("strong");
      forte.textContent = evento.titulo;
      var detalhe = document.createElement("small");
      detalhe.textContent = evento.detalhes;
      conteudo.appendChild(forte);
      conteudo.appendChild(detalhe);
      linha.appendChild(hora);
      linha.appendChild(ponto);
      linha.appendChild(conteudo);
      lista.appendChild(linha);
    });
  }

  function renderizarCalendario() {
    var grade = selecionar(".mes-grid");
    var navegacao = selecionar(".calendario-navegacao");
    if (!grade || !navegacao) return;
    var titulo = selecionar("h2", navegacao);
    if (titulo) {
      titulo.innerHTML = "";
      titulo.appendChild(document.createTextNode(mesesTitulo[calendarioMes.getMonth()] + " "));
      var ano = document.createElement("span");
      ano.textContent = calendarioMes.getFullYear();
      titulo.appendChild(ano);
    }
    grade.innerHTML = "";
    var primeiroDia = calendarioMes.getDay();
    var inicio = new Date(calendarioMes.getFullYear(), calendarioMes.getMonth(), 1 - primeiroDia, 12);
    var datasComEvento = {};
    compromissosSalvos().forEach(function (item) { if (item.data) datasComEvento[item.data] = true; });
    datasComEvento[dataIso(hoje)] = true;
    for (var indice = 0; indice < 42; indice += 1) {
      var data = adicionarDias(inicio, indice);
      var iso = dataIso(data);
      var botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = data.getDate();
      botao.dataset.dataCalendario = iso;
      botao.setAttribute("aria-label", dataLonga(data, true));
      if (data.getMonth() !== calendarioMes.getMonth()) botao.classList.add("fora");
      if (iso === dataIso(hoje)) botao.classList.add("hoje");
      if (iso === calendarioDia) botao.classList.add("selecionado");
      if (datasComEvento[iso]) botao.classList.add("com-evento");
      botao.addEventListener("click", function () {
        calendarioDia = botao.dataset.dataCalendario;
        var escolhida = lerDataIso(calendarioDia);
        calendarioMes = new Date(escolhida.getFullYear(), escolhida.getMonth(), 1, 12);
        renderizarCalendario();
        renderizarAgenda();
      });
      grade.appendChild(botao);
    }
    renderizarAgenda();
  }

  function navegarCalendario(direcao) {
    calendarioMes = new Date(calendarioMes.getFullYear(), calendarioMes.getMonth() + direcao, 1, 12);
    calendarioDia = dataIso(new Date(calendarioMes.getFullYear(), calendarioMes.getMonth(), 1, 12));
    renderizarCalendario();
  }

  function abrirFiltroAgenda() {
    abrirFormulario({
      titulo: "Filtrar agenda",
      campos: [
        { nome: "categoria", rotulo: "Categoria", tipo: "select", opcoes: ["Todos", "Produção", "Compra", "Conta", "Promoção", "Outro"], valor: filtroAgenda, largo: true }
      ],
      rotuloSalvar: "Aplicar filtro"
    }, function (registro) {
      filtroAgenda = registro.categoria;
      renderizarCalendario();
      avisar(filtroAgenda === "Todos" ? "Todos os compromissos estão visíveis." : "Filtro aplicado: " + filtroAgenda + ".");
    });
  }

  function abrirNovoCompromisso() {
    abrirFormulario({
      titulo: "Novo compromisso",
      campos: [
        { nome: "titulo", rotulo: "Compromisso", placeholder: "Ex.: Receber fornecedor", largo: true },
        { nome: "data", rotulo: "Data", tipo: "date", valor: calendarioDia },
        { nome: "hora", rotulo: "Horário", tipo: "time", valor: String(agora.getHours()).padStart(2, "0") + ":" + String(agora.getMinutes()).padStart(2, "0") },
        { nome: "categoria", rotulo: "Categoria", tipo: "select", opcoes: ["Produção", "Compra", "Conta", "Promoção", "Outro"] },
        { nome: "detalhes", rotulo: "Detalhes", tipo: "textarea", largo: true, obrigatorio: false }
      ]
    }, function (registro) {
      var dados = lerJson(CHAVE_DADOS, {});
      if (!Array.isArray(dados.compromissos)) dados.compromissos = [];
      dados.compromissos.push(registro);
      try {
        localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
      } catch (erro) {
        avisar("Não foi possível salvar o compromisso.");
        return false;
      }
      calendarioDia = registro.data;
      var data = lerDataIso(registro.data);
      calendarioMes = new Date(data.getFullYear(), data.getMonth(), 1, 12);
      renderizarCalendario();
      avisar("Compromisso salvo na agenda.");
    });
  }

  function recuperarSenha() {
    abrirFormulario({
      titulo: "Recuperar senha",
      campos: [{ nome: "email", rotulo: "E-mail da conta", tipo: "email", placeholder: "seu@email.com", largo: true }],
      rotuloSalvar: "Solicitar recuperação"
    }, function () {
      avisar("Solicitação registrada. Conecte um serviço de e-mail para o envio real.");
    });
  }

  var acoes = {
    "registrar entrada": abrirEntradaProduto,
    "registrar compra": abrirRegistrarCompra,
    "novo ingrediente": abrirNovoIngrediente,
    "ver historico de compras": abrirHistoricoCompras,
    "ajustar saldo": function () { abrirMovimentacao("Ajuste"); },
    "nova entrada": function () { abrirMovimentacao("Entrada"); },
    "exportar excel": exportarTabelaEstoque,
    "montar lista de compras": montarListaCompras,
    "relatorio mensal": abrirRelatorioMensal,
    "filtrar agenda": abrirFiltroAgenda,
    "editar receita": abrirEditarReceita,
    "esqueci minha senha": recuperarSenha
  };

  document.addEventListener("click", function (evento) {
    var alvo = evento.target.closest("button, a");
    if (!alvo) return;
    if (alvo.closest("[data-modal-revisao]")) return;

    var botaoCalendario = alvo.closest(".calendario-navegacao button");
    if (botaoCalendario && pagina === "calendario.html") {
      evento.preventDefault();
      evento.stopImmediatePropagation();
      var botoes = selecionarTodos(".calendario-navegacao button");
      navegarCalendario(botaoCalendario === botoes[0] ? -1 : 1);
      return;
    }

    if (pagina === "receitas.html" && alvo.closest(".item-selecao")) {
      var itemReceita = alvo.closest(".item-selecao");
      var nomeReceita = selecionar("strong", itemReceita);
      if (nomeReceita) receitaAtiva = nomeReceita.textContent.trim();
      if (selecionarReceita(itemReceita)) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
      }
      return;
    }

    var texto = normalizar(alvo.textContent);
    if (texto === "novo compromisso" && pagina === "calendario.html") {
      evento.preventDefault();
      evento.stopImmediatePropagation();
      abrirNovoCompromisso();
      return;
    }
    if (!acoes[texto]) return;
    evento.preventDefault();
    evento.stopImmediatePropagation();
    acoes[texto]();
  }, true);

  function inicializar() {
    document.documentElement.dataset.revisao = "5";
    atualizarDatasDaInterface();
    renderizarIngredientes();
    renderizarEntradasProdutos();
    renderizarMovimentacoes();
    if (pagina === "receitas.html") renderizarReceitaDetalhe(receitaPorNome(receitaAtiva));
    if (pagina === "calendario.html") renderizarCalendario();

    var filtroAtivo = selecionar("[data-filtro].ativo");
    if (filtroAtivo) filtroAtivo.dispatchEvent(new Event("click", { bubbles: true }));
  }

  inicializar();

  window.KemetForge = {
    versao: "5.0",
    atualizarCalendario: renderizarCalendario,
    atualizarDados: function () {
      operacoes = carregarOperacoes();
      inicializar();
    }
  };
})();