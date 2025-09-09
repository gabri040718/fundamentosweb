

'use strict';

// Função para mostrar toast 
function mostrarToast(mensagem, tipo = 'success') {
  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  
  if (!toastEl || !toastMsg) return;

  // Configurar cores do toast
  toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'text-white');
  
  switch (tipo) {
    case 'success':
      toastEl.classList.add('bg-success', 'text-white');
      break;
    case 'error':
      toastEl.classList.add('bg-danger', 'text-white');
      break;
    case 'warning':
      toastEl.classList.add('bg-warning');
      break;
    case 'info':
      toastEl.classList.add('bg-info', 'text-white');
      break;
  }

  toastMsg.textContent = mensagem;
  
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// Sistema de tempo real ,relógio e saudação
function iniciarSistemaTempo() {
  const relogioEl = document.getElementById('relogio');
  const saudacaoEl = document.getElementById('saudacao');
  const anoEl = document.getElementById('ano');

  function atualizarTempo() {
    const agora = new Date();
    
    // Atualizar relógio
    if (relogioEl) {
      const horas = String(agora.getHours()).padStart(2, '0');
      const minutos = String(agora.getMinutes()).padStart(2, '0');
      const segundos = String(agora.getSeconds()).padStart(2, '0');
      relogioEl.textContent = `${horas}:${minutos}:${segundos}`;
    }

    // Atualizar saudação baseada no horário
    if (saudacaoEl) {
      const hora = agora.getHours();
      let saudacao = 'Olá! Bem-vindo ao TudoFácil';
      
      if (hora < 12) {
        saudacao = 'Bom dia! Bem-vindo ao TudoFácil';
      } else if (hora < 18) {
        saudacao = 'Boa tarde! Aproveite nossas ofertas';
      } else {
        saudacao = 'Boa noite! Compre com economia';
      }
      
      saudacaoEl.textContent = saudacao;
    }
  }

  // Atualizar ano no rodapé
  if (anoEl) {
    anoEl.textContent = new Date().getFullYear();
  }

  // Atualizar a cada segundo
  atualizarTempo();
  setInterval(atualizarTempo, 1000);
}

// Sistema de alto contraste para acessibilidade
function iniciarSistemaContraste() {
  const btnContraste = document.getElementById('btnContraste');
  if (!btnContraste) return;

  // Restaurar estado salvo
  const contrasteSalvo = localStorage.getItem('altoContraste') === 'true';
  if (contrasteSalvo) {
    ativarContraste();
  }

  btnContraste.addEventListener('click', alternarContraste);

  function alternarContraste() {
    const ativo = document.body.classList.contains('alto-contraste');
    if (ativo) {
      desativarContraste();
    } else {
      ativarContraste();
    }
  }

  function ativarContraste() {
    document.body.classList.add('alto-contraste');
    btnContraste.setAttribute('aria-pressed', 'true');
    btnContraste.textContent = 'Alto contraste (ativo)';
    localStorage.setItem('altoContraste', 'true');
    mostrarToast('Alto contraste ativado', 'info');
  }

  function desativarContraste() {
    document.body.classList.remove('alto-contraste');
    btnContraste.setAttribute('aria-pressed', 'false');
    btnContraste.textContent = 'Alto contraste';
    localStorage.setItem('altoContraste', 'false');
    mostrarToast('Alto contraste desativado', 'info');
  }
}

// Configurar navegação suave para links internos
function configurarNavegacaoSuave() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Melhorar acessibilidade focando no elemento
        setTimeout(() => {
          target.focus();
        }, 500);
      }
    });
  });
}

// Tratar erros de imagem com fallback
function configurarFallbackImagens() {
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuJmFncmF2ZTtvIGRpc3BvbjwvaXZlbDwvdGV4dD48L3N2Zz4=';
      e.target.alt = 'Imagem não disponível';
    }
  }, true);
}

// Melhorar acessibilidade do carrossel
function configurarCarrosselAcessivel() {
  const carousel = document.getElementById('carouselPrincipal');
  if (!carousel) return;

  // Pausar carrossel quando usuário navega por ele com teclado
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const bsCarousel = bootstrap.Carousel.getInstance(carousel);
      if (bsCarousel) {
        bsCarousel.pause();
      }
    }
  });
}

// Função principal de inicialização
function inicializarAplicacao() {
  try {
  
    iniciarSistemaTempo();
    iniciarSistemaContraste();
    
   
    iniciarProdutos();
    iniciarCadastro();
    iniciarAgendamento();
    
   
    configurarNavegacaoSuave();
    configurarFallbackImagens();
    configurarCarrosselAcessivel();
    
    console.log('TudoFácil inicializado com sucesso!');
    
  } catch (erro) {
    console.error('Erro na inicialização:', erro);
    mostrarToast('Erro na inicialização do sistema', 'error');
  }
}

// Aguardar carregamento do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
  inicializarAplicacao();
}