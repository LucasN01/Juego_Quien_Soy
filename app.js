// =============================================
// ========= ¿QUIÉN SOY? — app.js =============
// =============================================

// ——— FIREBASE CONFIG (reemplazar con los datos del proyecto nuevo) ———
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyClVfeLoot0B8580Xzq0smPU4afjpm-Dn0",
  authDomain: "juego-quien-soy.firebaseapp.com",
  databaseURL: "https://juego-quien-soy-default-rtdb.firebaseio.com",
  projectId: "juego-quien-soy",
  storageBucket: "juego-quien-soy.firebasestorage.app",
  messagingSenderId: "103936189659",
  appId: "1:103936189659:web:d7fad530a8a7573948d8fe"
};

// ——— ESTADO ONLINE ———
let onlineState = {
  roomCode: '',
  myId: '',
  myName: '',
  isAdmin: false,
  selectedCategories: new Set(Object.keys(CATEGORIES).filter((_, i) => [0,1,4,5,6,7].includes(i))),
  manualWords: [],           // palabras ingresadas manualmente para esta partida
  cardRevealed: false,
};

let db = null;
let roomRef = null;
let unsubscribers = [];

// ——— UTILIDADES ———
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

// ——— NAVEGACIÓN ———
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
}

// ——— MODALS ———
function showModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); m.style.display = 'flex'; }
}
function hideModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); m.style.display = 'none'; }
}
function showRules() { showModal('rulesModal'); }
function hideRules() { hideModal('rulesModal'); }

// ——— FIREBASE ———
function initFirebase() {
  if (db) return true;
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
    return true;
  } catch (e) {
    alert('⚠️ Firebase no configurado. Por favor configurá el FIREBASE_CONFIG en app.js con los datos de tu proyecto.');
    return false;
  }
}

function clearListeners() {
  unsubscribers.forEach(fn => fn());
  unsubscribers = [];
}

// ——— CATEGORÍAS: grilla de selección ———
function buildCatGrid(containerId, stateRef) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(CATEGORIES).forEach(([name, data]) => {
    const btn = document.createElement('div');
    btn.className = 'btn-cat' + (stateRef.has(name) ? ' selected' : '');
    btn.style.setProperty('--cat-color', data.color);
    btn.innerHTML = `
      <span class="cat-icon">${data.icon}</span>
      <span>${name}</span>
    `;
    if (stateRef.has(name)) {
      btn.style.borderColor = data.color;
      btn.style.background = data.color + '18';
      btn.style.color = data.color;
      btn.style.boxShadow = `0 0 14px ${data.color}40`;
    }
    btn.onclick = () => {
      if (stateRef.has(name)) {
        if (stateRef.size > 1) stateRef.delete(name);
      } else {
        stateRef.add(name);
      }
      const isSelected = stateRef.has(name);
      btn.className = 'btn-cat' + (isSelected ? ' selected' : '');
      if (isSelected) {
        btn.style.borderColor = data.color;
        btn.style.background = data.color + '18';
        btn.style.color = data.color;
        btn.style.boxShadow = `0 0 14px ${data.color}40`;
      } else {
        btn.style.borderColor = '';
        btn.style.background = '';
        btn.style.color = '';
        btn.style.boxShadow = '';
      }
    };
    grid.appendChild(btn);
  });
}

// ——— PALABRAS MANUALES ———
let manualWordsSetup = []; // durante la configuración
let manualTagsContainerId = '';
let manualInputId = '';

function initManualWords(tagsId, inputId, addBtnId) {
  manualTagsContainerId = tagsId;
  manualInputId = inputId;
  renderManualTags();

  const inp = document.getElementById(inputId);
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addManualWord();
  });
  document.getElementById(addBtnId).onclick = addManualWord;
}

function addManualWord() {
  const inp = document.getElementById(manualInputId);
  const val = inp.value.trim();
  if (!val) return;
  if (!manualWordsSetup.includes(val)) {
    manualWordsSetup.push(val);
    renderManualTags();
  }
  inp.value = '';
  inp.focus();
}

function removeManualWord(word) {
  manualWordsSetup = manualWordsSetup.filter(w => w !== word);
  renderManualTags();
}

function renderManualTags() {
  const container = document.getElementById(manualTagsContainerId);
  if (!container) return;
  if (manualWordsSetup.length === 0) {
    container.innerHTML = '<span style="font-size:0.78rem;color:var(--muted);">Ninguna todavía...</span>';
    return;
  }
  container.innerHTML = manualWordsSetup.map(w => `
    <span class="manual-tag">
      ${w}
      <button onclick="removeManualWord('${w.replace(/'/g, "\\'")}')">×</button>
    </span>
  `).join('');
}

// ——— PICK PERSONAJE ———
function pickCharacter(selectedCats, manualWords) {
  const pool = [];
  selectedCats.forEach(cat => {
    if (CATEGORIES[cat]) {
      CATEGORIES[cat].words.forEach(w => pool.push({ word: w, category: cat, icon: CATEGORIES[cat].icon }));
    }
  });
  if (manualWords && manualWords.length > 0) {
    manualWords.forEach(w => pool.push({ word: w, category: 'Manual', icon: '✏️' }));
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickUniqueCharacters(playerCount, selectedCats, manualWords, adminIndex) {
  // Pool de palabras de categorías
  const catPool = [];
  selectedCats.forEach(cat => {
    if (CATEGORIES[cat]) {
      CATEGORIES[cat].words.forEach(w => catPool.push({ word: w, category: cat, icon: CATEGORIES[cat].icon }));
    }
  });

  // Pool de palabras manuales
  const manualPool = (manualWords && manualWords.length > 0)
    ? manualWords.map(w => ({ word: w, category: 'Manual', icon: '✏️' }))
    : [];

  if (catPool.length === 0 && manualPool.length === 0) return null;

  // Si no hay palabras manuales, usar pool normal
  if (manualPool.length === 0) {
    const shuffled = [...catPool].sort(() => Math.random() - 0.5);
    const assignments = [];
    const used = new Set();
    for (let i = 0; i < playerCount; i++) {
      const unique = shuffled.find(item => !used.has(item.word));
      if (unique) { assignments.push(unique); used.add(unique.word); }
      else { assignments.push(shuffled[i % shuffled.length]); }
    }
    return assignments;
  }

  // Con palabras manuales: garantizar que al menos una le toque a alguien que NO sea el admin
  const assignments = new Array(playerCount).fill(null);
  const usedWords = new Set();

  // Shuffle ambos pools
  const shuffledCat = [...catPool].sort(() => Math.random() - 0.5);
  const shuffledManual = [...manualPool].sort(() => Math.random() - 0.5);

  // Al admin siempre le toca una palabra de categoría
  if (adminIndex !== undefined && adminIndex !== null && catPool.length > 0) {
    assignments[adminIndex] = shuffledCat[0];
    usedWords.add(shuffledCat[0].word);
  }

  // Índices de no-admin
  const nonAdminIndices = [];
  for (let i = 0; i < playerCount; i++) {
    if (i !== adminIndex) nonAdminIndices.push(i);
  }

  // Distribuir palabras manuales entre jugadores no-admin
  let manualUsed = 0;
  for (let i = 0; i < nonAdminIndices.length && manualUsed < shuffledManual.length; i++) {
    const idx = nonAdminIndices[i];
    const word = shuffledManual[manualUsed];
    if (!usedWords.has(word.word)) {
      assignments[idx] = word;
      usedWords.add(word.word);
      manualUsed++;
    }
  }

  // Rellenar los que quedaron sin asignar con palabras de categorías
  let catIdx = 0;
  for (let i = 0; i < playerCount; i++) {
    if (assignments[i] === null) {
      while (catIdx < shuffledCat.length && usedWords.has(shuffledCat[catIdx].word)) catIdx++;
      if (catIdx < shuffledCat.length) {
        assignments[i] = shuffledCat[catIdx];
        usedWords.add(shuffledCat[catIdx].word);
        catIdx++;
      } else {
        // Pool agotado, repetir
        assignments[i] = shuffledCat[Math.floor(Math.random() * shuffledCat.length)];
      }
    }
  }

  return assignments;
}

// ——— CONFETTI ———
function launchConfetti(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#ff2d78', '#ffe94d', '#00e5ff', '#39ff7e', '#bf5fff', '#ff7a00', '#ffffff'];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${-10 - Math.random() * 20}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      transform: rotate(${Math.random() * 360}deg);
      width: ${5 + Math.random() * 8}px;
      height: ${5 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${2 + Math.random() * 2.5}s;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

// ——— CREAR SALA ———
async function createRoom() {
  const nameInput = document.getElementById('adminNameInput');
  const errEl = document.getElementById('createRoomErr');
  const name = nameInput.value.trim();
  errEl.style.display = 'none';
  if (!name) { errEl.style.display = 'block'; return; }
  if (!initFirebase()) return;

  const code = generateRoomCode();
  const myId = uid();
  const avatarColor = randomColor();
  onlineState.roomCode = code;
  onlineState.myId = myId;
  onlineState.myName = name;
  onlineState.isAdmin = true;
  onlineState.cardRevealed = false;
  roomRef = db.ref('rooms/' + code);

  try {
    await roomRef.set({
      status: 'lobby',
      adminId: myId,
      createdAt: Date.now(),
      players: {
        [myId]: { name, isAdmin: true, ready: false, joined: Date.now(), avatarColor }
      }
    });

    roomRef.child('createdAt').onDisconnect().remove();
    saveSession();

    document.getElementById('displayRoomCode').textContent = code;
    goTo('screenAdminLobby');
    listenAdminLobby();

  } catch (e) {
    alert('Error al crear la sala. Revisá tu conexión.');
  }
}

function copyRoomCode() {
  navigator.clipboard.writeText(onlineState.roomCode).then(() => {
    const el = document.getElementById('displayRoomCode');
    const prev = el.textContent;
    el.textContent = '✓✓✓';
    setTimeout(() => el.textContent = prev, 1300);
  });
}

// ——— LOBBY ADMIN: escuchar jugadores ———
function listenAdminLobby() {
  clearListeners();
  const pRef = roomRef.child('players');
  const pHandler = pRef.on('value', snap => {
    const players = snap.val() || {};
    const list = Object.entries(players).sort((a, b) => a[1].joined - b[1].joined);
    renderPlayerList('adminPlayerList', list, true);
    document.getElementById('adminPlayerCount').textContent = `${list.length} jugador${list.length !== 1 ? 'es' : ''}`;
  });
  unsubscribers.push(() => pRef.off('value', pHandler));
}

function renderPlayerList(containerId, list, isAdmin) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  list.forEach(([id, p]) => {
    const div = document.createElement('div');
    div.className = 'player-item';
    div.innerHTML = `
      <div class="p-avatar" style="background:${p.avatarColor || '#ff2d78'}">
        ${p.name[0].toUpperCase()}
      </div>
      <span class="p-name">${p.name}</span>
      ${p.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
    `;
    container.appendChild(div);
  });
}

// ——— CONFIGURACIÓN (admin) ———
function goToSetup() {
  manualWordsSetup = [];
  onlineState.selectedCategories = new Set(Object.keys(CATEGORIES).filter((_, i) => [0,1,4,5,6,7].includes(i)));
  buildCatGrid('setupCatGrid', onlineState.selectedCategories);
  initManualWords('setupManualTags', 'setupManualInput', 'setupManualAddBtn');
  goTo('screenSetup');
}

// ——— LANZAR PARTIDA ———
async function launchGame() {
  const errEl = document.getElementById('setupErr');
  errEl.style.display = 'none';

  // Obtener jugadores actuales
  const snap = await roomRef.child('players').once('value');
  const playersObj = snap.val() || {};
  const playersList = Object.entries(playersObj).sort((a, b) => a[1].joined - b[1].joined);
  const playerIds = playersList.map(([id]) => id);

  if (playerIds.length < 2) {
    errEl.textContent = 'Necesitás al menos 2 jugadores para jugar.';
    errEl.style.display = 'block';
    return;
  }

  const totalCatWords = [...onlineState.selectedCategories].reduce((acc, cat) => {
    return acc + (CATEGORIES[cat] ? CATEGORIES[cat].words.length : 0);
  }, 0);

  if (totalCatWords === 0 && manualWordsSetup.length === 0) {
    errEl.textContent = 'Seleccioná al menos una categoría o agregá palabras manualmente.';
    errEl.style.display = 'block';
    return;
  }

  // Asignar personajes únicos a cada jugador
  // El admin (quien ingresó las palabras manuales) no debe recibirlas
  const adminIndex = playerIds.indexOf(onlineState.myId);
  const characterAssignments = pickUniqueCharacters(
    playerIds.length,
    onlineState.selectedCategories,
    manualWordsSetup,
    adminIndex
  );

  if (!characterAssignments) {
    errEl.textContent = 'No hay personajes disponibles. Seleccioná categorías o agregá palabras.';
    errEl.style.display = 'block';
    return;
  }

  const assignments = {};
  playerIds.forEach((id, idx) => {
    assignments[id] = {
      character: characterAssignments[idx].word,
      category: characterAssignments[idx].category,
      icon: characterAssignments[idx].icon,
      ready: false,
    };
  });

  await roomRef.update({
    status: 'playing',
    game: {
      assignments,
      manualWords: manualWordsSetup,
      selectedCategories: [...onlineState.selectedCategories],
      startedAt: Date.now(),
    }
  });

  // Admin va a su tarjeta
  _showMyCard(assignments);
}

// ——— MOSTRAR MI TARJETA ———
function _showMyCard(assignments) {
  const myAssignment = assignments[onlineState.myId];
  onlineState.cardRevealed = false;

  if (!myAssignment) return;

  // Configurar frente
  document.getElementById('cardPlayerNameFront').textContent = onlineState.myName;

  // Configurar dorso
  document.getElementById('cardPlayerNameBack').textContent = onlineState.myName;
  document.getElementById('cardCategoryPill').innerHTML = `${myAssignment.icon} ${myAssignment.category}`;
  document.getElementById('cardCharacterName').textContent = myAssignment.character;

  // Resetear estado visual y modo horizontal
  document.getElementById('screenCard').classList.remove('card-horizontal-screen');
  document.body.classList.remove('card-horizontal');
  const inner = document.getElementById('onlineCardInner');
  inner.classList.remove('flipped');

  // Resetear clases del dorso (sin tocar el inner, para no generar bordes fantasma)
  const back = document.getElementById('onlineCardBack');
  back.className = 'game-card-face card-back card-back-normal';

  document.getElementById('tapHint').textContent = '👆 Tocá para ver tu personaje';

  clearListeners();
  goTo('screenCard');

  // Escuchar si vuelve al lobby (nueva partida)
  const sRef = roomRef.child('status');
  const sHandler = sRef.on('value', snap => {
    if (snap.val() === 'lobby') {
      clearListeners();
      onlineState.cardRevealed = false;
      if (onlineState.isAdmin) {
        goTo('screenAdminLobby');
        listenAdminLobby();
      } else {
        document.getElementById('waitingRoomTitle').textContent = 'Sala ' + onlineState.roomCode;
        goTo('screenWaiting');
        listenPlayerWaiting();
      }
    }
  });
  unsubscribers.push(() => sRef.off('value', sHandler));
}

// ——— COUNTDOWN ———
let countdownTimer = null;

function startCountdown(onFinish) {
  const overlay = document.getElementById('countdownOverlay');
  const numEl   = document.getElementById('countdownNumber');
  let count = 5;

  overlay.classList.add('active');
  numEl.textContent = count;
  // Reiniciar animación en cada número
  numEl.style.animation = 'none';
  void numEl.offsetWidth; // reflow
  numEl.style.animation = '';

  countdownTimer = setInterval(() => {
    count--;
    if (count > 0) {
      numEl.textContent = count;
      numEl.style.animation = 'none';
      void numEl.offsetWidth;
      numEl.style.animation = '';
    } else {
      clearInterval(countdownTimer);
      countdownTimer = null;
      overlay.classList.remove('active');
      onFinish();
    }
  }, 1000);
}

// ——— TAP EN TARJETA ———
let cardState = 0; // 0=nombre, 1=personaje revelado, 2=modo frente+listo

function handleCardTap() {
  if (cardState === 0) {
    // Primer toque: cuenta regresiva de 5 segundos, luego revelar y rotar
    cardState = -1; // bloquear taps mientras cuenta
    document.getElementById('tapHint').textContent = '⏳ Prepará el celular…';

    startCountdown(() => {
      // Revelar personaje
      document.getElementById('onlineCardInner').classList.add('flipped');
      document.getElementById('tapHint').textContent = '👆 Poné el celu en la frente y tocá para confirmar';
      cardState = 1;
      onlineState.cardRevealed = true;

      // Activar modo horizontal: rotar toda la pantalla 90° antihorario
      document.getElementById('screenCard').classList.add('card-horizontal-screen');
      document.body.classList.add('card-horizontal');
    });

  } else if (cardState === 1) {
    // Segundo toque: modo frente + marcar listo en un solo paso
    const back = document.getElementById('onlineCardBack');
    back.className = 'game-card-face card-back card-back-forehead';

    const charEl = document.getElementById('cardCharacterName');
    charEl.classList.add('forehead');

    document.getElementById('tapHint').textContent = '✅ ¡Todos pueden ver tu personaje!';
    cardState = 2;

    // Marcar como listo inmediatamente
    roomRef.child('game/assignments/' + onlineState.myId + '/ready').set(true);

    setTimeout(() => {
      cardState = 0;
      // Desactivar modo horizontal al salir
      document.getElementById('screenCard').classList.remove('card-horizontal-screen');
      document.body.classList.remove('card-horizontal');
      clearListeners();

      const adminBtn = document.getElementById('adminNewRoundBtn');
      if (adminBtn) adminBtn.style.display = onlineState.isAdmin ? 'flex' : 'none';

      goTo('screenWaitEnd');
      listenWaitEnd();
    }, 1500);
  }
}

// ——— ESPERA FIN DE RONDA ———
function listenWaitEnd() {
  clearListeners();
  const sRef = roomRef.child('status');
  const sHandler = sRef.on('value', snap => {
    const st = snap.val();
    if (st === 'lobby') {
      clearListeners();
      onlineState.cardRevealed = false;
      if (onlineState.isAdmin) {
        goTo('screenAdminLobby');
        listenAdminLobby();
      } else {
        document.getElementById('waitingRoomTitle').textContent = 'Sala ' + onlineState.roomCode;
        goTo('screenWaiting');
        listenPlayerWaiting();
      }
    }
  });
  unsubscribers.push(() => sRef.off('value', sHandler));

  // Contar listos
  const gRef = roomRef.child('game/assignments');
  const gHandler = gRef.on('value', snap => {
    const assignments = snap.val() || {};
    const total = Object.keys(assignments).length;
    const ready = Object.values(assignments).filter(a => a.ready).length;
    const el = document.getElementById('readyCountBadge');
    if (el) el.textContent = `${ready} / ${total} listos`;
  });
  unsubscribers.push(() => gRef.off('value', gHandler));
}

// ——— NUEVA PARTIDA (admin) ———
async function newRound() {
  // Recalcular: obtener jugadores, resetear ready, borrar game, status = lobby
  const snap = await roomRef.child('players').once('value');
  const players = snap.val() || {};
  const updates = {};
  Object.keys(players).forEach(id => {
    updates[`players/${id}/ready`] = false;
  });
  updates['game'] = null;
  updates['status'] = 'lobby';
  await roomRef.update(updates);

  manualWordsSetup = [];
  goTo('screenAdminLobby');
  listenAdminLobby();
}

// ——— UNIRSE A SALA ———
async function joinRoom() {
  const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
  const name = document.getElementById('joinNameInput').value.trim();
  const errEl = document.getElementById('joinRoomErr');
  errEl.style.display = 'none';

  if (!code || code.length !== 4) {
    errEl.textContent = 'Ingresá el código de 4 letras.';
    errEl.style.display = 'block'; return;
  }
  if (!name) {
    errEl.textContent = 'Ingresá tu nombre.';
    errEl.style.display = 'block'; return;
  }
  if (!initFirebase()) return;

  const ref = db.ref('rooms/' + code);
  let snap;
  try { snap = await ref.once('value'); } catch (e) {
    errEl.textContent = 'Error de conexión.';
    errEl.style.display = 'block'; return;
  }

  if (!snap.exists()) {
    errEl.textContent = 'No existe esa sala. Revisá el código.';
    errEl.style.display = 'block'; return;
  }

  const myId = uid();
  const avatarColor = randomColor();
  onlineState.roomCode = code;
  onlineState.myId = myId;
  onlineState.myName = name;
  onlineState.isAdmin = false;
  onlineState.cardRevealed = false;
  roomRef = ref;

  await ref.child('players/' + myId).set({
    name, isAdmin: false, ready: false, joined: Date.now(), avatarColor
  });
  ref.child('players/' + myId).onDisconnect().remove();

  saveSession();
  document.getElementById('waitingRoomTitle').textContent = 'Sala ' + code;
  goTo('screenWaiting');
  listenPlayerWaiting();
}

// ——— ESCUCHAR LOBBY JUGADOR ———
function listenPlayerWaiting() {
  clearListeners();

  const pRef = roomRef.child('players');
  const pHandler = pRef.on('value', snap => {
    const players = snap.val() || {};
    const list = Object.entries(players).sort((a, b) => a[1].joined - b[1].joined);
    renderPlayerList('guestPlayerList', list, false);
    document.getElementById('guestPlayerCount').textContent =
      `${list.length} jugador${list.length !== 1 ? 'es' : ''}`;
  });
  unsubscribers.push(() => pRef.off('value', pHandler));

  const sRef = roomRef.child('status');
  const sHandler = sRef.on('value', snap => {
    if (snap.val() === 'playing') {
      setTimeout(() => showMyOnlineCard(), 350);
    }
  });
  unsubscribers.push(() => sRef.off('value', sHandler));
}

async function showMyOnlineCard() {
  let game = null;
  for (let i = 0; i < 5; i++) {
    const gameSnap = await roomRef.child('game').once('value');
    game = gameSnap.val();
    if (game && game.assignments) break;
    await new Promise(r => setTimeout(r, 500));
  }

  if (!game || !game.assignments) {
    console.error('No se pudo obtener el juego.');
    return;
  }

  const myAssignment = game.assignments[onlineState.myId];

  if (!myAssignment) {
    // Llegó tarde: esperar próxima ronda
    clearListeners();
    document.getElementById('guestPlayerCount').textContent = 'Partida en curso — entrás en la próxima ronda';
    const sRef = roomRef.child('status');
    const sHandler = sRef.on('value', snap => {
      if (snap.val() === 'lobby') {
        clearListeners();
        document.getElementById('waitingRoomTitle').textContent = 'Sala ' + onlineState.roomCode;
        goTo('screenWaiting');
        listenPlayerWaiting();
      }
    });
    unsubscribers.push(() => sRef.off('value', sHandler));
    return;
  }

  _showMyCard(game.assignments);
}

// ——— SALIR DE SALA ———
function leaveRoom() {
  clearListeners();
  if (roomRef && onlineState.myId) {
    if (onlineState.isAdmin) roomRef.remove();
    else roomRef.child('players/' + onlineState.myId).remove();
  }
  roomRef = null;
  clearSession();
  onlineState = {
    roomCode: '', myId: '', myName: '', isAdmin: false,
    selectedCategories: new Set(Object.keys(CATEGORIES).filter((_, i) => [0,1,4,5,6,7].includes(i))),
    manualWords: [], cardRevealed: false,
  };
  manualWordsSetup = [];
  goTo('screenHome');
}

// ——— PERSISTENCIA DE SESIÓN ———
const SESSION_KEY = 'quien_soy_session';

function saveSession() {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      roomCode: onlineState.roomCode,
      myId: onlineState.myId,
      myName: onlineState.myName,
      isAdmin: onlineState.isAdmin,
    }));
  } catch (e) {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

async function checkPreviousSession() {
  const session = loadSession();
  if (!session || !session.roomCode || !session.myId) return;
  if (!initFirebase()) return;

  const ref = db.ref('rooms/' + session.roomCode);
  let snap;
  try { snap = await ref.once('value'); } catch (e) { clearSession(); return; }
  if (!snap.exists()) { clearSession(); return; }

  const room = snap.val();
  showReconnectModal(session, room, ref);
}

function showReconnectModal(session, room, ref) {
  let modal = document.getElementById('reconnectModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reconnectModal';
    modal.style.cssText = 'display:flex;position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:1.5rem;';
    modal.innerHTML = `
      <div style="background:var(--surface);border:1px solid var(--border2);border-radius:24px;padding:2rem;max-width:360px;width:100%;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <div style="font-size:2.5rem;">🔄</div>
        <div style="font-family:'Righteous',sans-serif;font-size:1.2rem;color:var(--text);">Sesión activa</div>
        <p style="color:var(--muted2);font-size:0.88rem;line-height:1.5;" id="reconnectDesc"></p>
        <button class="btn btn-primary" id="reconnectBtn" style="width:100%;">Volver a la sala</button>
        <button class="btn btn-ghost" id="reconnectCancelBtn" style="width:100%;">Empezar de nuevo</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const statusLabel = room.status === 'playing' ? 'partida en curso' : 'lobby';
  const role = session.isAdmin ? 'administrador' : 'jugador';
  document.getElementById('reconnectDesc').textContent =
    `Eras ${role} "${session.myName}" en la sala ${session.roomCode} (${statusLabel}). ¿Volvés?`;

  document.getElementById('reconnectBtn').onclick = () => {
    modal.remove();
    reconnectToRoom(session, ref);
  };
  document.getElementById('reconnectCancelBtn').onclick = async () => {
    modal.remove();
    try {
      await ref.child('players/' + session.myId).remove();
      if (session.isAdmin) await ref.remove();
    } catch (e) {}
    clearSession();
  };
}

async function reconnectToRoom(session, ref) {
  if (!initFirebase()) return;
  onlineState.roomCode = session.roomCode;
  onlineState.myId = session.myId;
  onlineState.myName = session.myName;
  onlineState.isAdmin = session.isAdmin;
  onlineState.cardRevealed = false;
  roomRef = ref;

  await roomRef.child('players/' + session.myId).set({
    name: session.myName,
    isAdmin: session.isAdmin,
    ready: false,
    joined: session.isAdmin ? 0 : Date.now(),
    avatarColor: randomColor(),
  });
  roomRef.child('players/' + session.myId).onDisconnect().remove();

  const snap = await roomRef.once('value');
  const room = snap.val() || {};

  if (room.status === 'playing') {
    if (session.isAdmin) {
      const game = room.game || {};
      if (game.assignments && game.assignments[session.myId]) {
        _showMyCard(game.assignments);
      } else {
        goTo('screenWaitEnd');
        const adminBtn = document.getElementById('adminNewRoundBtn');
        if (adminBtn) adminBtn.style.display = 'flex';
        listenWaitEnd();
      }
    } else {
      goTo('screenWaiting');
      listenPlayerWaiting();
      setTimeout(() => showMyOnlineCard(), 400);
    }
  } else {
    if (session.isAdmin) {
      document.getElementById('displayRoomCode').textContent = session.roomCode;
      goTo('screenAdminLobby');
      listenAdminLobby();
    } else {
      document.getElementById('waitingRoomTitle').textContent = 'Sala ' + session.roomCode;
      goTo('screenWaiting');
      listenPlayerWaiting();
    }
  }
}

// ——— INIT ———
window.addEventListener('load', () => {
  cardState = 0;
  checkPreviousSession();
});
