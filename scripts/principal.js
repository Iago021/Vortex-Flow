(function () {
  "use strict";

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

  var botaoMenu = document.querySelector("[data-menu-botao]");
  var menu = document.querySelector("[data-menu]");
  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberta");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
      botaoMenu.textContent = aberto ? "×" : "☰";
      document.body.classList.toggle("menu-travado", aberto);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("aberta");
        document.body.classList.remove("menu-travado");
      });
    });
  }

  document.querySelectorAll("[data-mensagem]").forEach(function (elemento) {
    elemento.addEventListener("click", function (evento) {
      evento.preventDefault();
      mostrarAviso(elemento.dataset.mensagem);
    });
  });

  document.querySelectorAll("[data-telefone]").forEach(function (campo) {
    campo.addEventListener("input", function () {
      var numero = campo.value.replace(/\D/g, "").slice(0, 11);
      campo.value = numero.length > 10
        ? numero.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
        : numero.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
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
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        mostrarAviso("Preencha corretamente os campos obrigatórios.");
        return;
      }
      if (senha && confirmar && senha.value !== confirmar.value) {
        confirmar.focus();
        mostrarAviso("As senhas precisam ser iguais.");
        return;
      }
      mostrarAviso(formulario.dataset.sucesso || "Dados salvos com sucesso.");
      formulario.reset();
      var modal = formulario.closest(".modal-fundo");
      if (modal) setTimeout(function () { modal.classList.add("oculto"); }, 500);
      if (formulario.dataset.destino) {
        setTimeout(function () { window.location.href = formulario.dataset.destino; }, 550);
      }
    });
  });

  document.querySelectorAll("[data-abrir-modal]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      var modal = document.getElementById(botao.dataset.abrirModal);
      if (modal) {
        modal.classList.remove("oculto");
        var primeiroCampo = modal.querySelector("input, select, textarea");
        if (primeiroCampo) primeiroCampo.focus();
      }
    });
  });
  document.querySelectorAll("[data-fechar-modal]").forEach(function (botao) {
    botao.addEventListener("click", function () { botao.closest(".modal-fundo").classList.add("oculto"); });
  });
  document.querySelectorAll(".modal-fundo").forEach(function (fundo) {
    fundo.addEventListener("click", function (evento) { if (evento.target === fundo) fundo.classList.add("oculto"); });
  });
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") document.querySelectorAll(".modal-fundo:not(.oculto)").forEach(function (modal) { modal.classList.add("oculto"); });
  });

  var quantidade = document.querySelector("[data-quantidade]");
  var quantidadeAtual = quantidade ? Number(quantidade.textContent) : 0;
  function atualizarQuantidade(valor) {
    quantidadeAtual = Math.max(0, valor);
    if (quantidade) quantidade.textContent = quantidadeAtual;
  }
  var mais = document.querySelector("[data-qtd-mais]");
  var menos = document.querySelector("[data-qtd-menos]");
  if (mais) mais.addEventListener("click", function () { atualizarQuantidade(quantidadeAtual + 1); });
  if (menos) menos.addEventListener("click", function () { atualizarQuantidade(quantidadeAtual - 1); });
  document.querySelectorAll("[data-produto]").forEach(function (produto) {
    produto.addEventListener("click", function () {
      document.querySelectorAll("[data-produto]").forEach(function (item) { item.classList.remove("ativo"); });
      produto.classList.add("ativo");
      var nome = document.querySelector("[data-produto-nome]");
      var icone = document.querySelector("[data-produto-icone]");
      if (nome) nome.textContent = produto.dataset.nome;
      if (icone) icone.textContent = produto.dataset.icone;
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
      var dados = receitas[botao.dataset.receita];
      var conteudo = document.querySelector("[data-conteudo-receita]");
      if (!dados || !conteudo) return;
      document.querySelectorAll("[data-receita]").forEach(function (item) { item.classList.remove("ativo"); });
      botao.classList.add("ativo");
      conteudo.innerHTML = "<div><h3>" + dados[0] + "</h3><ol>" + dados[1].map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ol></div><div><h3>" + dados[2] + "</h3><ol>" + dados[3].map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ol></div>";
    });
  });

  var calendario = document.querySelector("[data-calendario]");
  if (calendario) {
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var nomesDias = ["D", "S", "T", "Q", "Q", "S", "S"];
    meses.forEach(function (nome, indice) {
      var primeiro = new Date(2026, indice, 1).getDay();
      var total = new Date(2026, indice + 1, 0).getDate();
      var dias = nomesDias.map(function (dia) { return "<span class=\"semana\">" + dia + "</span>"; }).join("");
      for (var vazio = 0; vazio < primeiro; vazio++) dias += "<span></span>";
      for (var dia = 1; dia <= total; dia++) dias += "<span" + (dia === 17 && indice === 7 ? " class=\"marcado\"" : "") + ">" + dia + "</span>";
      calendario.insertAdjacentHTML("beforeend", "<article class=\"mes\"><h2>" + nome + "</h2><div class=\"dias\">" + dias + "</div></article>");
    });
  }

  var periodo = document.querySelector("[data-periodo-grafico]");
  if (periodo) {
    periodo.addEventListener("change", function () {
      var barras = document.querySelectorAll("[data-grafico-pico] .barra, [data-grafico-lucro] .barra");
      barras.forEach(function (barra, indice) {
        var novaAltura = 20 + ((indice * 19 + (periodo.value === "mes" ? 33 : 11)) % 68);
        barra.style.height = novaAltura + "%";
      });
    });
  }
})();
