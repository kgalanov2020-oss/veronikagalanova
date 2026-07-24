const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('is-open', !isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    });
  });
}

const experienceToggle = document.querySelector('.experience-toggle');
const experienceSection = document.querySelector('.experience');

if (experienceToggle && experienceSection) {
  experienceToggle.addEventListener('click', () => {
    const isOpen = experienceToggle.getAttribute('aria-expanded') === 'true';
    experienceToggle.setAttribute('aria-expanded', String(!isOpen));
    experienceSection.classList.toggle('is-open', !isOpen);
    experienceToggle.textContent = isOpen ? 'Смотреть подробнее' : 'Свернуть';
  });
}

function activateTab(tab) {
  const target = tab.dataset.tab;

  tabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-selected', String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === target;
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    tabs[nextIndex].focus();
    activateTab(tabs[nextIndex]);
  });
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.faq-list details').forEach((details) => {
  details.addEventListener('toggle', () => {
    if (!details.open) return;
    document.querySelectorAll('.faq-list details').forEach((item) => {
      if (item !== details) item.open = false;
    });
  });
});

const lettersGallery = document.querySelector('[data-letters-gallery]');
const letterModal = document.querySelector('[data-letter-modal]');

if (lettersGallery && letterModal) {
  const letterLinks = Array.from(lettersGallery.querySelectorAll('[data-letter-open]'));
  const openGalleryButton = document.querySelector('[data-letter-gallery-open]');
  const modalImage = letterModal.querySelector('[data-letter-modal-image]');
  const modalCaption = letterModal.querySelector('[data-letter-modal-caption]');
  const closeButton = letterModal.querySelector('[data-letter-close]');
  const previousButton = letterModal.querySelector('[data-letter-modal-prev]');
  const nextButton = letterModal.querySelector('[data-letter-modal-next]');
  let activeIndex = 0;

  function getLetterData(index) {
    const link = letterLinks[index];
    const image = link?.querySelector('img');
    const caption = link?.closest('[data-letter-slide]')?.querySelector('p')?.textContent || '';

    return {
      alt: image?.alt || caption,
      caption,
      src: image?.currentSrc || image?.src || '',
    };
  }

  function showLetter(index) {
    activeIndex = (index + letterLinks.length) % letterLinks.length;
    const letter = getLetterData(activeIndex);

    if (modalImage) {
      modalImage.src = letter.src;
      modalImage.alt = letter.alt;
    }

    if (modalCaption) {
      modalCaption.textContent = letter.caption;
    }
  }

  function openLetter(index) {
    showLetter(index);

    if (typeof letterModal.showModal === 'function') {
      letterModal.showModal();
    } else {
      letterModal.setAttribute('open', '');
    }
  }

  function closeLetter() {
    if (typeof letterModal.close === 'function') {
      letterModal.close();
    } else {
      letterModal.removeAttribute('open');
    }
  }

  letterLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openLetter(index);
    });
  });

  openGalleryButton?.addEventListener('click', () => openLetter(0));
  closeButton?.addEventListener('click', closeLetter);
  previousButton?.addEventListener('click', () => showLetter(activeIndex - 1));
  nextButton?.addEventListener('click', () => showLetter(activeIndex + 1));

  letterModal.addEventListener('click', (event) => {
    if (event.target === letterModal) closeLetter();
  });

  letterModal.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showLetter(activeIndex - 1);
    if (event.key === 'ArrowRight') showLetter(activeIndex + 1);
  });
}

const documentsOpenButton = document.querySelector('[data-documents-open]');
const documentsModal = document.querySelector('[data-documents-modal]');

if (documentsOpenButton && documentsModal) {
  const documentsCloseButton = documentsModal.querySelector('[data-documents-close]');
  const documentSlides = [...documentsModal.querySelectorAll('[data-document-slide]')];
  const documentsPrevButton = documentsModal.querySelector('[data-documents-prev]');
  const documentsNextButton = documentsModal.querySelector('[data-documents-next]');
  const documentsCounter = documentsModal.querySelector('[data-documents-counter]');
  let activeDocumentIndex = 0;

  function showDocument(index) {
    if (!documentSlides.length) return;
    activeDocumentIndex = (index + documentSlides.length) % documentSlides.length;
    documentSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeDocumentIndex);
    });
    if (documentsCounter) {
      documentsCounter.textContent = `${activeDocumentIndex + 1} / ${documentSlides.length}`;
    }
  }

  function openDocumentsModal() {
    showDocument(0);
    if (typeof documentsModal.showModal === 'function') {
      documentsModal.showModal();
    } else {
      documentsModal.setAttribute('open', '');
    }
  }

  function closeDocumentsModal() {
    if (typeof documentsModal.close === 'function') {
      documentsModal.close();
    } else {
      documentsModal.removeAttribute('open');
    }
  }

  documentsOpenButton.addEventListener('click', openDocumentsModal);
  documentsCloseButton?.addEventListener('click', closeDocumentsModal);
  documentsPrevButton?.addEventListener('click', () => showDocument(activeDocumentIndex - 1));
  documentsNextButton?.addEventListener('click', () => showDocument(activeDocumentIndex + 1));

  documentsModal.addEventListener('click', (event) => {
    if (event.target === documentsModal) closeDocumentsModal();
  });

  documentsModal.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showDocument(activeDocumentIndex - 1);
    if (event.key === 'ArrowRight') showDocument(activeDocumentIndex + 1);
  });
}
