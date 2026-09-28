/**
 * Claudia Fontes - Enfermagem Especializada, Podologia & Laserterapia
 * JavaScript Interativo, Otimizado e Fluido
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initFaqAccordion();
  initSmoothScroll();
  initScrollReveal();
  initVideoControls();
});

/* 1. Header com sombra suave na rolagem */
function initNavbarScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md', 'bg-white/95', 'py-3');
      header.classList.remove('bg-white/90', 'py-4');
    } else {
      header.classList.remove('shadow-md', 'bg-white/95', 'py-3');
      header.classList.add('bg-white/90', 'py-4');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Menu Mobile Drawer simples */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('close-mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    }, 10);
  };

  const closeMenu = () => {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 250);
  };

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* 3. Accordion Dinâmico para FAQ com scrollHeight Fluido */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isExpanded = content.classList.contains('expanded');

      // Fecha todos os outros itens
      faqItems.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherContent) {
          otherContent.style.maxHeight = null;
          otherContent.classList.remove('expanded');
        }
        if (otherIcon) {
          otherIcon.classList.remove('rotate-180', 'text-teal-600');
        }
        otherItem.classList.remove('border-teal-300', 'bg-teal-50/20');
      });

      // Abre o item clicado se estava fechado
      if (!isExpanded) {
        content.classList.add('expanded');
        content.style.maxHeight = (content.scrollHeight + 32) + 'px';
        if (icon) icon.classList.add('rotate-180', 'text-teal-600');
        item.classList.add('border-teal-300', 'bg-teal-50/20');
      }
    });
  });
}

/* 4. Rolagem Suave para Âncoras */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* 5. Scroll Reveal com IntersectionObserver */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback para navegadores sem IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/* 6. Controles Interativos dos Vídeos (Mudo / Desmudo & Play) */
function initVideoControls() {
  const videoContainers = document.querySelectorAll('[data-video-container]');

  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const muteBtn = container.querySelector('[data-video-mute]');
    const muteIcon = container.querySelector('[data-mute-icon]');
    const unmuteIcon = container.querySelector('[data-unmute-icon]');

    if (!video) return;

    // Garantir que inicie tocando mudo
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay bloqueado pelo navegador; manter mudo
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (video.muted) {
          if (muteIcon) muteIcon.classList.remove('hidden');
          if (unmuteIcon) unmuteIcon.classList.add('hidden');
        } else {
          if (muteIcon) muteIcon.classList.add('hidden');
          if (unmuteIcon) unmuteIcon.classList.remove('hidden');
          // Ao desmutar, garantir que esteja tocando
          video.play();
        }
      });
    }

    // Clique no vídeo para pausar/retomar
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
}
