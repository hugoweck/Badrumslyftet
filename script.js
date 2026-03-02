const header = document.getElementById('header');
const loader = document.getElementById('loader');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const heroBg = document.querySelector('.hero__bg');

const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalText = document.getElementById('projectModalText');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLowPowerDevice =
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
  (navigator.deviceMemory && navigator.deviceMemory <= 4);

const projectDetails = {
  solna: {
    title: 'Badrum i Solna',
    text: 'Det här projektet fokuserade på smart förvaring och en varm hotellkänsla med ljus microcement och infälld LED-belysning. Kunden ville ha en lugn helhet som är lätt att hålla ren i vardagen.',
  },
  nacka: {
    title: 'Badrum i Nacka',
    text: 'I Nacka tog vi fram en modern lösning med större duschyta, nischhyllor och en stilren kommod i ekton. Målet var att få ett mer exklusivt intryck utan att kompromissa med funktion.',
  },
  taby: {
    title: 'Badrum i Täby',
    text: 'Här prioriterades tillgänglighet och tydliga linjer med stora kakelplattor och glasvägg i duschen. Resultatet blev ett ljust familjebadrum med hållbara materialval för lång livslängd.',
  },
  bromma: {
    title: 'Badrum i Bromma',
    text: 'Brommaprojektet fick en klassisk skandinavisk känsla med mässingsdetaljer, golvvärme och specialbyggd spegellösning. Kunden önskade en tidlös stil som känns lika fin om många år.',
  },
  sundbyberg: {
    title: 'Badrum i Sundbyberg',
    text: 'I Sundbyberg optimerade vi ytan i ett mindre badrum med vägghängd inredning och skräddarsydda förvaringsmoduler. Fokus låg på att skapa ett öppnare intryck trots begränsade kvadratmeter.',
  },
  lidingo: {
    title: 'Badrum i Lidingö',
    text: 'Detta badrum kombinerar naturtoner, duschhörna med taksil och diskret spotbelysning för en avkopplande känsla. Kunden ville ha en spa-liknande miljö med hög komfort i varje detalj.',
  },
};

const openProjectModal = (projectKey) => {
  const details = projectDetails[projectKey];
  if (!details || !projectModal) return;
  projectModalTitle.textContent = details.title;
  projectModalText.textContent = details.text;
  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
};

const closeProjectModal = () => {
  if (!projectModal) return;
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
};

window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hidden'), 450);
});

let lastScrollY = window.scrollY;
const updateHeader = () => {
  if (!header) return;
  const currentY = window.scrollY;
  header.classList.toggle('scrolled', currentY > 24);
  if (currentY > lastScrollY && currentY > 140) {
    header.classList.add('is-hidden');
  } else {
    header.classList.remove('is-hidden');
  }
  lastScrollY = currentY;
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show', 'visible', 'in-view');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach((section) => revealObserver.observe(section));

const initServiceCardAnimation = () => {
  const servicesGrid = document.querySelector('.service-grid');
  const serviceCards = [...document.querySelectorAll('.service-card')];
  if (!servicesGrid || !serviceCards.length) return;

  serviceCards.forEach((card, index) => {
    card.style.setProperty('--stagger-delay', `${index * 90}ms`);
  });

  if (prefersReducedMotion) {
    serviceCards.forEach((card) => card.classList.add('is-visible'));
    return;
  }

  const mobile = window.matchMedia('(max-width: 768px)').matches;
  let revealTimers = [];

  const clearTimers = () => {
    revealTimers.forEach((timer) => window.clearTimeout(timer));
    revealTimers = [];
  };

  const playReveal = () => {
    clearTimers();
    serviceCards.forEach((card, index) => {
      card.classList.remove('is-visible');
      const timer = window.setTimeout(() => {
        card.classList.add('is-visible');
      }, index * 90);
      revealTimers.push(timer);
    });
  };

  const playReverse = () => {
    clearTimers();
    [...serviceCards].reverse().forEach((card, index) => {
      const timer = window.setTimeout(() => {
        card.classList.remove('is-visible');
      }, index * 70);
      revealTimers.push(timer);
    });
  };

  const serviceCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playReveal();
        } else {
          playReverse();
        }
      });
    },
    {
      threshold: mobile ? 0.25 : 0.45,
      rootMargin: mobile ? '0px 0px -18% 0px' : '0px 0px -22% 0px',
    }
  );

  serviceCardObserver.observe(servicesGrid);
};

const initProjectCardAnimation = () => {
  const projectSection = document.querySelector('#projekt');
  const projectCards = [...document.querySelectorAll('.project-grid .project-item')];
  if (!projectSection || !projectCards.length) return;
  const isDesktopViewport = window.matchMedia('(min-width: 769px)').matches;
  let ticking = false;
  let isInView = false;

  projectCards.forEach((card) => {
    card.classList.remove('reveal-side-desktop');
    card.style.removeProperty('--project-shift');
    card.style.removeProperty('--slide-direction');
  });

  if (prefersReducedMotion || !isDesktopViewport) return;

  const recalculateOffset = () => {
    const maxOffset = Math.max(window.innerWidth * 0.82, 720);
    projectSection.style.setProperty('--project-max-offset', `${maxOffset}px`);
  };

  projectCards.forEach((card, index) => {
    const comesFromLeft = index % 2 === 0;
    card.classList.add('reveal-side-desktop');
    card.style.setProperty('--slide-direction', comesFromLeft ? '-1' : '1');
    card.style.setProperty('--project-shift', '1');
  });

  const updateCards = () => {
    ticking = false;
    if (!isInView) return;

    const sectionRect = projectSection.getBoundingClientRect();
    const scrollRange = sectionRect.height + window.innerHeight;
    const rawProgress = (window.innerHeight - sectionRect.top) / scrollRange;
    const sectionProgress = Math.max(0, Math.min(1, rawProgress));
    const distanceFromCenter = Math.abs(sectionProgress - 0.5);
    const centerHoldRange = 0.14;
    const normalizedDistance = Math.max(0, (distanceFromCenter - centerHoldRange) / (0.5 - centerHoldRange));
    const projectShift = Math.min(1, normalizedDistance);

    projectCards.forEach((card) => {
      card.style.setProperty('--project-shift', projectShift.toFixed(4));
    });
  };

  const queueUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateCards);
  };

  const projectCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target !== projectSection) return;
        isInView = entry.isIntersecting;
        if (!isInView) {
          projectCards.forEach((card) => card.style.setProperty('--project-shift', '1'));
          return;
        }
        queueUpdate();
      });
    },
    { threshold: 0, rootMargin: '0px' }
  );

  recalculateOffset();
  projectCardObserver.observe(projectSection);
  window.addEventListener('resize', () => {
    recalculateOffset();
    queueUpdate();
  });
  window.addEventListener('scroll', queueUpdate, { passive: true });
};

const initProcessAnimation = () => {
  const processSection = document.querySelector('#process');
  const processWrap = processSection?.querySelector('[data-process]');
  const processSteps = processSection ? [...processSection.querySelectorAll('[data-step]')] : [];
  const disableProcessAnimation = prefersReducedMotion || isLowPowerDevice;

  if (!processSection || !processWrap || !processSteps.length) return;

  const setDoneSteps = (doneIndex) => {
    processSteps.forEach((step, index) => {
      const isDone = index <= doneIndex;
      step.classList.toggle('is-done', isDone);
      step.classList.toggle('is-pending', !isDone);
    });
  };

  if (disableProcessAnimation) {
    processSection.classList.add('process-static');
    processWrap.style.setProperty('--progress', '100%');
    setDoneSteps(processSteps.length - 1);
    return;
  }

  const activationRange = 0.7;
  const widthUpdateThreshold = 0.5;
  let ticking = false;
  let isInView = false;
  let lastProgressWidth = -1;
  let currentStepIndex = -1;

  processSteps.forEach((step) => step.classList.add('is-pending'));

  const updateProcessState = () => {
    ticking = false;
    if (!isInView) return;

    const sectionRect = processSection.getBoundingClientRect();
    const scrollRange = sectionRect.height + window.innerHeight;
    const rawProgress = (window.innerHeight - sectionRect.top) / scrollRange;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    const effectiveProgress = Math.max(0, Math.min(1, clampedProgress / activationRange));
    const progressWidth = effectiveProgress * 100;

    if (Math.abs(progressWidth - lastProgressWidth) > widthUpdateThreshold) {
      processWrap.style.setProperty('--progress', `${progressWidth}%`);
      lastProgressWidth = progressWidth;
    }

    const nextStepIndex = Math.max(
      -1,
      Math.min(processSteps.length - 1, Math.floor(effectiveProgress * processSteps.length) - 1)
    );

    if (nextStepIndex !== currentStepIndex) {
      currentStepIndex = nextStepIndex;
      setDoneSteps(currentStepIndex);
    }
  };

  const requestProcessUpdate = () => {
    if (!isInView || ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProcessState);
  };

  const processViewportObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
        if (isInView) requestProcessUpdate();
      });
    },
    { threshold: 0, rootMargin: '15% 0px 15% 0px' }
  );

  processViewportObserver.observe(processSection);
  window.addEventListener('scroll', requestProcessUpdate, { passive: true });
  window.addEventListener('resize', requestProcessUpdate);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target);
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toLocaleString('sv-SE');
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));

window.addEventListener('scroll', () => {
  updateHeader();
  if (heroBg) {
    const offset = window.scrollY * 0.18;
    heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
  }
});

updateHeader();

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.add('page-leave');
    window.setTimeout(() => document.body.classList.remove('page-leave'), 400);
  });
});

document.querySelectorAll('.ripple').forEach((button) => {
  button.addEventListener('click', (event) => {
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--x', `${event.clientX - rect.left}px`);
    button.style.setProperty('--y', `${event.clientY - rect.top}px`);
    button.classList.remove('rippling');
    void button.offsetWidth;
    button.classList.add('rippling');
  });
});

const form = document.querySelector('.contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.textContent = 'Skickat! Vi hör av oss snart';
  submitButton.disabled = true;
});

document.querySelectorAll('.project-card').forEach((projectCard) => {
  projectCard.addEventListener('click', (event) => {
    event.preventDefault();
    const projectKey = projectCard.dataset.project;
    openProjectModal(projectKey);
  });
});

projectModal?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
    closeProjectModal();
  }
});

projectModalClose?.addEventListener('click', closeProjectModal);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeProjectModal();
});

initServiceCardAnimation();
initProjectCardAnimation();
initProcessAnimation();
