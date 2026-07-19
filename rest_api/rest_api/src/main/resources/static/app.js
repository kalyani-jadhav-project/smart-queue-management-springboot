const API_BASE = '/api/queue';
let currentFilter = 'WAITING';
let lastToken = null;

const icons = {
  serve: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3l14 9-14 9V3z"/></svg>',
  complete: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  cancel: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  delete: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>'
};

function pad3(n) { return String(n).padStart(3, '0'); }

async function fetchAll() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to load queue');
  return res.json();
}

function statusPillClass(status) {
  switch (status) {
    case 'WAITING': return 'pill pill-waiting';
    case 'SERVING': return 'pill pill-serving';
    case 'COMPLETED': return 'pill pill-completed';
    case 'CANCELLED': return 'pill pill-cancelled';
    default: return 'pill';
  }
}

function setFlapNumber(num) {
  if (num === lastToken) return;
  lastToken = num;
  const flap = document.getElementById('flapNumber');
  flap.innerHTML = '';
  pad3(num).split('').forEach(d => {
    const span = document.createElement('span');
    span.className = 'flap-digit flip';
    span.textContent = d;
    flap.appendChild(span);
  });
}

function renderNowServing(entries) {
  const serving = entries
    .filter(e => e.status === 'SERVING')
    .sort((a, b) => a.tokenNumber - b.tokenNumber)[0];

  const nameEl = document.getElementById('servingName');
  if (serving) {
    setFlapNumber(serving.tokenNumber);
    nameEl.textContent = serving.customerName;
  } else {
    setFlapNumber(0);
    nameEl.textContent = 'Counter is idle';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderList(entries) {
  const list = document.getElementById('queueList');
  const empty = document.getElementById('emptyState');

  let filtered = currentFilter === 'ALL'
    ? entries
    : entries.filter(e => e.status === currentFilter);

  filtered.sort((a, b) => a.tokenNumber - b.tokenNumber);

  list.innerHTML = '';
  if (filtered.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  filtered.forEach(entry => {
    const row = document.createElement('div');
    row.className = 'ticket-row';
    row.innerHTML = `
      <span class="row-token">#${pad3(entry.tokenNumber)}</span>
      <span class="row-name">${escapeHtml(entry.customerName)}</span>
      <span class="${statusPillClass(entry.status)}">${entry.status}</span>
      <span class="row-actions">
        ${entry.status === 'WAITING' ? `<button data-action="serve" data-id="${entry.id}" class="icon-btn" title="Serve">${icons.serve}</button>` : ''}
        ${entry.status === 'SERVING' ? `<button data-action="complete" data-id="${entry.id}" class="icon-btn" title="Complete">${icons.complete}</button>` : ''}
        ${(entry.status === 'WAITING' || entry.status === 'SERVING') ? `<button data-action="cancel" data-id="${entry.id}" class="icon-btn icon-btn-warn" title="Cancel">${icons.cancel}</button>` : ''}
        <button data-action="delete" data-id="${entry.id}" class="icon-btn icon-btn-danger" title="Delete">${icons.delete}</button>
      </span>
    `;
    list.appendChild(row);
  });
}

function setStatus(msg, isError = false) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  el.classList.toggle('status-error', isError);
  if (msg) {
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 4000);
  }
}

async function refresh() {
  try {
    const entries = await fetchAll();
    renderNowServing(entries);
    renderList(entries);
  } catch {
    setStatus('Could not reach the server.', true);
  }
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('customerName');
  const name = input.value.trim();
  if (!name) return;

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: name })
    });
    if (!res.ok) throw new Error();
    input.value = '';
    setStatus('Token issued.');
    refresh();
  } catch {
    setStatus('Could not issue a token. Try again.', true);
  }
});

document.getElementById('callNextBtn').addEventListener('click', async () => {
  const bell = document.getElementById('bellIcon');
  bell.classList.add('ring');
  setTimeout(() => bell.classList.remove('ring'), 500);

  try {
    const res = await fetch(`${API_BASE}/next`, { method: 'PUT' });
    if (res.status === 204) { setStatus('No one is waiting.'); return; }
    if (!res.ok) throw new Error();
    setStatus('Next customer called.');
    refresh();
  } catch {
    setStatus('Could not call the next customer.', true);
  }
});

document.getElementById('queueList').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { id, action } = btn.dataset;

  try {
    if (action === 'delete') {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      setStatus('Entry deleted.');
    } else {
      const statusMap = { serve: 'SERVING', complete: 'COMPLETED', cancel: 'CANCELLED' };
      await fetch(`${API_BASE}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[action] })
      });
      setStatus('Status updated.');
    }
    refresh();
  } catch {
    setStatus('Action failed. Try again.', true);
  }
});

document.getElementById('tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentFilter = tab.dataset.filter;
  refresh();
});

function tickClock() {
  const el = document.getElementById('clock');
  el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(tickClock, 1000);
tickClock();

refresh();
setInterval(refresh, 6000);