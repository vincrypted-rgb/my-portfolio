/* ===========================================================
   Portfolio — Windows 11 File Explorer
   ------------------------------------------------------------
   HOW TO ADD YOUR OWN PROJECTS / CONTENT
   Edit the `fileSystem` object right below. Each folder has a
   `children` array. A "file" node can be:
     - a text file:  { type:'file', ext:'txt', content:'...' }
     - a link file:  { type:'file', ext:'url', linkUrl:'https://...' }
     - a pdf file:   { type:'file', ext:'pdf', fileUrl:'assets/resume.pdf' }
   Add an `assets` folder next to this file for images/resume if
   you want the Resume.pdf and image files to actually open.
=========================================================== */

let idCounter = 1;
function uid(prefix){ return prefix + '-' + (idCounter++); }

const fileSystem = {
  id: 'root',
  name: 'Home',
  type: 'folder',
  dateModified: '9/1/2026 9:00 AM',
  children: [
    {
      id: 'projects', name: 'Projects', type: 'folder', dateModified: '9/1/2026 9:00 AM',
      children: [
        {
          id: 'project1', name: 'Project One', type: 'folder', dateModified: '9/1/2026 9:00 AM',
          children: [
            { id: 'p1-readme', name: 'README.txt', type: 'file', ext: 'txt', fileType: 'Text Document', size: '1 KB', dateModified: '9/1/2026 9:00 AM',
              content: 'PROJECT ONE\n\nReplace this with a short write-up:\n  • What the project does\n  • The stack you used\n  • A link to the live demo or repo\n\nTip: edit the "fileSystem" object at the top of script.js to swap in your real projects and folders.' },
            { id: 'p1-demo', name: 'Live Demo.url', type: 'file', ext: 'url', fileType: 'Internet Shortcut', size: '1 KB', dateModified: '9/1/2026 9:00 AM', linkUrl: '#' }
          ]
        },
        {
          id: 'project2', name: 'Project Two', type: 'folder', dateModified: '8/14/2026 4:20 PM',
          children: [
            { id: 'p2-readme', name: 'README.txt', type: 'file', ext: 'txt', fileType: 'Text Document', size: '1 KB', dateModified: '8/14/2026 4:20 PM',
              content: 'PROJECT TWO\n\nAnother placeholder project folder — edit fileSystem.children[0].children in script.js to describe it.' }
          ]
        },
        {
          id: 'project3', name: 'Project Three', type: 'folder', dateModified: '7/2/2026 11:05 AM',
          children: [
            { id: 'p3-readme', name: 'README.txt', type: 'file', ext: 'txt', fileType: 'Text Document', size: '1 KB', dateModified: '7/2/2026 11:05 AM',
              content: 'PROJECT THREE\n\nSwap this in for your own project details, screenshots, and links.' }
          ]
        }
      ]
    },
    {
      id: 'about', name: 'About Me', type: 'folder', dateModified: '9/1/2026 9:00 AM',
      children: [
        { id: 'about-txt', name: 'About.txt', type: 'file', ext: 'txt', fileType: 'Text Document', size: '1 KB', dateModified: '9/1/2026 9:00 AM',
          content: "Hi, I'm [Your Name] — a [your role] who likes building things and figuring out how they work.\n\nEdit this text by opening script.js and changing the \"content\" field of the node with id 'about-txt'." }
      ]
    },
    {
      id: 'skills', name: 'Skills', type: 'folder', dateModified: '9/1/2026 9:00 AM',
      children: [
        { id: 'skills-lang', name: 'Languages.txt', type: 'file', ext: 'txt', fileType: 'Text Document', size: '1 KB', dateModified: '9/1/2026 9:00 AM',
          content: 'JavaScript, Python, ... (edit me in script.js)' },
        { id: 'skills-tools', name: 'Tools & Frameworks.txt', type: 'file', ext: 'txt', fileType: 'Text Document', size: '1 KB', dateModified: '9/1/2026 9:00 AM',
          content: 'React, Node.js, Git, ... (edit me in script.js)' }
      ]
    },
    {
      id: 'resume', name: 'Resume', type: 'folder', dateModified: '9/1/2026 9:00 AM',
      children: [
        { id: 'resume-pdf', name: 'Resume.pdf', type: 'file', ext: 'pdf', fileType: 'PDF Document', size: '—', dateModified: '9/1/2026 9:00 AM', fileUrl: 'assets/resume.pdf' }
      ]
    },
    {
      id: 'contact', name: 'Contact', type: 'folder', dateModified: '9/1/2026 9:00 AM',
      children: [
        { id: 'contact-email', name: 'Email Me.url', type: 'file', ext: 'url', fileType: 'Internet Shortcut', size: '1 KB', dateModified: '9/1/2026 9:00 AM', linkUrl: 'mailto:you@example.com' },
        { id: 'contact-linkedin', name: 'LinkedIn.url', type: 'file', ext: 'url', fileType: 'Internet Shortcut', size: '1 KB', dateModified: '9/1/2026 9:00 AM', linkUrl: 'https://linkedin.com/in/yourprofile' },
        { id: 'contact-github', name: 'GitHub.url', type: 'file', ext: 'url', fileType: 'Internet Shortcut', size: '1 KB', dateModified: '9/1/2026 9:00 AM', linkUrl: 'https://github.com/yourusername' }
      ]
    },
    { id: 'gallery', name: 'Gallery', type: 'folder', dateModified: '9/1/2026 9:00 AM', children: [] }
  ]
};

const SIDEBAR_QUICK = ['projects', 'resume'];
const SIDEBAR_PC = ['about', 'skills', 'contact', 'gallery'];

/* ---------------- State ---------------- */
const state = {
  path: [],
  history: [[]],
  historyIndex: 0,
  view: 'medium',
  sortKey: 'name',
  sortDir: 'asc',
  selectedId: null,
  searchTerm: '',
  theme: 'light'
};
let deletedItems = [];

/* ---------------- Helpers ---------------- */
function getNode(path){
  let node = fileSystem;
  for(const id of path){
    if(!node.children) return null;
    node = node.children.find(c => c.id === id);
    if(!node) return null;
  }
  return node;
}
function getParentAndFolder(path){
  const folder = getNode(path);
  return folder;
}
function pathsEqual(a, b){ return JSON.stringify(a) === JSON.stringify(b); }

function folderIconSVG(size){
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}">
    <path d="M4 12a2 2 0 0 1 2-2h11l3 4h22a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12z" fill="#FFC83D"/>
    <path d="M4 19h40v17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V19z" fill="#FFA000"/>
  </svg>`;
}
function fileIconSVG(size, color, label){
  return `<svg viewBox="0 0 40 48" width="${size}" height="${size}">
    <path d="M4 2h20l12 12v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#FFFFFF" stroke="#C9C9C9" stroke-width="1"/>
    <path d="M24 2l12 12H26a2 2 0 0 1-2-2V2z" fill="#E4E4E4"/>
    <rect x="2" y="30" width="36" height="14" rx="2" fill="${color}"/>
    <text x="20" y="40" font-size="10" font-family="Segoe UI, Arial" fill="#fff" text-anchor="middle" font-weight="700">${label}</text>
  </svg>`;
}
function linkIconSVG(size){
  return `<svg viewBox="0 0 40 48" width="${size}" height="${size}">
    <path d="M4 2h20l12 12v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#FFFFFF" stroke="#C9C9C9" stroke-width="1"/>
    <path d="M24 2l12 12H26a2 2 0 0 1-2-2V2z" fill="#E4E4E4"/>
    <circle cx="14" cy="30" r="10" fill="#0067C0" opacity="0"/>
    <g transform="translate(6,24)">
      <circle cx="10" cy="10" r="9" fill="#0EA5E9"/>
      <path d="M6 10a4 4 0 0 1 4-4h1M14 10a4 4 0 0 1-4 4h-1" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}
function iconFor(node, size){
  size = size || 40;
  if(node.type === 'folder') return folderIconSVG(size);
  if(node.ext === 'url') return linkIconSVG(size);
  if(node.ext === 'pdf') return fileIconSVG(size, '#C42B1C', 'PDF');
  if(node.ext === 'txt') return fileIconSVG(size, '#2B6FC4', 'TXT');
  return fileIconSVG(size, '#6E6E6E', 'FILE');
}
function typeLabel(node){
  if(node.type === 'folder') return 'File folder';
  return node.fileType || 'File';
}
function sizeValue(node){
  if(node.type === 'folder') return -1;
  const m = /([\d.]+)/.exec(node.size || '');
  return m ? parseFloat(m[1]) : 0;
}
function dateValue(node){
  const t = Date.parse(node.dateModified || '');
  return isNaN(t) ? 0 : t;
}

/* ---------------- Navigation ---------------- */
function navigateTo(path, opts){
  opts = opts || {};
  const node = getNode(path);
  if(!node || node.type !== 'folder') return;
  if(opts.pushHistory !== false){
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(path.slice());
    state.historyIndex = state.history.length - 1;
  }
  state.path = path.slice();
  state.selectedId = null;
  state.searchTerm = '';
  document.getElementById('searchInput').value = '';
  renderAll();
}
function goBack(){
  if(state.historyIndex <= 0) return;
  state.historyIndex--;
  state.path = state.history[state.historyIndex].slice();
  state.selectedId = null;
  renderAll();
}
function goForward(){
  if(state.historyIndex >= state.history.length - 1) return;
  state.historyIndex++;
  state.path = state.history[state.historyIndex].slice();
  state.selectedId = null;
  renderAll();
}
function goUp(){
  if(state.path.length === 0) return;
  navigateTo(state.path.slice(0, -1));
}

/* ---------------- Rendering ---------------- */
function renderAll(){
  renderBreadcrumb();
  renderSidebar();
  renderContent();
  renderStatusbar();
  renderNavButtons();
  const node = getNode(state.path);
  document.getElementById('windowTitle').textContent = node ? node.name : 'Home';
}

function renderNavButtons(){
  document.getElementById('btnBack').disabled = state.historyIndex <= 0;
  document.getElementById('btnForward').disabled = state.historyIndex >= state.history.length - 1;
  document.getElementById('btnUp').disabled = state.path.length === 0;
}

function renderBreadcrumb(){
  const el = document.getElementById('breadcrumb');
  el.innerHTML = '';
  const crumbs = [{ id: null, name: 'Home', path: [] }];
  let cur = [];
  for(const id of state.path){
    cur = cur.concat([id]);
    const node = getNode(cur);
    crumbs.push({ id, name: node ? node.name : id, path: cur.slice() });
  }
  crumbs.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'crumb' + (i === crumbs.length - 1 ? ' current' : '');
    btn.textContent = c.name;
    btn.addEventListener('click', () => { if(i !== crumbs.length - 1) navigateTo(c.path); });
    el.appendChild(btn);
    if(i !== crumbs.length - 1){
      const sep = document.createElement('span');
      sep.className = 'crumb-sep';
      sep.textContent = '›';
      el.appendChild(sep);
    }
  });
}

function renderSidebar(){
  const el = document.getElementById('sidebar');
  el.innerHTML = '';

  function row(label, path, icon){
    const btn = document.createElement('button');
    const active = pathsEqual(state.path, path);
    btn.className = 'sidebar-item' + (active ? ' active' : '');
    btn.innerHTML = icon + '<span>' + label + '</span>';
    btn.addEventListener('click', () => navigateTo(path));
    return btn;
  }

  const homeLabel = document.createElement('div');
  homeLabel.className = 'sidebar-group-label';
  homeLabel.textContent = 'Quick access';
  el.appendChild(homeLabel);
  el.appendChild(row('Home', [], folderIconSVGSmall()));
  SIDEBAR_QUICK.forEach(id => {
    const node = fileSystem.children.find(c => c.id === id);
    if(node) el.appendChild(row(node.name, [id], folderIconSVGSmall()));
  });

  const pcLabel = document.createElement('div');
  pcLabel.className = 'sidebar-group-label';
  pcLabel.textContent = 'This PC';
  el.appendChild(pcLabel);
  SIDEBAR_PC.forEach(id => {
    const node = fileSystem.children.find(c => c.id === id);
    if(node) el.appendChild(row(node.name, [id], folderIconSVGSmall()));
  });
}
function folderIconSVGSmall(){
  return `<svg viewBox="0 0 48 48" width="16" height="16">
    <path d="M4 12a2 2 0 0 1 2-2h11l3 4h22a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12z" fill="#FFC83D"/>
    <path d="M4 19h40v17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V19z" fill="#FFA000"/>
  </svg>`;
}

function getVisibleChildren(){
  const folder = getNode(state.path);
  if(!folder || !folder.children) return [];
  let items = folder.children.slice();
  if(state.searchTerm){
    const term = state.searchTerm.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(term));
  }
  const folders = items.filter(i => i.type === 'folder');
  const files = items.filter(i => i.type === 'file');
  function cmp(a, b){
    let av, bv;
    if(state.sortKey === 'name'){ av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    else if(state.sortKey === 'date'){ av = dateValue(a); bv = dateValue(b); }
    else if(state.sortKey === 'type'){ av = typeLabel(a).toLowerCase(); bv = typeLabel(b).toLowerCase(); }
    else if(state.sortKey === 'size'){ av = sizeValue(a); bv = sizeValue(b); }
    if(av < bv) return state.sortDir === 'asc' ? -1 : 1;
    if(av > bv) return state.sortDir === 'asc' ? 1 : -1;
    return 0;
  }
  folders.sort(cmp);
  files.sort(cmp);
  return folders.concat(files);
}

function renderContent(){
  const content = document.getElementById('content');
  content.innerHTML = '';
  const items = getVisibleChildren();

  if(items.length === 0){
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const noSearch = !state.searchTerm;
    empty.innerHTML = `
      <div class="empty-icon">${folderIconSVG(56)}</div>
      <div class="empty-title">${state.searchTerm ? 'No matches found' : 'This folder is empty'}</div>
      <div class="empty-sub">${state.searchTerm ? 'Try a different search term.' : 'Add projects here by editing the fileSystem object in script.js.'}</div>`;
    content.appendChild(empty);
    return;
  }

  if(state.view === 'details'){
    content.appendChild(buildDetailsTable(items));
  } else if(state.view === 'list'){
    const wrap = document.createElement('div');
    wrap.className = 'list-view';
    items.forEach(node => wrap.appendChild(buildItemEl(node, 22)));
    content.appendChild(wrap);
  } else {
    const wrap = document.createElement('div');
    wrap.className = 'grid-view ' + state.view;
    items.forEach(node => wrap.appendChild(buildItemEl(node, state.view === 'large' ? 56 : 34)));
    content.appendChild(wrap);
  }
}

function buildItemEl(node, iconSize){
  const el = document.createElement('div');
  el.className = 'item' + (state.selectedId === node.id ? ' selected' : '');
  el.dataset.id = node.id;
  el.innerHTML = `<div class="icon-wrap">${iconFor(node, iconSize)}</div><div class="item-name">${escapeHtml(node.name)}</div>`;
  attachItemEvents(el, node);
  return el;
}

function buildDetailsTable(items){
  const table = document.createElement('table');
  table.className = 'details-view';
  const arrow = (key) => state.sortKey === key ? (state.sortDir === 'asc' ? '▲' : '▼') : '';
  table.innerHTML = `<thead><tr>
      <th data-key="name">Name <span class="sort-arrow">${arrow('name')}</span></th>
      <th data-key="date">Date modified <span class="sort-arrow">${arrow('date')}</span></th>
      <th data-key="type">Type <span class="sort-arrow">${arrow('type')}</span></th>
      <th data-key="size">Size <span class="sort-arrow">${arrow('size')}</span></th>
    </tr></thead><tbody></tbody>`;
  table.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => setSort(th.dataset.key));
  });
  const tbody = table.querySelector('tbody');
  items.forEach(node => {
    const tr = document.createElement('tr');
    tr.className = state.selectedId === node.id ? 'selected' : '';
    tr.dataset.id = node.id;
    tr.innerHTML = `<td class="name-cell"><span class="icon-wrap">${iconFor(node, 18)}</span>${escapeHtml(node.name)}</td>
      <td class="col-date">${node.dateModified || ''}</td>
      <td class="col-type">${typeLabel(node)}</td>
      <td class="col-size">${node.type === 'folder' ? '' : (node.size || '')}</td>`;
    attachItemEvents(tr, node);
    tbody.appendChild(tr);
  });
  return table;
}

function attachItemEvents(el, node){
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    state.selectedId = node.id;
    renderContent();
    renderStatusbar();
  });
  el.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    openItem(node);
  });
  el.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.selectedId = node.id;
    renderContent();
    showItemContextMenu(e.clientX, e.clientY, node);
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderStatusbar(){
  const items = getVisibleChildren();
  const left = document.getElementById('statusLeft');
  left.textContent = state.selectedId
    ? '1 item selected'
    : items.length + (items.length === 1 ? ' item' : ' items');
  document.querySelectorAll('.status-icon-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.quickview === state.view || (b.dataset.quickview === 'large' && state.view === 'medium'));
  });
}

/* ---------------- Sorting / View ---------------- */
function setSort(key){
  if(state.sortKey === key){
    state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.sortKey = key;
    state.sortDir = 'asc';
  }
  document.querySelectorAll('#sortPanel button').forEach(b => b.classList.toggle('active', b.dataset.sort === key));
  renderContent();
}
function setView(view){
  state.view = view;
  document.querySelectorAll('#viewPanel button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  renderContent();
  renderStatusbar();
}

/* ---------------- Opening items ---------------- */
function openItem(node){
  if(node.type === 'folder'){
    navigateTo(state.path.concat([node.id]));
    return;
  }
  if(node.ext === 'url' && node.linkUrl){
    if(node.linkUrl === '#'){
      showToast('Add a real link for "' + node.name + '" in script.js (linkUrl).');
      return;
    }
    window.open(node.linkUrl, '_blank');
    return;
  }
  if(node.ext === 'pdf' && node.fileUrl){
    fetch(node.fileUrl, { method: 'HEAD' }).then(res => {
      if(res.ok) window.open(node.fileUrl, '_blank');
      else showMissingAssetModal(node);
    }).catch(() => showMissingAssetModal(node));
    return;
  }
  if(node.ext === 'txt'){
    showModal('Notepad — ' + node.name, `<div>${escapeHtml(node.content || '')}</div>`);
    return;
  }
  showModal(node.name, `<div>Preview not available for this file type.</div>`);
}

function showMissingAssetModal(node){
  showModal('Can\u2019t open ' + node.name, `
    <div>This file points to <strong>${escapeHtml(node.fileUrl)}</strong>, which hasn't been added to the project yet.</div>
    <div style="margin-top:10px;">Add your resume PDF at that path in the repository to make this open for real.</div>
    <div class="modal-actions"><button class="btn primary" onclick="closeModal()">Got it</button></div>
  `);
}

/* ---------------- Modal ---------------- */
function showModal(title, html){
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').hidden = false;
}
function closeModal(){
  document.getElementById('modalOverlay').hidden = true;
}

/* ---------------- Properties ---------------- */
function showProperties(node){
  const locationPath = 'Home' + state.path.map(id => {
    return '';
  }).join('');
  const crumbNames = ['Home'].concat(state.path.map(id => {
    const n = getNode(state.path.slice(0, state.path.indexOf(id) + 1));
    return n ? n.name : id;
  }));
  showModal(node.name + ' Properties', `
    <div class="prop-row"><span>Name</span><span>${escapeHtml(node.name)}</span></div>
    <div class="prop-row"><span>Type</span><span>${typeLabel(node)}</span></div>
    <div class="prop-row"><span>Location</span><span>${escapeHtml(crumbNames.join(' \u203a '))}</span></div>
    <div class="prop-row"><span>Size</span><span>${node.type === 'folder' ? (node.children ? node.children.length + ' item(s)' : '0 items') : (node.size || '\u2014')}</span></div>
    <div class="prop-row"><span>Modified</span><span>${node.dateModified || '\u2014'}</span></div>
    <div class="modal-actions"><button class="btn primary" onclick="closeModal()">OK</button></div>
  `);
}

/* ---------------- New folder / rename / delete ---------------- */
function createNewFolder(){
  const folder = getNode(state.path);
  if(!folder || !folder.children) return;
  const newNode = { id: uid('folder'), name: 'New folder', type: 'folder', dateModified: new Date().toLocaleString(), children: [] };
  folder.children.push(newNode);
  state.selectedId = newNode.id;
  renderContent();
  renderStatusbar();
  setTimeout(() => startRename(newNode.id), 30);
}

function startRename(id){
  const el = document.querySelector('.item[data-id="' + id + '"], tr[data-id="' + id + '"]');
  if(!el) return;
  const nameEl = el.querySelector('.item-name') || el.querySelector('.name-cell');
  if(!nameEl) return;
  const node = getNode(state.path).children.find(c => c.id === id);
  const isRow = el.tagName === 'TR';
  const input = document.createElement('input');
  input.className = 'rename-input';
  input.value = node.name;
  if(isRow){
    input.style.marginTop = '0';
    input.style.width = '160px';
  }
  nameEl.replaceWith(input);
  input.focus();
  input.select();
  function commit(){
    const val = input.value.trim();
    node.name = val || node.name;
    renderContent();
    renderStatusbar();
    renderSidebar();
  }
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ commit(); }
    else if(e.key === 'Escape'){ renderContent(); }
  });
  input.addEventListener('blur', commit);
}

function deleteSelected(node){
  const folder = getNode(state.path);
  if(!folder || !folder.children) return;
  const idx = folder.children.findIndex(c => c.id === node.id);
  if(idx === -1) return;
  folder.children.splice(idx, 1);
  deletedItems.push({ name: node.name, type: node.type, from: state.path.slice() });
  if(state.selectedId === node.id) state.selectedId = null;
  renderContent();
  renderStatusbar();
  renderSidebar();
  showToast('"' + node.name + '" moved to Recycle Bin');
}

/* ---------------- Context menus ---------------- */
function hideContextMenu(){
  document.getElementById('contextMenu').hidden = true;
}
function positionMenu(menu, x, y){
  menu.style.left = '0px'; menu.style.top = '0px'; menu.hidden = false;
  const rect = menu.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  const left = Math.min(x, vw - rect.width - 8);
  const top = Math.min(y, vh - rect.height - 60);
  menu.style.left = Math.max(4, left) + 'px';
  menu.style.top = Math.max(4, top) + 'px';
}
function buildMenuItem(label, onClick, disabled){
  const li = document.createElement('li');
  li.textContent = label;
  if(disabled){ li.classList.add('disabled'); }
  else li.addEventListener('click', () => { onClick(); hideContextMenu(); });
  return li;
}
function menuSep(){
  const li = document.createElement('li');
  li.className = 'menu-sep';
  return li;
}
function showBackgroundContextMenu(x, y){
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = '';
  menu.appendChild(buildMenuItem('New folder', createNewFolder));
  menu.appendChild(buildMenuItem('Refresh', renderAll));
  menu.appendChild(menuSep());
  menu.appendChild(buildMenuItem('Large icons', () => setView('large')));
  menu.appendChild(buildMenuItem('Medium icons', () => setView('medium')));
  menu.appendChild(buildMenuItem('List', () => setView('list')));
  menu.appendChild(buildMenuItem('Details', () => setView('details')));
  menu.appendChild(menuSep());
  menu.appendChild(buildMenuItem('Properties', () => showProperties(getNode(state.path))));
  positionMenu(menu, x, y);
}
function showItemContextMenu(x, y, node){
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = '';
  menu.appendChild(buildMenuItem('Open', () => openItem(node)));
  menu.appendChild(menuSep());
  menu.appendChild(buildMenuItem('Rename', () => startRename(node.id)));
  menu.appendChild(buildMenuItem('Delete', () => deleteSelected(node)));
  menu.appendChild(menuSep());
  menu.appendChild(buildMenuItem('Properties', () => showProperties(node)));
  positionMenu(menu, x, y);
}

/* ---------------- Recycle bin ---------------- */
function openRecycleBin(){
  const items = deletedItems.slice().reverse();
  const listHtml = items.length
    ? '<ul class="bin-list">' + items.map(i => `<li>${iconFor({type:i.type}, 18)}<span>${escapeHtml(i.name)}</span></li>`).join('') + '</ul>'
    : '<div>Recycle Bin is empty.</div>';
  showModal('Recycle Bin', `
    ${listHtml}
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Close</button>
      <button class="btn primary" onclick="emptyRecycleBin()">Empty Recycle Bin</button>
    </div>
  `);
}
function emptyRecycleBin(){
  deletedItems = [];
  closeModal();
  showToast('Recycle Bin emptied');
}

/* ---------------- Toast ---------------- */
let toastTimer = null;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------------- Theme ---------------- */
function toggleTheme(){
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
}

/* ---------------- Window controls (minimize / maximize / close) ---------------- */
const win = () => document.getElementById('explorerWindow');
const chip = () => document.getElementById('taskbarChip');
const taskExplorerBtn = () => document.getElementById('taskExplorer');
let lastRect = null;

function minimizeWindow(){
  win().classList.add('minimized');
  win().classList.remove('closed');
  chip().hidden = false;
  taskExplorerBtn().classList.remove('running');
}
function restoreWindow(){
  win().classList.remove('minimized', 'closed');
  chip().hidden = true;
  taskExplorerBtn().classList.add('running');
}
function toggleMaximize(){
  const w = win();
  if(w.classList.contains('maximized')){
    w.classList.remove('maximized');
    if(lastRect){
      w.style.top = lastRect.top; w.style.left = lastRect.left;
      w.style.width = lastRect.width; w.style.height = lastRect.height;
    }
  } else {
    lastRect = { top: w.style.top || '6vh', left: w.style.left || '12vw', width: w.style.width || '76vw', height: w.style.height || '82vh' };
    w.classList.add('maximized');
  }
}
function closeWindow(){
  showModal('Close File Explorer?', `
    <div>Are you sure you want to close this window? You can reopen it anytime from the taskbar.</div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn primary" id="confirmCloseBtn">Close window</button>
    </div>
  `);
  document.getElementById('confirmCloseBtn').addEventListener('click', () => {
    closeModal();
    win().classList.add('closed');
    win().classList.remove('minimized', 'maximized');
    chip().hidden = true;
    taskExplorerBtn().classList.remove('running');
    showToast('Explorer closed — reopen it from the taskbar');
  });
}

/* ---------------- Dragging the window ---------------- */
function initDrag(){
  const titlebar = document.getElementById('titlebar');
  let dragging = false, offX = 0, offY = 0;
  titlebar.addEventListener('mousedown', (e) => {
    if(e.target.closest('.win-btn')) return;
    if(win().classList.contains('maximized')) return;
    dragging = true;
    const rect = win().getBoundingClientRect();
    offX = e.clientX - rect.left;
    offY = e.clientY - rect.top;
    win().classList.add('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if(!dragging) return;
    let x = e.clientX - offX;
    let y = e.clientY - offY;
    x = Math.max(-win().offsetWidth + 120, Math.min(x, window.innerWidth - 80));
    y = Math.max(0, Math.min(y, window.innerHeight - 40));
    win().style.left = x + 'px';
    win().style.top = y + 'px';
  });
  window.addEventListener('mouseup', () => {
    if(dragging){ dragging = false; win().classList.remove('dragging'); }
  });
  titlebar.addEventListener('dblclick', (e) => {
    if(e.target.closest('.win-btn')) return;
    toggleMaximize();
  });
}

/* ---------------- Clock ---------------- */
function updateClock(){
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
  document.getElementById('clock').innerHTML = time + '<br>' + date;
}

/* ---------------- Start menu ---------------- */
function toggleStartMenu(){
  const menu = document.getElementById('startMenu');
  menu.hidden = !menu.hidden;
}
function handleStartTile(action){
  document.getElementById('startMenu').hidden = true;
  if(action === 'explorer'){
    restoreWindow();
  } else if(action === 'github'){
    const node = getNode(['contact']).children.find(c => c.id === 'contact-github');
    window.open(node.linkUrl, '_blank');
  } else if(action === 'linkedin'){
    const node = getNode(['contact']).children.find(c => c.id === 'contact-linkedin');
    window.open(node.linkUrl, '_blank');
  } else if(action === 'email'){
    const node = getNode(['contact']).children.find(c => c.id === 'contact-email');
    window.location.href = node.linkUrl;
  }
}

/* ---------------- Wiring ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Nav
  document.getElementById('btnBack').addEventListener('click', goBack);
  document.getElementById('btnForward').addEventListener('click', goForward);
  document.getElementById('btnUp').addEventListener('click', goUp);
  document.getElementById('cmdRefresh').addEventListener('click', renderAll);
  document.getElementById('cmdNew').addEventListener('click', createNewFolder);

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchTerm = e.target.value;
    renderContent();
    renderStatusbar();
  });

  // Sort dropdown
  const sortPanel = document.getElementById('sortPanel');
  document.getElementById('cmdSort').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('viewPanel').hidden = true;
    sortPanel.hidden = !sortPanel.hidden;
  });
  sortPanel.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => { setSort(b.dataset.sort); sortPanel.hidden = true; });
  });

  // View dropdown
  const viewPanel = document.getElementById('viewPanel');
  document.getElementById('cmdView').addEventListener('click', (e) => {
    e.stopPropagation();
    sortPanel.hidden = true;
    viewPanel.hidden = !viewPanel.hidden;
  });
  viewPanel.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => { setView(b.dataset.view); viewPanel.hidden = true; });
  });

  // Status bar quick view buttons
  document.querySelectorAll('.status-icon-btn').forEach(b => {
    b.addEventListener('click', () => setView(b.dataset.quickview === 'large' ? 'large' : 'details'));
  });

  // Content background click/context menu
  const content = document.getElementById('content');
  content.addEventListener('click', () => {
    state.selectedId = null;
    renderContent();
    renderStatusbar();
  });
  content.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if(e.target === content) showBackgroundContextMenu(e.clientX, e.clientY);
  });

  document.addEventListener('click', (e) => {
    hideContextMenu();
    if(!e.target.closest('.cmd-dropdown-wrap')){ sortPanel.hidden = true; viewPanel.hidden = true; }
    if(!e.target.closest('.start-menu') && !e.target.closest('#startBtn')){
      document.getElementById('startMenu').hidden = true;
    }
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){ closeModal(); hideContextMenu(); }
    if(e.key === 'Backspace' && document.activeElement.tagName !== 'INPUT'){ goUp(); }
    if(e.key === 'Enter' && state.selectedId && document.activeElement.tagName !== 'INPUT'){
      const folder = getNode(state.path);
      const node = folder.children.find(c => c.id === state.selectedId);
      if(node) openItem(node);
    }
  });

  // Window controls
  document.getElementById('btnMinimize').addEventListener('click', minimizeWindow);
  document.getElementById('btnMaximize').addEventListener('click', toggleMaximize);
  document.getElementById('btnClose').addEventListener('click', closeWindow);
  document.getElementById('btnTheme').addEventListener('click', toggleTheme);
  initDrag();

  // Taskbar chip / explorer icon
  document.getElementById('taskbarChip').addEventListener('click', restoreWindow);
  taskExplorerBtn().addEventListener('click', () => {
    const w = win();
    if(w.classList.contains('minimized') || w.classList.contains('closed')) restoreWindow();
    else minimizeWindow();
  });
  taskExplorerBtn().classList.add('running');

  // Desktop icons
  document.getElementById('iconThisPC').addEventListener('click', () => { restoreWindow(); navigateTo([]); });
  document.getElementById('iconRecycleBin').addEventListener('click', openRecycleBin);

  // Start menu
  document.getElementById('startBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleStartMenu(); });
  document.querySelectorAll('.start-tile').forEach(t => {
    t.addEventListener('click', () => handleStartTile(t.dataset.action));
  });

  // Taskbar web search
  document.getElementById('taskbarSearchInput').addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && e.target.value.trim()){
      window.open('https://www.google.com/search?q=' + encodeURIComponent(e.target.value.trim()), '_blank');
      e.target.value = '';
    }
  });

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if(e.target.id === 'modalOverlay') closeModal();
  });

  // Init
  document.querySelector('#sortPanel button[data-sort="name"]').classList.add('active');
  document.querySelector('#viewPanel button[data-view="medium"]').classList.add('active');
  updateClock();
  setInterval(updateClock, 15000);
  renderAll();
});
