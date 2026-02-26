const header = document.getElementById('header');
const loader = document.getElementById('loader');
const reveals = document.querySelectorAll('.reveal');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const heroBg = document.querySelector('.hero__bg');

const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalText = document.getElementById('projectModalText');

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
  if (!details || !projectModal) {
    return;
  }
  projectModalTitle.textContent = details.title;
  projectModalText.textContent = details.text;
  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
};

const closeProjectModal = () => {
  if (!projectModal) {
    return;
  }
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
};


window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 450);
});

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'in-view');
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((item) => observer.observe(item));

window.addEventListener('scroll', () => {
  updateHeader();
  if (heroBg) {
    const offset = window.scrollY * 0.18;
    heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
  }
});

updateHeader();

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
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

// Simple mock form handling to keep page behavior polished.
const form = document.querySelector('.contact-form');
form.addEventListener('submit', (event) => {
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

if (projectModal) {
  projectModal.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
      closeProjectModal();
    }
  });
}

if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProjectModal();
  }
});
