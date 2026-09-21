const numeroWhatsApp = "";

const botaoMenu = document.getElementById("botaoMenu");
const menu = document.getElementById("menu");
const cabecalho = document.getElementById("cabecalho");
const barraProgresso = document.querySelector(".barra-progresso-scroll");

function abrirWhatsApp(mensagem) {
  const texto = encodeURIComponent(mensagem);
  const destino = numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=${texto}`
    : `https://wa.me/?text=${texto}`;
  window.open(destino, "_blank");
}

document.querySelectorAll("[data-whatsapp]").forEach((elemento) => {
  elemento.addEventListener("click", () => abrirWhatsApp(elemento.dataset.whatsapp));
});

botaoMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto);
});

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  });
});

function atualizarCabecalhoEProgresso() {
  cabecalho.classList.toggle("rolado", window.scrollY > 40);
  const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = alturaRolavel > 0 ? window.scrollY / alturaRolavel : 0;
  barraProgresso.style.transform = `scaleX(${progresso})`;
}
window.addEventListener("scroll", atualizarCabecalhoEProgresso, { passive: true });
atualizarCabecalhoEProgresso();

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".animar").forEach((elemento) => observador.observe(elemento));

document.querySelectorAll(".faq-item").forEach((item) => {
  const pergunta = item.querySelector(".faq-pergunta");
  const resposta = item.querySelector(".faq-resposta");

  pergunta.addEventListener("click", () => {
    const aberto = item.classList.contains("aberto");

    document.querySelectorAll(".faq-item").forEach((outroItem) => {
      outroItem.classList.remove("aberto");
      outroItem.querySelector(".faq-resposta").style.maxHeight = null;
    });

    if (!aberto) {
      item.classList.add("aberto");
      resposta.style.maxHeight = `${resposta.scrollHeight}px`;
    }
  });
});

const secoes = document.querySelectorAll("main section[id]");
const linksMenu = document.querySelectorAll('.menu a[href^="#"]');

const observadorMenu = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      linksMenu.forEach((link) => link.classList.remove("ativo"));
      const linkAtual = document.querySelector(`.menu a[href="#${entrada.target.id}"]`);
      if (linkAtual) linkAtual.classList.add("ativo");
    }
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

secoes.forEach((secao) => observadorMenu.observe(secao));

function animarContador(elemento) {
  if (elemento.dataset.animado) return;
  elemento.dataset.animado = "true";
  const alvo = Number(elemento.dataset.contador);
  const sufixo = elemento.dataset.sufixo || "";
  const duracao = 1300;
  const inicio = performance.now();

  function quadro(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const suavizado = 1 - Math.pow(1 - progresso, 3);
    elemento.textContent = `${Math.round(alvo * suavizado)}${sufixo}`;
    if (progresso < 1) requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
}

const observadorContadores = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      animarContador(entrada.target);
      observadorContadores.unobserve(entrada.target);
    }
  });
}, { threshold: 0.7 });

document.querySelectorAll("[data-contador]").forEach((contador) => observadorContadores.observe(contador));
