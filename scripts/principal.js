(function () {
  "use strict";

  var icones = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    produtos: '<path d="m3 7 9-4 9 4-9 4Z"/><path d="m3 7 9 4 9-4v10l-9 4-9-4Z"/><path d="M12 11v10"/>',
    ingredientes: '<path d="M12 22V8"/><path d="M8 12c-3 0-5-2-5-5 3 0 5 2 5 5Zm8-3c3 0 5-2 5-5-3 0-5 2-5 5Zm-4 1c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 6c3 0 5-2 5-5-3 0-5 2-5 5Z"/>',
    estoque: '<path d="M3 9h18v11H3z"/><path d="M7 9V5h10v4M8 13h8M8 17h5"/>',
    producao: '<path d="M4 15h16l-2 6H6Z"/><path d="M8 15V9a4 4 0 0 1 8 0v6M9 6 7 4m8 2 2-2"/>',
    vendas: '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 11h10.8l2-7H6"/>',
    perdas: '<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m5 4v7m4-7v7"/>',
    financeiro: '<rect x="2" y="5" width="20" height="15" rx="2"/><path d="M16 13h6M2 10h20"/><circle cx="17" cy="15" r="1"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    ia: '<path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8ZM6 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>',
    graficos: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    sair: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    lua: '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    alerta: '<path d="M10.3 3.4 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
    tendencia: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    dinheiro: '<circle cx="12" cy="12" r="9"/><path d="M16 8.5c-.8-.8-2-1.2-3.5-1.2-2 0-3.5.9-3.5 2.3 0 1.4 1.3 2 3.5 2.4 2.1.4 3.5 1.2 3.5 2.6 0 1.5-1.5 2.5-3.7 2.5-1.6 0-3-.5-4-1.4M12 5v14"/>',
    relatorio: '<path d="M4 3h12l4 4v14H4Z"/><path d="M16 3v5h5M8 13h8M8 17h6M8 9h3"/>',
    relógio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    bolo: '<path d="M4 11h16v9H4zM7 11V8m5 3V7m5 4V8"/><path d="M6 16c2-2 4 2 6 0s4 2 6 0"/>',
    bot: '<rect x="4" y="6" width="16" height="13" rx="3"/><path d="M12 2v4M8 11h.01M16 11h.01M9 15h6"/>',
    enviar: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    configuracoes: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    ajuda: '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.2.9-1.2 1.7v.2M12 17h.01"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>'
  };

  function svg(nome) {
    return '<svg class="icone-svg" viewBox="0 0 24 24" aria-hidden="true">' + (icones[nome] || icones.dashboard) + '</svg>';
  }

  function renderizarIcones(raiz) {
    (raiz || document).querySelectorAll("[data-icon]").forEach(function (elemento) {
      elemento.innerHTML = svg(elemento.dataset.icon);
    });
  }

  var tempoAviso;
  function mostrarAviso(mensagem) {
    var aviso = document.querySelector("[data-aviso]");
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
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(function () { aviso.classList.remove("visivel"); }, 3500);
  }

  var menuApp = document.querySelector(".menu-app");
  if (menuApp) {
    var paginaAtual = location.pathname.split("/").pop() || "painel.html";
    var itensMenu = [
      { href: "painel.html", icone: "dashboard", rotulo: "Visão Geral" },
      { id: "estoque", icone: "estoque", rotulo: "Estoque", filhos: [
        { href: "produtos.html", rotulo: "Itens e preços" },
        { href: "receitas.html", rotulo: "Receitas" }
      ] },
      { id: "operacao", icone: "vendas", rotulo: "Operação", filhos: [
        { href: "vendas.html", rotulo: "Vendas diárias" },
        { href: "perdas.html", rotulo: "Perdas" }
      ] },
      { id: "gestao", icone: "financeiro", rotulo: "Gestão", filhos: [
        { href: "financeiro.html", rotulo: "Financeiro" },
        { href: "calendario.html", rotulo: "Calendário" }
      ] },
      { href: "ia_especialista.html", icone: "ia", rotulo: "IA Especialista" }
    ];
    menuApp.innerHTML = itensMenu.map(function (item) {
      if (item.href) {
        return '<a href="' + item.href + '"' + (paginaAtual === item.href ? ' class="ativo"' : '') + ' title="' + item.rotulo + '"><span class="menu-icone" data-icon="' + item.icone + '"></span><span class="menu-rotulo">' + item.rotulo + '</span></a>';
      }
      var grupoAtivo = item.filhos.some(function (filho) { return filho.href === paginaAtual; });
      var abrirGrupo = grupoAtivo && window.innerWidth > 700;
      return '<div class="menu-grupo' + (abrirGrupo ? ' aberto' : '') + '" data-menu-grupo="' + item.id + '">' +
        '<button class="menu-pai' + (grupoAtivo ? ' ativo' : '') + '" type="button" aria-expanded="' + String(abrirGrupo) + '" title="' + item.rotulo + '" data-menu-pai>' +
        '<span class="menu-icone" data-icon="' + item.icone + '"></span><span class="menu-rotulo">' + item.rotulo + '</span><span class="menu-seta" data-icon="chevron"></span></button>' +
        '<div class="menu-submenu">' + item.filhos.map(function (filho) {
          return '<a href="' + filho.href + '"' + (paginaAtual === filho.href ? ' class="ativo"' : '') + '><span class="submenu-ponto"></span><span class="menu-rotulo">' + filho.rotulo + '</span></a>';
        }).join("") + '</div></div>';
    }).join("") + '<div class="menu-separador"></div><a class="menu-sair" href="../index.html" title="Sair"><span class="menu-icone" data-icon="sair"></span><span class="menu-rotulo">Sair</span></a>';

    menuApp.querySelectorAll("[data-menu-pai]").forEach(function (botaoPai) {
      botaoPai.addEventListener("click", function () {
        if (document.body.classList.contains("menu-recolhido")) {
          document.body.classList.remove("menu-recolhido");
          localStorage.setItem("kemet_menu_recolhido", "0");
        }
        var grupo = botaoPai.closest(".menu-grupo");
        var abrir = !grupo.classList.contains("aberto");
        menuApp.querySelectorAll(".menu-grupo.aberto").forEach(function (outroGrupo) {
          if (outroGrupo !== grupo) {
            outroGrupo.classList.remove("aberto");
            var outroBotao = outroGrupo.querySelector("[data-menu-pai]");
            if (outroBotao) outroBotao.setAttribute("aria-expanded", "false");
          }
        });
        grupo.classList.toggle("aberto", abrir);
        botaoPai.setAttribute("aria-expanded", String(abrir));
      });
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape") return;
      menuApp.querySelectorAll(".menu-grupo.aberto").forEach(function (grupo) {
        grupo.classList.remove("aberto");
        var botao = grupo.querySelector("[data-menu-pai]");
        if (botao) botao.setAttribute("aria-expanded", "false");
      });
    });

    var botaoBarra = document.querySelector(".barra-menu");
    if (botaoBarra) {
      botaoBarra.innerHTML = '<span data-icon="menu"></span><span class="barra-menu-rotulo">Menu</span>';
      botaoBarra.addEventListener("click", function () {
        document.body.classList.toggle("menu-recolhido");
        localStorage.setItem("kemet_menu_recolhido", document.body.classList.contains("menu-recolhido") ? "1" : "0");
      });
      if (localStorage.getItem("kemet_menu_recolhido") === "1") document.body.classList.add("menu-recolhido");
    }
  }

  if (document.body.classList.contains("app-body")) {
    if (localStorage.getItem("kemet_tema") === "claro") document.body.classList.add("tema-claro");
    var botaoTema = document.createElement("button");
    botaoTema.type = "button";
    botaoTema.className = "tema-alternar";
    botaoTema.setAttribute("aria-label", "Alternar tema claro e escuro");
    document.body.appendChild(botaoTema);
    function atualizarBotaoTema() {
      var claro = document.body.classList.contains("tema-claro");
      botaoTema.innerHTML = '<span data-icon="' + (claro ? "lua" : "sol") + '"></span><span>' + (claro ? "Tema escuro" : "Tema claro") + '</span>';
      renderizarIcones(botaoTema);
    }
    atualizarBotaoTema();
    botaoTema.addEventListener("click", function () {
      document.body.classList.toggle("tema-claro");
      localStorage.setItem("kemet_tema", document.body.classList.contains("tema-claro") ? "claro" : "escuro");
      atualizarBotaoTema();
    });
  }

  var iconesBeneficio = ["estoque", "financeiro", "graficos"];
  document.querySelectorAll(".beneficio .icone-circulo").forEach(function (item, indice) { item.dataset.icon = iconesBeneficio[indice] || "dashboard"; });
  var iconesMetrica = ["vendas", "dinheiro", "relatorio", "estoque"];
  document.querySelectorAll(".metrica-icone").forEach(function (item, indice) { item.dataset.icon = iconesMetrica[indice] || "dashboard"; });
  document.querySelectorAll(".produto-item .produto-imagem").forEach(function (item, indice) { item.dataset.icon = indice === 0 ? "bolo" : (indice === 1 ? "dinheiro" : "produtos"); });
  var iconeProdutoDetalhe = document.querySelector("[data-produto-icone]");
  if (iconeProdutoDetalhe) iconeProdutoDetalhe.dataset.icon = "bolo";
  renderizarIcones(document);

  var graficoGeral = document.querySelector(".desempenho-card .linha-dashboard");
  var cardGrafico = graficoGeral ? graficoGeral.closest(".desempenho-card") : null;
  if (graficoGeral && cardGrafico) {
    if (!graficoGeral.querySelector(".linha-perdas")) {
      graficoGeral.insertAdjacentHTML("beforeend", '<path class="linha-perdas"/><g class="grafico-pontos perdas"></g>');
    }

    var dadosGrafico = {
      hoje: {
        rotulo: "Hoje",
        labels: ["08h", "10h", "12h", "14h", "16h", "18h"],
        eixoY: ["R$ 1,6 mil", "R$ 1 mil", "R$ 500", "R$ 0"],
        maximo: 1600,
        vendas: [120, 260, 510, 820, 1110, 1240],
        lucro: [58, 132, 276, 438, 590, 684],
        perdas: [0, 6, 16, 28, 47, 61.2],
        resumo: [
          ["Vendas hoje", 1240],
          ["Lucro hoje", 684],
          ["Perdas hoje", 61.2]
        ]
      },
      semana: {
        rotulo: "Semana",
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        eixoY: ["R$ 9 mil", "R$ 6 mil", "R$ 3 mil", "R$ 0"],
        maximo: 9000,
        vendas: [1240, 2380, 3510, 4890, 6340, 7780, 8290],
        lucro: [684, 1050, 1530, 2180, 2810, 3370, 3610],
        perdas: [61.2, 72.5, 88.4, 108.9, 122.1, 139.4, 147.6],
        resumo: [
          ["Vendas na semana", 8290],
          ["Lucro na semana", 3610],
          ["Perdas na semana", 147.6]
        ]
      },
      mes: {
        rotulo: "Mês",
        labels: ["01", "05", "09", "13", "17", "21", "25", "29"],
        eixoY: ["R$ 30 mil", "R$ 20 mil", "R$ 10 mil", "R$ 0"],
        maximo: 30000,
        vendas: [3200, 6900, 10400, 13900, 17300, 20700, 22800, 24680],
        lucro: [1100, 2350, 3600, 4890, 6120, 7350, 8160, 8750],
        perdas: [42, 82, 117, 163, 205, 238, 261, 284.5],
        resumo: [
          ["Vendas no mês", 24680],
          ["Lucro líquido", 8750],
          ["Perdas no mês", 284.5]
        ]
      }
    };
    var moedaGrafico = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    var nomesSeries = { vendas: "Vendas", lucro: "Lucro", perdas: "Perdas" };

    function pontosDaSerie(valores, maximo) {
      var inicioX = 20;
      var fimX = 740;
      var topoY = 25;
      var baseY = 195;
      return valores.map(function (valor, indice) {
        var proporcaoX = valores.length > 1 ? indice / (valores.length - 1) : 0;
        return {
          x: inicioX + (fimX - inicioX) * proporcaoX,
          y: baseY - (valor / maximo) * (baseY - topoY)
        };
      });
    }

    function caminhoDaSerie(pontos) {
      return pontos.map(function (ponto, indice) {
        return (indice === 0 ? "M" : "L") + ponto.x.toFixed(1) + " " + ponto.y.toFixed(1);
      }).join(" ");
    }

    function atualizarPontos(tipo, valores, pontos, labels) {
      var grupo = graficoGeral.querySelector(".grafico-pontos." + tipo);
      if (!grupo) return;
      grupo.replaceChildren();
      valores.forEach(function (valor, indice) {
        var descricao = nomesSeries[tipo] + " em " + labels[indice] + ": " + moedaGrafico.format(valor);
        var circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        var titulo = document.createElementNS("http://www.w3.org/2000/svg", "title");
        circulo.setAttribute("cx", pontos[indice].x.toFixed(1));
        circulo.setAttribute("cy", pontos[indice].y.toFixed(1));
        circulo.setAttribute("r", tipo === "vendas" ? "5" : "4");
        circulo.setAttribute("tabindex", "0");
        circulo.setAttribute("role", "button");
        circulo.setAttribute("aria-label", descricao);
        titulo.textContent = descricao;
        circulo.appendChild(titulo);
        circulo.addEventListener("click", function () { mostrarAviso(descricao); });
        circulo.addEventListener("keydown", function (evento) {
          if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            mostrarAviso(descricao);
          }
        });
        grupo.appendChild(circulo);
      });
    }

    function atualizarGrafico(periodo) {
      var dados = dadosGrafico[periodo];
      if (!dados) return;
      var pontosVendas = pontosDaSerie(dados.vendas, dados.maximo);
      var pontosLucro = pontosDaSerie(dados.lucro, dados.maximo);
      var pontosPerdas = pontosDaSerie(dados.perdas, dados.maximo);
      var caminhoVendas = caminhoDaSerie(pontosVendas);
      var baseY = 195;
      var primeiroX = pontosVendas[0].x.toFixed(1);
      var ultimoX = pontosVendas[pontosVendas.length - 1].x.toFixed(1);

      cardGrafico.classList.add("grafico-atualizando");
      graficoGeral.querySelector(".linha-dado").setAttribute("d", caminhoVendas);
      graficoGeral.querySelector(".linha-area").setAttribute("d", caminhoVendas + " L" + ultimoX + " " + baseY + " L" + primeiroX + " " + baseY + " Z");
      graficoGeral.querySelector(".linha-lucro").setAttribute("d", caminhoDaSerie(pontosLucro));
      graficoGeral.querySelector(".linha-perdas").setAttribute("d", caminhoDaSerie(pontosPerdas));
      graficoGeral.setAttribute("aria-label", "Relatório geral de " + dados.rotulo.toLowerCase() + ": vendas, lucro e perdas");

      atualizarPontos("vendas", dados.vendas, pontosVendas, dados.labels);
      atualizarPontos("lucro", dados.lucro, pontosLucro, dados.labels);
      atualizarPontos("perdas", dados.perdas, pontosPerdas, dados.labels);

      var eixoX = cardGrafico.querySelector(".grafico-eixo-x");
      var eixoY = cardGrafico.querySelector(".grafico-eixo-y");
      eixoX.replaceChildren();
      eixoY.replaceChildren();
      dados.labels.forEach(function (label) {
        var item = document.createElement("span");
        item.textContent = label;
        eixoX.appendChild(item);
      });
      dados.eixoY.forEach(function (label) {
        var item = document.createElement("span");
        item.textContent = label;
        eixoY.appendChild(item);
      });

      cardGrafico.querySelectorAll(".grafico-resumo > div").forEach(function (item, indice) {
        var resumo = dados.resumo[indice];
        if (!resumo) return;
        item.querySelector("small").textContent = resumo[0];
        item.querySelector("strong").textContent = moedaGrafico.format(resumo[1]);
      });
      window.setTimeout(function () { cardGrafico.classList.remove("grafico-atualizando"); }, 160);
    }

    var periodoPorBotao = { "Hoje": "hoje", "Semana": "semana", "Mês": "mes" };
    cardGrafico.querySelectorAll("[data-filtro]").forEach(function (botao) {
      botao.addEventListener("click", function () {
        atualizarGrafico(periodoPorBotao[botao.textContent.trim()]);
      });
    });
    atualizarGrafico("mes");
  }

  var botaoMenu = document.querySelector("[data-menu-botao]");
  var menu = document.querySelector("[data-menu]");
  if (botaoMenu && menu) {
    botaoMenu.innerHTML = svg("menu");
    botaoMenu.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberta");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
      botaoMenu.innerHTML = aberto ? "×" : svg("menu");
      document.body.classList.toggle("menu-travado", aberto);
    });
  }

  var perfilBotao = document.querySelector("[data-perfil-botao]");
  var perfilMenu = document.querySelector("[data-perfil-menu]");
  if (perfilBotao && perfilMenu) {
    var perfilArea = perfilBotao.closest(".perfil-area");
    function alternarPerfil(forcarAberto) {
      var abrir = typeof forcarAberto === "boolean" ? forcarAberto : !perfilMenu.classList.contains("aberto");
      perfilMenu.classList.toggle("aberto", abrir);
      perfilBotao.classList.toggle("ativo", abrir);
      perfilBotao.setAttribute("aria-expanded", String(abrir));
      perfilMenu.setAttribute("aria-hidden", String(!abrir));
    }
    perfilBotao.addEventListener("click", function () { alternarPerfil(); });
    document.addEventListener("click", function (evento) {
      if (perfilArea && !perfilArea.contains(evento.target)) alternarPerfil(false);
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && perfilMenu.classList.contains("aberto")) {
        alternarPerfil(false);
        perfilBotao.focus();
      }
    });
  }

  document.querySelectorAll("[data-mensagem], [data-prototipo]").forEach(function (elemento) {
    elemento.addEventListener("click", function (evento) {
      if (elemento.tagName === "A" && elemento.getAttribute("href") && elemento.getAttribute("href") !== "#") return;
      evento.preventDefault();
      mostrarAviso(elemento.dataset.mensagem || elemento.dataset.prototipo || "Função visual do protótipo.");
    });
  });

  document.querySelectorAll("[data-filtro]").forEach(function (filtro) {
    filtro.addEventListener("click", function () {
      var grupo = filtro.parentElement;
      grupo.querySelectorAll("[data-filtro]").forEach(function (item) { item.classList.remove("ativo"); });
      filtro.classList.add("ativo");
      mostrarAviso(filtro.closest(".desempenho-card") ? "Gráfico atualizado: " + filtro.textContent.trim() : "Filtro visual: " + filtro.textContent.trim());
    });
  });

  document.querySelectorAll("[data-telefone]").forEach(function (campo) {
    campo.addEventListener("input", function () {
      var numero = campo.value.replace(/\D/g, "").slice(0, 11);
      campo.value = numero.length > 10 ? numero.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2") : numero.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    });
  });

  document.querySelectorAll("[data-mostrar-senha]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      var campo = document.querySelector(botao.dataset.mostrarSenha);
      if (!campo) return;
      var mostrar = campo.type === "password";
      campo.type = mostrar ? "text" : "password";
      botao.textContent = mostrar ? "Ocultar" : "Mostrar";
    });
  });

  document.querySelectorAll("[data-formulario]").forEach(function (formulario) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var senha = formulario.querySelector("[data-senha]");
      var confirmar = formulario.querySelector("[data-confirmar-senha]");
      if (!formulario.checkValidity()) { formulario.reportValidity(); mostrarAviso("Preencha corretamente os campos obrigatórios."); return; }
      if (senha && confirmar && senha.value !== confirmar.value) { confirmar.focus(); mostrarAviso("As senhas precisam ser iguais."); return; }
      mostrarAviso(formulario.dataset.sucesso || "Ação demonstrada no protótipo.");
      formulario.reset();
      var modal = formulario.closest(".modal-fundo");
      if (modal) setTimeout(function () { modal.classList.add("oculto"); }, 500);
      if (formulario.dataset.destino) setTimeout(function () { window.location.href = formulario.dataset.destino; }, 550);
    });
  });

  document.querySelectorAll("[data-abrir-modal]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      var modal = document.getElementById(botao.dataset.abrirModal);
      if (modal) { modal.classList.remove("oculto"); var campo = modal.querySelector("input, select, textarea"); if (campo) campo.focus(); }
    });
  });
  document.querySelectorAll("[data-fechar-modal]").forEach(function (botao) { botao.addEventListener("click", function () { botao.closest(".modal-fundo").classList.add("oculto"); }); });
  document.querySelectorAll(".modal-fundo").forEach(function (fundo) { fundo.addEventListener("click", function (evento) { if (evento.target === fundo) fundo.classList.add("oculto"); }); });
  document.addEventListener("keydown", function (evento) { if (evento.key === "Escape") document.querySelectorAll(".modal-fundo:not(.oculto)").forEach(function (modal) { modal.classList.add("oculto"); }); });

  var quantidade = document.querySelector("[data-quantidade]");
  var quantidadeAtual = quantidade ? Number(quantidade.textContent) : 0;
  function atualizarQuantidade(valor) { quantidadeAtual = Math.max(0, valor); if (quantidade) quantidade.textContent = quantidadeAtual; }
  var mais = document.querySelector("[data-qtd-mais]");
  var menos = document.querySelector("[data-qtd-menos]");
  if (mais) mais.addEventListener("click", function () { atualizarQuantidade(quantidadeAtual + 1); });
  if (menos) menos.addEventListener("click", function () { atualizarQuantidade(quantidadeAtual - 1); });
  document.querySelectorAll("[data-produto]").forEach(function (produto) {
    produto.addEventListener("click", function () {
      document.querySelectorAll("[data-produto]").forEach(function (item) { item.classList.remove("ativo"); });
      produto.classList.add("ativo");
      var nome = document.querySelector("[data-produto-nome]"); var icone = document.querySelector("[data-produto-icone]");
      if (nome) nome.textContent = produto.dataset.nome;
      if (icone) { icone.dataset.icon = produto.dataset.nome.indexOf("Bolo") >= 0 ? "bolo" : "produtos"; renderizarIcones(icone.parentElement || document); }
      atualizarQuantidade(Number(produto.dataset.qtd));
    });
  });

  var receitas = {
    bolo: ["Massa", ["3 ovos", "2 xícaras de açúcar", "1 xícara de leite", "3 colheres de chocolate", "2 xícaras de farinha"], "Cobertura", ["Leite condensado", "Chocolate em pó", "Manteiga"]],
    brigadeiro: ["Brigadeiro", ["1 lata de leite condensado", "4 colheres de chocolate", "1 colher de manteiga"], "Finalização", ["Granulado", "Forminhas"]],
    pave: ["Creme", ["Leite condensado", "Leite", "Amido de milho", "Gemas"], "Montagem", ["Biscoitos", "Leite", "Chocolate ralado"]]
  };
  document.querySelectorAll("[data-receita]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      var dados = receitas[botao.dataset.receita]; var conteudo = document.querySelector("[data-conteudo-receita]");
      if (!dados || !conteudo) return;
      document.querySelectorAll("[data-receita]").forEach(function (item) { item.classList.remove("ativo"); }); botao.classList.add("ativo");
      conteudo.innerHTML = "<div><h3>" + dados[0] + "</h3><ol>" + dados[1].map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ol></div><div><h3>" + dados[2] + "</h3><ol>" + dados[3].map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ol></div>";
    });
  });

  var calendario = document.querySelector("[data-calendario]");
  if (calendario) {
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var nomesDias = ["D", "S", "T", "Q", "Q", "S", "S"];
    meses.forEach(function (nome, indice) {
      var primeiro = new Date(2026, indice, 1).getDay(); var total = new Date(2026, indice + 1, 0).getDate();
      var dias = nomesDias.map(function (dia) { return '<span class="semana">' + dia + "</span>"; }).join("");
      for (var vazio = 0; vazio < primeiro; vazio++) dias += "<span></span>";
      for (var dia = 1; dia <= total; dia++) dias += "<span" + (dia === 17 && indice === 7 ? ' class="marcado"' : "") + ">" + dia + "</span>";
      calendario.insertAdjacentHTML("beforeend", '<article class="mes"><h2>' + nome + '</h2><div class="dias">' + dias + "</div></article>");
    });
  }

  var periodo = document.querySelector("[data-periodo-grafico]");
  if (periodo) periodo.addEventListener("change", function () {
    document.querySelectorAll("[data-grafico-pico] .barra, [data-grafico-lucro] .barra").forEach(function (barra, indice) { barra.style.height = 20 + ((indice * 19 + (periodo.value === "mes" ? 33 : 11)) % 68) + "%"; });
  });

  document.querySelectorAll("[data-ia-sugestao]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      var mensagens = document.querySelector("[data-mensagens]");
      if (!mensagens) return;
      mensagens.insertAdjacentHTML("beforeend", '<div class="mensagem usuario">' + botao.textContent.trim() + '</div><div class="mensagem ia">Analisando os dados demonstrativos: o Bolo de Chocolate lidera as vendas, o Pavê está abaixo do estoque mínimo e o calendário sugere uma campanha para a próxima data comemorativa. Esta é uma resposta visual do protótipo.</div>');
      mensagens.lastElementChild.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
