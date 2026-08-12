(function () {
  "use strict";

  var tempoAviso;

  function mostrarAviso(mensagem) {
    var aviso = document.querySelector("[data-aviso]");

    if (!aviso) {
      aviso = document.createElement("div");
      aviso.className = "aviso";
      aviso.setAttribute("data-aviso", "");
      aviso.setAttribute("role", "status");
      aviso.setAttribute("aria-live", "polite");
      document.body.appendChild(aviso);
    }

    aviso.textContent = mensagem;
    aviso.classList.add("visivel");
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(function () {
      aviso.classList.remove("visivel");
    }, 4000);
  }

  var botaoMenu = document.querySelector("[data-botao-menu]");
  var navegacao = document.querySelector("[data-navegacao]");

  function fecharMenu() {
    if (!botaoMenu || !navegacao) return;
    botaoMenu.classList.remove("aberto");
    navegacao.classList.remove("aberta");
    botaoMenu.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu_travado");
  }

  if (botaoMenu && navegacao) {
    botaoMenu.addEventListener("click", function () {
      var abrir = !navegacao.classList.contains("aberta");
      botaoMenu.classList.toggle("aberto", abrir);
      navegacao.classList.toggle("aberta", abrir);
      botaoMenu.setAttribute("aria-expanded", String(abrir));
      document.body.classList.toggle("menu_travado", abrir);
    });

    navegacao.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", fecharMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) fecharMenu();
    });
  }

  document.querySelectorAll("[data-mensagem]").forEach(function (elemento) {
    elemento.addEventListener("click", function (evento) {
      evento.preventDefault();
      mostrarAviso(elemento.getAttribute("data-mensagem"));
    });
  });

  document.querySelectorAll("[data-telefone]").forEach(function (campo) {
    campo.addEventListener("input", function () {
      var numeros = campo.value.replace(/\D/g, "").slice(0, 11);
      campo.value = numeros.length > 10
        ? numeros.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
        : numeros.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    });
  });

  document.querySelectorAll("[data-mostrar-senha]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      var campo = document.querySelector(botao.getAttribute("data-mostrar-senha"));
      if (!campo) return;
      var mostrar = campo.type === "password";
      campo.type = mostrar ? "text" : "password";
      botao.textContent = mostrar ? "Ocultar" : "Mostrar";
      botao.setAttribute("aria-pressed", String(mostrar));
    });
  });

  document.querySelectorAll("input, select, textarea").forEach(function (campo) {
    campo.addEventListener("input", function () {
      campo.setAttribute("aria-invalid", "false");
    });
  });

  document.querySelectorAll("[data-formulario]").forEach(function (formulario) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var valido = true;

      formulario.querySelectorAll("[required]").forEach(function (campo) {
        var vazio = campo.type === "checkbox" ? !campo.checked : !campo.value.trim();
        campo.setAttribute("aria-invalid", String(vazio));
        if (vazio) valido = false;
      });

      var senha = formulario.querySelector("[data-senha]");
      var confirmarSenha = formulario.querySelector("[data-confirmar-senha]");

      if (senha && senha.value.length < 8) {
        senha.setAttribute("aria-invalid", "true");
        senha.focus();
        mostrarAviso("A senha precisa ter pelo menos 8 caracteres.");
        return;
      }

      if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
        confirmarSenha.setAttribute("aria-invalid", "true");
        confirmarSenha.focus();
        mostrarAviso("As senhas precisam ser iguais.");
        return;
      }

      if (!valido || !formulario.checkValidity()) {
        var primeiroErro = formulario.querySelector('[aria-invalid="true"]');
        if (primeiroErro) primeiroErro.focus();
        mostrarAviso("Preencha corretamente os campos destacados.");
        return;
      }

      mostrarAviso(formulario.getAttribute("data-sucesso") || "Formulário validado com sucesso.");
    });
  });
})();
