const STORAGE_KEY = 'gameshelf-library-v1';
const PROFILE_STORAGE_KEY = 'gameshelf-profile-v1';

const coverImages = {
  'marvel rivals': 'images/marvel-rivals.png',
  'baldurs gate 3': 'images/baldurs-gate-3.jpg',
  'stardew valley': 'images/stardew-valley.jpg',
  'hollow knight': 'images/hollow-knight.jpg'
};

const starterGames = [
  { id: 'demo-1', title: 'Hollow Knight', platform: 'Nintendo Switch', genre: 'Platformer', status: 'Playing', cover: coverImages['hollow knight'] },
  { id: 'demo-2', title: 'Stardew Valley', platform: 'PC', genre: 'Simulation', status: 'Want to Play', cover: coverImages['stardew valley'] },
  { id: 'demo-3', title: 'Marvel Rivals', platform: 'PlayStation', genre: 'Shooter', status: 'Playing', cover: coverImages['marvel rivals'] },
  { id: 'demo-4', title: 'Baldur’s Gate 3', platform: 'PC', genre: 'RPG', status: 'Want to Play', cover: coverImages['baldurs gate 3'] }
];

const form = document.querySelector('#game-form');
const titleInput = document.querySelector('#game-title');
const platformInput = document.querySelector('#game-platform');
const genreInput = document.querySelector('#game-genre');
const statusInput = document.querySelector('#game-status');
const searchInput = document.querySelector('#search-games');
const statusFilter = document.querySelector('#status-filter');
const gameList = document.querySelector('#game-list');
const emptyState = document.querySelector('#empty-state');
const submitButton = document.querySelector('#submit-button');
const cancelEditButton = document.querySelector('#cancel-edit');
const formHeading = document.querySelector('#form-heading');
const profileDialog = document.querySelector('#profile-dialog');
const profileForm = document.querySelector('#profile-form');
const profileNameInput = document.querySelector('#profile-name');
const profilePictureInput = document.querySelector('#profile-picture');
const profileUsername = document.querySelector('#profile-username');
const profileAvatarImage = document.querySelector('#profile-avatar-image');
const profileAvatarPlaceholder = document.querySelector('#profile-avatar-placeholder');
const previewAvatarImage = document.querySelector('#preview-avatar-image');
const previewAvatarPlaceholder = document.querySelector('#preview-avatar-placeholder');
const MAX_AVATAR_SIZE = 1024 * 1024;

let games = loadGames();
let editingGameId = null;
let profile = loadProfile();
let pendingAvatar = profile.avatar;

function loadProfile() {
  try {
    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    if (!savedProfile || typeof savedProfile !== 'object') return { username: 'Player 1', avatar: '' };
    return {
      username: typeof savedProfile.username === 'string' && savedProfile.username.trim() ? savedProfile.username.trim() : 'Player 1',
      avatar: typeof savedProfile.avatar === 'string' ? savedProfile.avatar : ''
    };
  } catch (error) {
    console.warn('Could not load the saved profile.', error);
    return { username: 'Player 1', avatar: '' };
  }
}

function setAvatarView(imageElement, placeholderElement, imageSource, username) {
  const initials = username.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'P1';
  placeholderElement.textContent = initials;
  placeholderElement.classList.toggle('hidden', Boolean(imageSource));
  imageElement.classList.toggle('hidden', !imageSource);
  if (imageSource) imageElement.src = imageSource;
  else imageElement.removeAttribute('src');
}

function renderProfile() {
  profileUsername.textContent = profile.username;
  setAvatarView(profileAvatarImage, profileAvatarPlaceholder, profile.avatar, profile.username);
  setAvatarView(previewAvatarImage, previewAvatarPlaceholder, pendingAvatar, profileNameInput.value || profile.username);
}

function openProfileEditor() {
  profileNameInput.value = profile.username;
  profilePictureInput.value = '';
  pendingAvatar = profile.avatar;
  renderProfile();
  profileDialog.showModal();
  profileNameInput.focus();
}

function updateAvatarPreview() {
  setAvatarView(previewAvatarImage, previewAvatarPlaceholder, pendingAvatar, profileNameInput.value || 'Player 1');
}

function loadGames() {
  try {
    const savedGames = localStorage.getItem(STORAGE_KEY);
    if (savedGames === null) return starterGames;

    const savedList = JSON.parse(savedGames);
    if (!Array.isArray(savedList)) return starterGames;

    return savedList.map((game) => {
      // Update the original demo entry in case it was already saved in the browser.
      const isOldDemo = game.id === 'demo-3' && game.title.toLowerCase().includes('spider-man 2');
      const currentGame = isOldDemo
        ? { ...game, title: 'Marvel Rivals', genre: 'Shooter', status: 'Playing' }
        : game;
      return { ...currentGame, cover: getCoverImage(currentGame.title) || currentGame.cover };
    });
  } catch (error) {
    console.warn('Could not load the saved game list.', error);
    return starterGames;
  }
}

function saveGames() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    alert('Your browser could not save the list. Check your browser storage settings.');
    console.error('Could not save the game list.', error);
  }
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function getInitials(title) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function getCoverImage(title) {
  const key = title.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  return coverImages[key];
}

function createGameCard(game, index) {
  const card = makeElement('article', 'game-card');
  const cover = makeElement('div', 'game-cover');
  const colors = [
    ['#584782', '#302d55'], ['#326b68', '#263a57'], ['#805347', '#463250'], ['#3e5a82', '#393355']
  ];
  cover.style.setProperty('--cover-a', colors[index % colors.length][0]);
  cover.style.setProperty('--cover-b', colors[index % colors.length][1]);
  if (game.cover) {
    const image = makeElement('img', 'game-cover-image');
    image.src = game.cover;
    image.alt = `Cover art for ${game.title}`;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      cover.replaceChildren(makeElement('span', 'game-cover-initials', getInitials(game.title)));
    }, { once: true });
    cover.append(image);
  } else {
    cover.append(makeElement('span', 'game-cover-initials', getInitials(game.title)));
  }

  const info = makeElement('div', 'game-info');
  info.append(makeElement('h3', 'game-title', game.title));
  const meta = makeElement('div', 'game-meta');
  meta.append(makeElement('span', '', game.platform), makeElement('span', '', game.genre));
  info.append(meta);

  const actions = makeElement('div', 'game-actions');
  const statusClass = game.status === 'Playing' ? 'status-playing' : game.status === 'Completed' ? 'status-completed' : 'status-want';
  actions.append(makeElement('span', `status-badge ${statusClass}`, game.status));

  const editButton = makeElement('button', 'icon-button', '✎');
  editButton.type = 'button';
  editButton.setAttribute('aria-label', `Edit ${game.title}`);
  editButton.title = 'Edit game';
  editButton.addEventListener('click', () => beginEdit(game.id));

  const deleteButton = makeElement('button', 'icon-button delete', '×');
  deleteButton.type = 'button';
  deleteButton.setAttribute('aria-label', `Remove ${game.title}`);
  deleteButton.title = 'Remove game';
  deleteButton.addEventListener('click', () => removeGame(game.id));
  actions.append(editButton, deleteButton);

  card.append(cover, info, actions);
  return card;
}

function renderGames() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const visibleGames = games.filter((game) => {
    const matchesSearch = [game.title, game.genre, game.platform].some((value) => value.toLowerCase().includes(searchTerm));
    const matchesStatus = selectedStatus === 'All' || game.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  gameList.replaceChildren(...visibleGames.map((game, index) => createGameCard(game, index)));
  emptyState.classList.toggle('hidden', visibleGames.length > 0);
  document.querySelector('#shown-count').textContent = visibleGames.length;
  document.querySelector('#total-count').textContent = games.length;
  document.querySelector('#playing-count').textContent = games.filter((game) => game.status === 'Playing').length;
  document.querySelector('#completed-count').textContent = games.filter((game) => game.status === 'Completed').length;
}

function resetForm() {
  form.reset();
  editingGameId = null;
  formHeading.textContent = 'Add a game';
  submitButton.innerHTML = '<span aria-hidden="true">＋</span> Add to library';
  cancelEditButton.classList.add('hidden');
}

function beginEdit(gameId) {
  const game = games.find((item) => item.id === gameId);
  if (!game) return;
  editingGameId = gameId;
  titleInput.value = game.title;
  platformInput.value = game.platform;
  genreInput.value = game.genre;
  statusInput.value = game.status;
  formHeading.textContent = 'Edit a game';
  submitButton.textContent = 'Save changes';
  cancelEditButton.classList.remove('hidden');
  titleInput.focus();
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeGame(gameId) {
  const game = games.find((item) => item.id === gameId);
  if (!game || !window.confirm(`Remove “${game.title}” from your library?`)) return;
  games = games.filter((item) => item.id !== gameId);
  if (editingGameId === gameId) resetForm();
  saveGames();
  renderGames();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const gameDetails = {
    title: titleInput.value.trim(),
    platform: platformInput.value,
    genre: genreInput.value,
    status: statusInput.value
  };
  if (!gameDetails.title || !gameDetails.platform || !gameDetails.genre) return;

  if (editingGameId) {
    games = games.map((game) => game.id === editingGameId
      ? { ...game, ...gameDetails, cover: getCoverImage(gameDetails.title) }
      : game);
  } else {
    games.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, ...gameDetails, cover: getCoverImage(gameDetails.title) });
  }

  saveGames();
  resetForm();
  renderGames();
});

searchInput.addEventListener('input', renderGames);
statusFilter.addEventListener('change', renderGames);
cancelEditButton.addEventListener('click', resetForm);
document.querySelector('#open-profile').addEventListener('click', openProfileEditor);
document.querySelector('#edit-profile').addEventListener('click', openProfileEditor);
document.querySelector('#close-profile').addEventListener('click', () => profileDialog.close());
document.querySelector('#remove-avatar').addEventListener('click', () => {
  pendingAvatar = '';
  profilePictureInput.value = '';
  updateAvatarPreview();
});

profileNameInput.addEventListener('input', updateAvatarPreview);
profilePictureInput.addEventListener('change', () => {
  const [file] = profilePictureInput.files;
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    alert('Choose a JPG, PNG, or WebP image.');
    profilePictureInput.value = '';
    return;
  }
  if (file.size > MAX_AVATAR_SIZE) {
    alert('Choose an image smaller than 1 MB.');
    profilePictureInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    pendingAvatar = reader.result;
    updateAvatarPreview();
  });
  reader.addEventListener('error', () => alert('That picture could not be opened. Try another image.'));
  reader.readAsDataURL(file);
});

profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = profileNameInput.value.trim();
  if (!username) return;

  const updatedProfile = { username, avatar: pendingAvatar };
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    profile = updatedProfile;
    renderProfile();
    profileDialog.close();
  } catch (error) {
    alert('Your browser could not save this profile. Try a smaller picture.');
    console.error('Could not save the profile.', error);
  }
});

renderGames();
renderProfile();
