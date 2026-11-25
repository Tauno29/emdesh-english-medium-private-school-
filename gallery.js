import { api, errorMessage, formatDate } from './api.js?v=20261125p';

const grid = document.getElementById('gallery-grid');
const count = document.getElementById('gallery-count');
const empty = document.getElementById('gallery-empty');
const errorBox = document.getElementById('gallery-error');
const errorText = document.getElementById('gallery-error-text');
const retry = document.getElementById('gallery-retry');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(item) {
  lightboxImage.src = item.url;
  lightboxImage.alt = item.caption || 'School photo';
  lightboxCaption.textContent = [item.caption, formatDate(item.createdAt)].filter(Boolean).join(' · ');
  lightbox.showModal();
}

function card(item) {
  const figure = document.createElement('figure');
  figure.className = 'gallery-card';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'gallery-thumb';
  button.setAttribute('aria-label', `View photo: ${item.caption || 'school photo'}`);

  const image = document.createElement('img');
  image.src = item.url;
  image.alt = item.caption || 'School life at Em-Desh English Medium Private School';
  image.loading = 'lazy';
  image.decoding = 'async';
  if (item.width) image.width = item.width;
  if (item.height) image.height = item.height;
  button.append(image);
  button.addEventListener('click', () => openLightbox(item));

  const caption = document.createElement('figcaption');
  const title = document.createElement('span');
  title.className = 'gallery-caption';
  title.textContent = item.caption || 'School life';
  const meta = document.createElement('span');
  meta.className = 'gallery-meta';
  meta.textContent = formatDate(item.createdAt);
  caption.append(title, meta);

  figure.append(button, caption);
  return figure;
}

function showState(state) {
  grid.hidden = state !== 'items';
  empty.hidden = state !== 'empty';
  errorBox.hidden = state !== 'error';
  grid.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
}

async function load() {
  showState('loading');
  count.textContent = 'Loading photos…';
  try {
    const data = await api('/api/gallery');
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) {
      count.textContent = 'No photos published yet';
      showState('empty');
      return;
    }
    grid.replaceChildren(...items.map(card));
    count.textContent = `${items.length} photo${items.length === 1 ? '' : 's'} from the school`;
    showState('items');
  } catch (error) {
    count.textContent = '';
    errorText.textContent = errorMessage(error, 'The gallery could not be loaded. Please try again.');
    showState('error');
  }
}

retry.addEventListener('click', load);
document.getElementById('lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

load();
