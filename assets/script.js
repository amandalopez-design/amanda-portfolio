// Carga de proyectos desde JSON y render
const grid = document.getElementById('grid');
const modal = document.getElementById('caseModal');
const caseTitle = document.getElementById('caseTitle');
const caseDesc  = document.getElementById('caseDesc');
const caseImg   = document.getElementById('caseImg');
const caseMeta  = document.getElementById('caseMeta');

let allProjects = [];
let currentFilter = '*';

fetch('assets/projects.json')
  .then(r => r.json())
  .then(data => {
    allProjects = data.projects || [];
    render();
  });

function render(){
  grid.innerHTML = '';
  const list = allProjects.filter(p => currentFilter === '*' || (p.tags||[]).includes(currentFilter));
  for (const p of list){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${p.cover}" alt="${p.title}" loading="lazy">
      <div class="meta">
        <div>
          <h3>${p.title}</h3>
          <div class="tags">${(p.tags||[]).map(t => `<span>#${t}</span>`).join(' ')}</div>
        </div>
        <button class="filter" data-id="${p.id}">Ver</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => openCase(p));
    grid.appendChild(card);
  }
}

function openCase(p){
  caseTitle.textContent = p.title;
  caseDesc.textContent  = p.description || '';
  caseImg.src = p.image || p.cover;
  caseImg.alt = p.title;
  caseMeta.innerHTML = `
    <p><strong>Rol:</strong> ${p.role || 'Diseño'}</p>
    <p><strong>Cliente:</strong> ${p.client || '—'}</p>
    <p><strong>Año:</strong> ${p.year || '—'}</p>
    <p>${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">Ver proyecto ↗</a>` : ''}</p>
  `;
  modal.showModal();
}

// Filtros
document.querySelectorAll('.filters .filter').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    if (!f){ return; }
    document.querySelectorAll('.filters .filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentFilter = f;
    render();
  });
});

// Tema claro/oscuro manual
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
});

// Cerrar modal con Escape
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.open) modal.close();
});
