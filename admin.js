import {
  ApiError, api, clearAuthToken, DOCUMENT_TYPES, errorMessage, formatDate, gradeLabel,
  IMAGE_TYPES, MAX_DOCUMENT_BYTES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, VIDEO_TYPES, setAuthToken,
} from './api.js?v=20261125p';

const TOKEN_KEY = 'omps_admin_token';

function restoreToken() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) setAuthToken(token);
  } catch {
    // Storage can be unavailable in hardened browsers; cookie sessions still apply.
  }
}

function persistToken(token) {
  setAuthToken(token);
  try { sessionStorage.setItem(TOKEN_KEY, token); } catch { /* cookie session only */ }
}

function forgetToken() {
  clearAuthToken();
  try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* nothing to clear */ }
}

restoreToken();

const loginSection = document.getElementById('admin-login');
const loginForm = document.getElementById('admin-login-form');
const loginStatus = document.getElementById('admin-login-status');
const codeDialog = document.getElementById('admin-code-dialog');
const codeDisplay = document.getElementById('admin-code-display');
const codeStatus = document.getElementById('admin-code-status');
const openCodeButton = document.getElementById('admin-open-code');
const cancelCodeButton = document.getElementById('admin-code-cancel');
const loginSubmit = document.getElementById('admin-login-submit');
const dashboard = document.getElementById('dashboard');
const signoutButton = document.getElementById('admin-signout');

const learnerDialog = document.getElementById('learner-dialog');
const learnerForm = document.getElementById('learner-form');
const learnerStatus = document.getElementById('learner-status');
const learnerSubmit = document.getElementById('learner-submit');
const learnerId = document.getElementById('learner-id');
const learnerFirst = document.getElementById('learner-first');
const learnerLast = document.getElementById('learner-last');
const learnerGrade = document.getElementById('learner-grade');
const learnerClass = document.getElementById('learner-class');
const learnerGuardian = document.getElementById('learner-guardian');
const learnerPhone = document.getElementById('learner-phone');

const bulkDialog = document.getElementById('bulk-dialog');
const bulkSetup = document.getElementById('bulk-setup');
const bulkResults = document.getElementById('bulk-results');
const bulkFile = document.getElementById('bulk-file');
const bulkStatus = document.getElementById('bulk-status');
const bulkSummary = document.getElementById('bulk-summary');
const bulkPreviewWrap = document.getElementById('bulk-preview-wrap');
const bulkPreview = document.getElementById('bulk-preview');
const bulkImport = document.getElementById('bulk-import');
const bulkClose = document.getElementById('bulk-close');
const bulkPrint = document.getElementById('bulk-print');
const bulkResultSummary = document.getElementById('bulk-result-summary');
const bulkCredentials = document.getElementById('bulk-credentials');
const bulkFailures = document.getElementById('bulk-failures');
const deleteAllDialog = document.getElementById('delete-all-dialog');
const deleteAllForm = document.getElementById('delete-all-form');
const deleteAllCount = document.getElementById('delete-all-count');
const deleteAllConfirmation = document.getElementById('delete-all-confirmation');
const deleteAllStatus = document.getElementById('delete-all-status');
const deleteAllSubmit = document.getElementById('delete-all-submit');

const pinDialog = document.getElementById('pin-dialog');
const pinValue = document.getElementById('pin-value');
const pinStudent = document.getElementById('pin-student-id');
const pinName = document.getElementById('pin-name');
const pinCopyStatus = document.getElementById('pin-copy-status');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmOk = document.getElementById('confirm-ok');

const learnersGroups = document.getElementById('learners-groups');
const learnersEmpty = document.getElementById('learners-empty');
const learnersEmptyText = document.getElementById('learners-empty-text');
const learnersError = document.getElementById('learners-error');
const learnerCount = document.getElementById('learner-count');
const learnerSearch = document.getElementById('learner-search');

const applicationsList = document.getElementById('applications-list');
const applicationsEmpty = document.getElementById('applications-empty');
const applicationsError = document.getElementById('applications-error');
const applicationCount = document.getElementById('application-count');

const photoForm = document.getElementById('photo-form');
const photoFile = document.getElementById('photo-file');
const fileLabel = document.getElementById('file-label');
const photoPreview = document.getElementById('photo-preview');
const photoCaption = document.getElementById('photo-caption');
const photoSubmit = document.getElementById('photo-submit');
const photoStatus = document.getElementById('photo-status');
const adminGallery = document.getElementById('admin-gallery');
const adminGalleryEmpty = document.getElementById('admin-gallery-empty');
const adminGalleryCount = document.getElementById('admin-gallery-count');
const galleryError = document.getElementById('gallery-error');
const homepageSettingsForm = document.getElementById('homepage-settings-form');
const homepageNotificationEnabled = document.getElementById('homepage-notification-enabled');
const homepageNotificationText = document.getElementById('homepage-notification-text');
const homepageNotificationLinkText = document.getElementById('homepage-notification-link-text');
const homepageNotificationLinkUrl = document.getElementById('homepage-notification-link-url');
const homepageSettingsSubmit = document.getElementById('homepage-settings-submit');
const homepageSettingsStatus = document.getElementById('homepage-settings-status');
const welcomeVideoForm = document.getElementById('welcome-video-form');
const welcomeVideoFile = document.getElementById('welcome-video-file');
const welcomeVideoLabel = document.getElementById('welcome-video-label');
const welcomeVideoPreview = document.getElementById('welcome-video-preview');
const welcomeVideoSubmit = document.getElementById('welcome-video-submit');
const welcomeVideoStatus = document.getElementById('welcome-video-status');
const photoPlacement = document.getElementById('photo-placement');
const toastNode = document.getElementById('toast');

const recordsDialog = document.getElementById('records-dialog');
const recordsSub = document.getElementById('records-sub');
const recordsError = document.getElementById('records-error');
const behaviorForm = document.getElementById('behavior-form');
const behaviorNote = document.getElementById('behavior-note');
const behaviorDate = document.getElementById('behavior-date');
const behaviorSubmit = document.getElementById('behavior-submit');
const behaviorStatus = document.getElementById('behavior-status');
const behaviorList = document.getElementById('behavior-list');
const behaviorEmpty = document.getElementById('behavior-empty');
const behaviorCount = document.getElementById('behavior-count');
const testForm = document.getElementById('test-form');
const testSubject = document.getElementById('test-subject');
const testScore = document.getElementById('test-score');
const testTerm = document.getElementById('test-term');
const testDate = document.getElementById('test-date');
const testSubmit = document.getElementById('test-submit');
const testStatus = document.getElementById('test-status');
const testList = document.getElementById('test-list');
const testEmpty = document.getElementById('test-empty');
const testsCount = document.getElementById('tests-count');
const reportForm = document.getElementById('report-form');
const reportFile = document.getElementById('report-file');
const reportTerm = document.getElementById('report-term');
const reportSubmit = document.getElementById('report-submit');
const reportStatus = document.getElementById('report-status');
const reportList = document.getElementById('report-list');
const reportEmpty = document.getElementById('report-empty');
const reportCount = document.getElementById('report-count');
const printLetter = document.getElementById('print-letter');

const FILE_LABEL = 'Choose a photo from this device';
let learners = [];
let applications = [];
let gallery = [];
let pinDetails = null;
let previewUrl = null;
let toastTimer = null;
let confirmResolve = null;
let recordsLearner = null;
let records = { behavior: [], tests: [], reportCards: [] };
let bulkRows = [];
let bulkCredentialsData = [];
let bulkNeedsLogin = false;
let adminCode = '';

function setStatus(node, message, tone = 'error') {
  node.textContent = message;
  node.classList.toggle('is-error', tone === 'error');
  node.classList.toggle('is-success', tone === 'success');
}

function toast(message, tone = 'success') {
  toastNode.textContent = message;
  toastNode.classList.toggle('is-error', tone === 'error');
  toastNode.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastNode.hidden = true; }, 4200);
}

function focusHeading(id) {
  document.getElementById(id)?.focus({ preventScroll: true });
}

function showLogin(message = '', { focus = false } = {}) {
  [learnerDialog, pinDialog, recordsDialog, confirmDialog, bulkDialog, deleteAllDialog].forEach((dialog) => {
    if (dialog.open) dialog.close();
  });
  if (codeDialog.open) codeDialog.close();
  dashboard.hidden = true;
  loginSection.hidden = false;
  loginForm.reset();
  adminCode = '';
  updateCodeDisplay();
  setStatus(loginStatus, message);
  setStatus(codeStatus, '');
  if (focus) focusHeading('admin-login-title');
}

function showDashboard({ focus = false } = {}) {
  dashboard.hidden = false;
  loginSection.hidden = true;
  if (focus) focusHeading('dashboard-title');
}

function sessionExpired() {
  forgetToken();
  showLogin('Your session has ended. Please sign in again.', { focus: true });
}

// ---- dialogs ---------------------------------------------------------------

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.getAttribute('data-close'))?.close();
  });
});

function confirmAction({ title, message, label = 'Continue' }) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  confirmOk.textContent = label;
  confirmResolve = null;
  return new Promise((resolve) => {
    confirmResolve = resolve;
    confirmDialog.showModal();
  });
}

confirmOk.addEventListener('click', () => {
  if (confirmResolve) { confirmResolve(true); confirmResolve = null; }
  confirmDialog.close();
});
confirmDialog.addEventListener('close', () => {
  if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
});

pinDialog.addEventListener('close', () => {
  pinDetails = null;
  pinValue.textContent = '';
  setStatus(pinCopyStatus, '');
});

function showPinDialog(learner, pin, { reset = false } = {}) {
  pinDetails = {
    studentId: learner.studentId,
    name: `${learner.firstName} ${learner.lastName}`,
    pin,
  };
  document.getElementById('pin-kicker').textContent = reset ? 'PIN reset' : 'Learner registered';
  document.getElementById('pin-title').textContent = reset ? 'New PIN issued' : 'Share the sign-in details';
  pinStudent.textContent = learner.studentId;
  pinName.textContent = `${learner.firstName} ${learner.lastName} · ${gradeLabel(learner.grade)}`;
  pinValue.textContent = pin;
  setStatus(pinCopyStatus, '');
  pinDialog.showModal();
}

document.getElementById('pin-copy').addEventListener('click', async () => {
  if (!pinDetails) return;
  const text = `Em-Desh English Medium Private School\nLearner: ${pinDetails.name}\nStudent ID: ${pinDetails.studentId}\nPIN: ${pinDetails.pin}`;
  try {
    await navigator.clipboard.writeText(text);
    setStatus(pinCopyStatus, 'Copied to clipboard.', 'success');
  } catch {
    setStatus(pinCopyStatus, 'Copy failed — please write the details down.');
  }
});

// ---- session ---------------------------------------------------------------

async function checkSession() {
  try {
    await api('/api/admin/me');
    showDashboard();
    await refreshAll();
  } catch (error) {
    if (error.status === 401) forgetToken();
    else setStatus(loginStatus, errorMessage(error));
  }
}

function updateCodeDisplay() {
  const masked = `${'•'.repeat(adminCode.length)}${'_'.repeat(6 - adminCode.length)}`;
  codeDisplay.textContent = masked;
  codeDisplay.setAttribute('aria-label', adminCode.length ? `${adminCode.length} of 6 digits entered` : 'No digits entered');
}

function resetCodeEntry() {
  adminCode = '';
  updateCodeDisplay();
  setStatus(codeStatus, '');
}

openCodeButton.addEventListener('click', () => {
  resetCodeEntry();
  codeDialog.showModal();
  document.querySelector('.code-key')?.focus();
});

cancelCodeButton.addEventListener('click', () => {
  codeDialog.close();
  resetCodeEntry();
});

document.querySelectorAll('[data-code-key]').forEach((button) => {
  button.addEventListener('click', () => {
    if (adminCode.length >= 6) return;
    adminCode += button.dataset.codeKey;
    updateCodeDisplay();
  });
});

loginForm.addEventListener('keydown', (event) => {
  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    document.querySelector(`[data-code-key="${event.key}"]`)?.click();
  } else if (event.key === 'Backspace') {
    event.preventDefault();
    adminCode = adminCode.slice(0, -1);
    updateCodeDisplay();
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!/^\d{6}$/.test(adminCode)) {
    setStatus(codeStatus, 'Enter all six digits before pressing Enter.');
    return;
  }
  loginSubmit.disabled = true;
  setStatus(codeStatus, 'Checking code…', 'success');
  setStatus(loginStatus, '');
  try {
    const data = await api('/api/admin/login', { method: 'POST', body: { code: adminCode } });
    if (data?.token) persistToken(data.token);
    loginForm.reset();
    adminCode = '';
    updateCodeDisplay();
    setStatus(loginStatus, '');
    setStatus(codeStatus, '');
    codeDialog.close();
    showDashboard({ focus: true });
    await refreshAll();
  } catch (error) {
    setStatus(codeStatus, errorMessage(error));
  } finally {
    loginSubmit.disabled = false;
  }
});

signoutButton.addEventListener('click', async () => {
  signoutButton.disabled = true;
  try {
    await api('/api/admin/logout', { method: 'POST' });
  } catch {
    // The local view is cleared regardless.
  } finally {
    signoutButton.disabled = false;
    forgetToken();
    learners = [];
    applications = [];
    gallery = [];
    recordsLearner = null;
    records = { behavior: [], tests: [], reportCards: [] };
    showLogin('', { focus: true });
  }
});

async function refreshAll() {
  await Promise.allSettled([loadLearners(), loadApplications(), loadGallery(), loadHomepageSettings()]);
}

async function loadHomepageSettings() {
  try {
    const data = await api('/api/admin/site-settings');
    const settings = data.settings ?? {};
    homepageNotificationEnabled.checked = settings.notificationEnabled === true;
    homepageNotificationText.value = settings.notificationText ?? '';
    homepageNotificationLinkText.value = settings.notificationLinkText ?? '';
    homepageNotificationLinkUrl.value = settings.notificationLinkUrl ?? '';
  } catch (error) {
    if (error.status === 401) sessionExpired();
    else setStatus(homepageSettingsStatus, errorMessage(error, 'Homepage settings could not be loaded.'));
  }
}

homepageSettingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  homepageSettingsSubmit.disabled = true;
  setStatus(homepageSettingsStatus, 'Saving homepage notice…', 'success');
  try {
    await api('/api/admin/site-settings', {
      method: 'PATCH',
      body: {
        notificationEnabled: homepageNotificationEnabled.checked,
        notificationText: homepageNotificationText.value.trim(),
        notificationLinkText: homepageNotificationLinkText.value.trim(),
        notificationLinkUrl: homepageNotificationLinkUrl.value.trim(),
      },
    });
    setStatus(homepageSettingsStatus, 'Homepage notice saved.', 'success');
    toast('Homepage notice saved.');
  } catch (error) {
    if (error.status === 401) sessionExpired();
    else setStatus(homepageSettingsStatus, errorMessage(error, 'Homepage settings could not be saved.'));
  } finally {
    homepageSettingsSubmit.disabled = false;
  }
});

let welcomeVideoPreviewUrl = null;

function clearWelcomeVideoSelection() {
  welcomeVideoFile.value = '';
  welcomeVideoLabel.textContent = 'Choose a welcome video from this device';
  welcomeVideoPreview.hidden = true;
  welcomeVideoPreview.removeAttribute('src');
  if (welcomeVideoPreviewUrl) URL.revokeObjectURL(welcomeVideoPreviewUrl);
  welcomeVideoPreviewUrl = null;
}

welcomeVideoFile.addEventListener('change', () => {
  setStatus(welcomeVideoStatus, '');
  const file = welcomeVideoFile.files?.[0];
  if (!file) { clearWelcomeVideoSelection(); return; }
  if (!VIDEO_TYPES.includes(file.type) || file.size > MAX_VIDEO_BYTES) {
    clearWelcomeVideoSelection();
    setStatus(welcomeVideoStatus, 'Choose an MP4 or WebM video up to 25 MB.');
    return;
  }
  if (welcomeVideoPreviewUrl) URL.revokeObjectURL(welcomeVideoPreviewUrl);
  welcomeVideoPreviewUrl = URL.createObjectURL(file);
  welcomeVideoPreview.src = welcomeVideoPreviewUrl;
  welcomeVideoPreview.hidden = false;
  welcomeVideoLabel.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
});

welcomeVideoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = welcomeVideoFile.files?.[0];
  if (!file || !VIDEO_TYPES.includes(file.type) || file.size > MAX_VIDEO_BYTES) {
    setStatus(welcomeVideoStatus, 'Choose an MP4 or WebM video up to 25 MB.');
    return;
  }
  welcomeVideoSubmit.disabled = true;
  setStatus(welcomeVideoStatus, 'Preparing video upload…', 'success');
  try {
    const intent = await api('/api/admin/welcome-video', {
      method: 'POST', body: { contentType: file.type, sizeBytes: file.size },
    });
    setStatus(welcomeVideoStatus, 'Uploading welcome video…', 'success');
    let upload;
    const controller = new AbortController();
    const uploadTimer = setTimeout(() => controller.abort(), 180000);
    try {
      upload = await fetch(intent.uploadUrl, {
        method: 'PUT', credentials: 'same-origin',
        headers: { 'Content-Type': file.type }, body: file, signal: controller.signal,
      });
    } catch { throw new ApiError('network_unavailable', 0); }
    finally { clearTimeout(uploadTimer); }
    if (!upload.ok) throw new ApiError('upload_failed', upload.status);
    setStatus(welcomeVideoStatus, 'Checking the uploaded video…', 'success');
    await api('/api/admin/welcome-video/complete', { method: 'POST' });
    clearWelcomeVideoSelection();
    setStatus(welcomeVideoStatus, 'Welcome video replaced.', 'success');
    toast('Welcome video replaced.');
  } catch (error) {
    if (error.status === 401) sessionExpired();
    else setStatus(welcomeVideoStatus, errorMessage(error, 'The welcome video could not be uploaded.'));
  } finally {
    welcomeVideoSubmit.disabled = false;
  }
});

// ---- learners --------------------------------------------------------------

function renderStats(counts) {
  document.getElementById('stat-total').textContent = String(counts?.total ?? learners.length);
  document.getElementById('stat-active').textContent = String(counts?.active ?? learners.filter((item) => item.status === 'active').length);
}

function learnerRow(learner) {
  const row = document.createElement('tr');
  const displayName = `${learner.firstName} ${learner.lastName}`;

  const nameCell = document.createElement('td');
  nameCell.className = 'learner-cell';
  const name = document.createElement('strong');
  name.textContent = displayName;
  const id = document.createElement('span');
  id.className = 'mono';
  id.textContent = learner.studentId;
  nameCell.append(name, id);

  const gradeCell = document.createElement('td');
  gradeCell.textContent = gradeLabel(learner.grade);
  if (learner.className) {
    const classNote = document.createElement('small');
    classNote.className = 'grade-class';
    classNote.textContent = `Class ${learner.className}`;
    gradeCell.append(classNote);
  }

  const guardianCell = document.createElement('td');
  guardianCell.className = 'guardian-cell';
  const guardianName = document.createElement('span');
  guardianName.textContent = learner.guardianName || '—';
  guardianCell.append(guardianName);
  if (learner.guardianPhone) {
    const phone = document.createElement('small');
    phone.textContent = learner.guardianPhone;
    guardianCell.append(phone);
  }

  const statusCell = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = `badge ${learner.status === 'active' ? 'badge-active' : 'badge-inactive'}`;
  badge.textContent = learner.status === 'active' ? 'Active' : 'Inactive';
  statusCell.append(badge);

  const actionCell = document.createElement('td');
  const actions = document.createElement('div');
  actions.className = 'row-actions';

  const openRecordsButton = document.createElement('button');
  openRecordsButton.type = 'button';
  openRecordsButton.className = 'btn btn-ghost btn-sm';
  openRecordsButton.textContent = 'Records';
  openRecordsButton.setAttribute('aria-label', `Records for ${displayName}`);
  openRecordsButton.addEventListener('click', () => openRecords(learner));

  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'btn btn-ghost btn-sm';
  edit.textContent = 'Edit';
  edit.setAttribute('aria-label', `Edit ${displayName}`);
  edit.addEventListener('click', () => openLearnerForm(learner));

  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'btn btn-ghost btn-sm';
  reset.textContent = 'Reset PIN';
  reset.setAttribute('aria-label', `Reset PIN for ${displayName}`);
  reset.addEventListener('click', () => resetPin(learner));

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = `btn btn-ghost btn-sm${learner.status === 'active' ? ' btn-danger-ghost' : ''}`;
  toggle.textContent = learner.status === 'active' ? 'Deactivate' : 'Activate';
  toggle.setAttribute('aria-label', `${learner.status === 'active' ? 'Deactivate' : 'Activate'} ${displayName}`);
  toggle.addEventListener('click', () => toggleStatus(learner));

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn-ghost btn-sm btn-danger-ghost';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete ${displayName}`);
  remove.addEventListener('click', () => deleteLearner(learner));

  actions.append(openRecordsButton, edit, reset, toggle, remove);
  actionCell.append(actions);

  row.append(nameCell, gradeCell, guardianCell, statusCell, actionCell);
  return row;
}

const GRADE_RANK = { KG: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7 };

function groupLearners(list) {
  const groups = new Map();
  for (const learner of list) {
    const key = learner.grade;
    if (!groups.has(key)) groups.set(key, { grade: learner.grade, learners: [] });
    groups.get(key).learners.push(learner);
  }
  return [...groups.values()].map((group) => {
    group.learners.sort((a, b) => {
      const classCompare = (a.className || '').localeCompare(b.className || '');
      if (classCompare !== 0) return classCompare;
      return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
    });
    return group;
  }).sort((a, b) => {
    const byGrade = (GRADE_RANK[a.grade] ?? 99) - (GRADE_RANK[b.grade] ?? 99);
    if (byGrade !== 0) return byGrade;
    return String(a.grade).localeCompare(String(b.grade));
  });
}

function learnerGroup(group) {
  const section = document.createElement('section');
  section.className = 'learner-group';
  section.dataset.grade = group.grade;

  const head = document.createElement('header');
  head.className = 'learner-group-head';
  const title = document.createElement('h3');
  title.textContent = gradeLabel(group.grade);
  const count = document.createElement('span');
  count.className = 'learner-group-count';
  count.textContent = `${group.learners.length} learner${group.learners.length === 1 ? '' : 's'}`;
  head.append(title, count);

  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  const table = document.createElement('table');
  table.className = 'data-table';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (const label of ['Learner', 'Grade', 'Guardian', 'Status', 'Actions']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    headerRow.append(th);
  }
  thead.append(headerRow);
  const tbody = document.createElement('tbody');
  tbody.append(...group.learners.map(learnerRow));
  table.append(thead, tbody);
  wrap.append(table);
  section.append(head, wrap);
  return section;
}

function renderLearners() {
  const query = learnerSearch.value.trim().toLowerCase();
  const filtered = learners.filter((learner) => {
    if (!query) return true;
    return [
      learner.firstName, learner.lastName, learner.studentId,
      learner.guardianName, learner.guardianPhone, learner.grade, learner.className,
    ].join(' ').toLowerCase().includes(query);
  });

  if (learners.length === 0) {
    learnerCount.textContent = 'No learners registered';
    learnersEmptyText.textContent = 'No learners registered yet. Use “Register learner” to add the first one.';
  } else if (filtered.length === 0) {
    learnerCount.textContent = `0 of ${learners.length} learners`;
    learnersEmptyText.textContent = 'No learners match that search.';
  } else {
    learnerCount.textContent = `${filtered.length} of ${learners.length} learner${learners.length === 1 ? '' : 's'}`;
  }

  const groups = groupLearners(filtered);
  learnersGroups.replaceChildren(...groups.map(learnerGroup));
  const hasRows = groups.length > 0;
  learnersGroups.hidden = !hasRows;
  learnersEmpty.hidden = hasRows;
}

async function loadLearners() {
  learnersError.hidden = true;
  try {
    const data = await api('/api/admin/learners');
    learners = Array.isArray(data.items) ? data.items : [];
    renderStats(data.counts);
    renderLearners();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    learnersError.textContent = errorMessage(error, 'Learners could not be loaded.');
    learnersError.hidden = false;
  }
}

function openDeleteAllDialog() {
  deleteAllCount.textContent = `${learners.length} learner${learners.length === 1 ? '' : 's'}`;
  deleteAllForm.reset();
  deleteAllSubmit.disabled = true;
  setStatus(deleteAllStatus, '');
  deleteAllDialog.showModal();
  deleteAllConfirmation.focus();
}

deleteAllConfirmation.addEventListener('input', () => {
  deleteAllSubmit.disabled = deleteAllConfirmation.value !== 'delete all learners';
});

deleteAllForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (deleteAllConfirmation.value !== 'delete all learners') {
    setStatus(deleteAllStatus, 'Type the exact phrase to continue.');
    return;
  }
  deleteAllSubmit.disabled = true;
  setStatus(deleteAllStatus, 'Deleting learner records…', 'success');
  try {
    const result = await api('/api/admin/learners/bulk-delete', {
      method: 'DELETE',
      body: { confirmation: deleteAllConfirmation.value },
    });
    deleteAllDialog.close();
    await loadLearners();
    toast(`${result.deleted ?? 0} learner${result.deleted === 1 ? '' : 's'} deleted.`);
  } catch (error) {
    if (error.status === 401) sessionExpired();
    else setStatus(deleteAllStatus, errorMessage(error, 'Learners could not be deleted.'));
    deleteAllSubmit.disabled = false;
  }
});

document.getElementById('delete-all-learners').addEventListener('click', openDeleteAllDialog);

function openLearnerForm(learner = null) {
  learnerForm.reset();
  setStatus(learnerStatus, '');
  learnerId.value = learner?.id ?? '';
  document.getElementById('learner-dialog-kicker').textContent = learner ? 'Learner record' : 'Registration';
  document.getElementById('learner-dialog-title').textContent = learner ? 'Edit learner' : 'Register a learner';
  learnerSubmit.textContent = learner ? 'Save changes' : 'Save learner';
  if (learner) {
    learnerFirst.value = learner.firstName;
    learnerLast.value = learner.lastName;
    learnerGrade.value = learner.grade;
    learnerClass.value = learner.className ?? '';
    learnerGuardian.value = learner.guardianName ?? '';
    learnerPhone.value = learner.guardianPhone ?? '';
  }
  learnerDialog.showModal();
  learnerFirst.focus();
}

learnerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!learnerForm.reportValidity()) return;
  const id = learnerId.value;
  const payload = {
    firstName: learnerFirst.value.trim(),
    lastName: learnerLast.value.trim(),
    grade: learnerGrade.value,
    className: learnerClass.value.trim(),
    guardianName: learnerGuardian.value.trim(),
    guardianPhone: learnerPhone.value.trim(),
  };
  learnerSubmit.disabled = true;
  setStatus(learnerStatus, 'Saving…', 'success');
  try {
    if (id) {
      await api(`/api/admin/learners/${id}`, { method: 'PATCH', body: payload });
      learnerDialog.close();
      toast('Learner record updated.');
    } else {
      const data = await api('/api/admin/learners', { method: 'POST', body: payload });
      learnerDialog.close();
      showPinDialog(data.learner, data.pin);
    }
    await loadLearners();
  } catch (error) {
    if (error.status === 401) {
      sessionExpired();
    } else {
      setStatus(learnerStatus, errorMessage(error));
    }
  } finally {
    learnerSubmit.disabled = false;
  }
});

// ---- bulk learner import ----------------------------------------------------

const BULK_HEADERS = {
  firstName: ['firstname', 'first', 'givenname'],
  lastName: ['lastname', 'last', 'surname', 'familyname'],
  grade: ['grade', 'year', 'level'],
  className: ['class', 'classname', 'stream'],
  guardianName: ['guardianname', 'guardian', 'parentname'],
  guardianPhone: ['guardianphone', 'phone', 'guardiancontact', 'contact'],
};

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function downloadCsv(filename, rows) {
  const blob = new Blob([rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { value += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else value += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(value); value = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(value); value = '';
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
    } else value += char;
  }
  if (quoted) throw new Error('unterminated_csv_quote');
  if (value || row.length) { row.push(value); if (row.some((cell) => cell.trim())) rows.push(row); }
  return rows;
}

function headerKey(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeBulkGrade(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (['kg', 'k', 'kindergarten', 'pre-primary', 'preprimary'].includes(text)) return 'KG';
  const match = /^(?:grade\s*)?([1-7])$/.exec(text);
  return match ? match[1] : '';
}

function findHeaderIndexes(headers) {
  const indexes = {};
  headers.forEach((header, index) => {
    const key = headerKey(header);
    for (const [field, aliases] of Object.entries(BULK_HEADERS)) {
      if (aliases.includes(key) && indexes[field] === undefined) indexes[field] = index;
    }
  });
  return indexes;
}

function learnerDuplicateKey(row) {
  return `${row.firstName}|${row.lastName}|${row.grade}`.toLowerCase().replace(/\s+/g, ' ').trim();
}

function validateBulkRows(rows) {
  if (!rows.length) return { rows: [], headerError: 'The CSV file is empty.' };
  const indexes = findHeaderIndexes(rows[0]);
  const missing = ['firstName', 'lastName', 'grade'].filter((field) => indexes[field] === undefined);
  if (missing.length) return { rows: [], headerError: `Missing required column${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.` };
  const seen = new Set(learners.map((learner) => learnerDuplicateKey({ firstName: learner.firstName, lastName: learner.lastName, grade: learner.grade })));
  const fileSeen = new Set();
  const result = [];
  rows.slice(1).forEach((cells, offset) => {
    const row = { rowNumber: offset + 2, firstName: cells[indexes.firstName]?.trim() ?? '', lastName: cells[indexes.lastName]?.trim() ?? '', grade: normalizeBulkGrade(cells[indexes.grade]), className: cells[indexes.className]?.trim() ?? '', guardianName: cells[indexes.guardianName]?.trim() ?? '', guardianPhone: cells[indexes.guardianPhone]?.trim() ?? '', errors: [] };
    if (!row.firstName) row.errors.push('first name is required');
    if (!row.lastName) row.errors.push('last name is required');
    if (!row.grade) row.errors.push('grade must be KG or 1–7');
    if (row.firstName.length > 80 || row.lastName.length > 80) row.errors.push('name is too long');
    if (row.className.length > 20) row.errors.push('class is too long');
    if (row.guardianName.length > 100) row.errors.push('guardian name is too long');
    if (row.guardianPhone.length > 40) row.errors.push('guardian phone is too long');
    if (row.firstName && row.lastName && row.grade) {
      const key = learnerDuplicateKey(row);
      if (seen.has(key)) row.errors.push('already registered');
      else if (fileSeen.has(key)) row.errors.push('duplicate in this file');
      fileSeen.add(key);
    }
    row.ready = row.errors.length === 0;
    result.push(row);
  });
  return { rows: result };
}

function renderBulkSummary(rows) {
  const ready = rows.filter((row) => row.ready).length;
  const problems = rows.length - ready;
  bulkSummary.innerHTML = `<span class="bulk-chip bulk-chip-ready">${ready} ready</span><span class="bulk-chip ${problems ? 'bulk-chip-error' : ''}">${problems} need attention</span><span class="bulk-chip">${rows.length} total</span>`;
  bulkSummary.hidden = false;
  bulkImport.disabled = ready === 0;
  bulkImport.textContent = ready ? `Register ${ready} learner${ready === 1 ? '' : 's'}` : 'Register ready learners';
}

function renderBulkPreview(rows) {
  const table = document.createElement('table');
  table.className = 'data-table bulk-table';
  table.innerHTML = '<thead><tr><th>Row</th><th>Learner</th><th>Grade</th><th>Class</th><th>Guardian</th><th>Status</th></tr></thead>';
  const body = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    const cells = [row.rowNumber, `${row.firstName} ${row.lastName}`.trim() || '—', row.grade || '—', row.className || '—', row.guardianName || '—'];
    cells.forEach((value) => { const td = document.createElement('td'); td.textContent = value; tr.append(td); });
    const status = document.createElement('td');
    status.className = row.ready ? 'bulk-status-ready' : 'bulk-status-error';
    status.textContent = row.ready ? 'Ready' : row.errors.join(', ');
    tr.append(status); body.append(tr);
  });
  table.append(body);
  bulkPreview.replaceChildren(table);
  bulkPreviewWrap.hidden = false;
  renderBulkSummary(rows);
}

function resetBulkDialog() {
  bulkRows = [];
  bulkCredentialsData = [];
  bulkFile.value = '';
  bulkSetup.hidden = false;
  bulkResults.hidden = true;
  bulkPreviewWrap.hidden = true;
  bulkSummary.hidden = true;
  bulkPreview.replaceChildren();
  bulkCredentials.replaceChildren();
  bulkFailures.hidden = true;
  bulkPrint.hidden = true;
  bulkImport.hidden = false;
  bulkImport.disabled = true;
  bulkImport.textContent = 'Register ready learners';
  bulkClose.textContent = 'Cancel';
  bulkClose.disabled = false;
  bulkNeedsLogin = false;
  setStatus(bulkStatus, '');
}

function openBulkDialog() {
  resetBulkDialog();
  bulkDialog.showModal();
}

function renderCredentials(items) {
  bulkCredentials.replaceChildren(...items.map((item) => {
    const card = document.createElement('article');
    card.className = 'credential-card';
    card.innerHTML = '<strong></strong><span></span><b></b>';
    card.querySelector('strong').textContent = `${item.learner.firstName} ${item.learner.lastName}`;
    card.querySelector('span').textContent = `${item.learner.studentId} · ${gradeLabel(item.learner.grade)}`;
    card.querySelector('b').textContent = `PIN: ${item.pin}`;
    return card;
  }));
}

async function importBulkRows() {
  const readyRows = bulkRows.filter((row) => row.ready);
  if (!readyRows.length) return;
  const confirmed = await confirmAction({
    title: 'Register these learners?',
    message: `This will create ${readyRows.length} learner record${readyRows.length === 1 ? '' : 's'}. Each learner will receive a new student ID and one-time PIN.`,
    label: 'Register learners',
  });
  if (!confirmed) return;
  bulkImport.disabled = true;
  bulkClose.disabled = true;
  bulkImport.textContent = 'Registering…';
  const created = [];
  const failures = [];
  for (const row of readyRows) {
    try {
      const data = await api('/api/admin/learners', { method: 'POST', body: { firstName: row.firstName, lastName: row.lastName, grade: row.grade, className: row.className, guardianName: row.guardianName, guardianPhone: row.guardianPhone } });
      created.push({ rowNumber: row.rowNumber, learner: data.learner, pin: data.pin });
    } catch (error) {
      if (error.status === 401) {
        bulkNeedsLogin = true;
        failures.push(`Row ${row.rowNumber}: your session ended. Close this sheet after printing any credentials, then sign in again.`);
        break;
      }
      failures.push(`Row ${row.rowNumber}: ${errorMessage(error, 'could not be registered')}`);
    }
  }
  bulkCredentialsData = created;
  bulkSetup.hidden = true;
  bulkResults.hidden = false;
  bulkImport.hidden = true;
  bulkPrint.hidden = created.length === 0;
  bulkClose.disabled = false;
  bulkClose.textContent = 'Close';
  bulkResultSummary.innerHTML = `<span class="bulk-chip bulk-chip-ready">${created.length} registered</span><span class="bulk-chip ${failures.length ? 'bulk-chip-error' : ''}">${failures.length} failed</span>`;
  renderCredentials(created);
  if (failures.length) { bulkFailures.textContent = failures.join(' '); bulkFailures.hidden = false; }
  await loadLearners();
  if (created.length) toast(`${created.length} learner${created.length === 1 ? '' : 's'} registered.`);
}

document.getElementById('import-learners').addEventListener('click', openBulkDialog);
document.getElementById('download-template').addEventListener('click', () => downloadCsv('em-desh-learner-import-template.csv', [
  ['First name', 'Last name', 'Grade', 'Class', 'Guardian name', 'Guardian phone'],
  ['Maria', 'Amutenya', '4', 'A', 'Ndapewa Amutenya', '+264 81 555 0001'],
]));
bulkFile.addEventListener('change', async () => {
  const file = bulkFile.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { setStatus(bulkStatus, 'Choose a CSV file smaller than 2 MB.'); return; }
  try {
    const parsed = validateBulkRows(parseCsv(await file.text()));
    if (parsed.headerError) { bulkRows = []; bulkPreviewWrap.hidden = true; bulkSummary.hidden = true; bulkImport.disabled = true; setStatus(bulkStatus, parsed.headerError); return; }
    bulkRows = parsed.rows;
    setStatus(bulkStatus, 'Preview ready. Check the rows, then confirm registration.', 'success');
    renderBulkPreview(bulkRows);
  } catch {
    setStatus(bulkStatus, 'This CSV file could not be read. Download the template and try again.');
  }
});
bulkImport.addEventListener('click', importBulkRows);
bulkPrint.addEventListener('click', () => window.print());
bulkDialog.addEventListener('close', () => {
  const needsLogin = bulkNeedsLogin;
  resetBulkDialog();
  if (needsLogin) showLogin('Your session has ended. Please sign in again.', { focus: true });
});

async function resetPin(learner) {
  const name = `${learner.firstName} ${learner.lastName}`;
  const confirmed = await confirmAction({
    title: 'Reset this learner’s PIN?',
    message: `A new PIN will be issued for ${name} (${learner.studentId}). The current PIN stops working immediately.`,
    label: 'Reset PIN',
  });
  if (!confirmed) return;
  try {
    const data = await api(`/api/admin/learners/${learner.id}`, { method: 'PATCH', body: { resetPin: true } });
    showPinDialog(data.learner, data.pin, { reset: true });
    await loadLearners();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    toast(errorMessage(error), 'error');
  }
}

async function toggleStatus(learner) {
  const deactivating = learner.status === 'active';
  const name = `${learner.firstName} ${learner.lastName}`;
  const confirmed = await confirmAction({
    title: deactivating ? 'Deactivate this learner?' : 'Reactivate this learner?',
    message: deactivating
      ? `${name} will not be able to sign in to the learner portal until reactivated. Their record and student ID are kept.`
      : `${name} will be able to sign in to the learner portal again.`,
    label: deactivating ? 'Deactivate' : 'Activate',
  });
  if (!confirmed) return;
  try {
    await api(`/api/admin/learners/${learner.id}`, {
      method: 'PATCH', body: { status: deactivating ? 'inactive' : 'active' },
    });
    toast(deactivating ? 'Learner deactivated.' : 'Learner activated.');
    await loadLearners();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    toast(errorMessage(error), 'error');
  }
}

async function deleteLearner(learner) {
  const name = `${learner.firstName} ${learner.lastName}`;
  const confirmed = await confirmAction({
    title: 'Delete this learner?',
    message: `${name} (${learner.studentId}) will be removed permanently, together with their behaviour notes, test results, report cards and portal sign-ins. This cannot be undone.`,
    label: 'Delete learner',
  });
  if (!confirmed) return;
  try {
    await api(`/api/admin/learners/${learner.id}`, { method: 'DELETE' });
    toast('Learner deleted.');
    await loadLearners();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    toast(errorMessage(error), 'error');
  }
}

learnerSearch.addEventListener('input', renderLearners);
document.getElementById('add-learner').addEventListener('click', () => openLearnerForm());

// ---- learner records --------------------------------------------------------

function recordMeta(parts) {
  return parts.filter(Boolean).join(' · ');
}

function behaviorCard(row) {
  const item = document.createElement('li');
  item.className = 'record-item';
  const body = document.createElement('div');
  body.className = 'record-item-body';
  const note = document.createElement('p');
  note.className = 'record-note';
  note.textContent = row.note;
  const meta = document.createElement('p');
  meta.className = 'record-meta';
  meta.textContent = recordMeta([formatDate(row.recordedOn), formatDate(row.createdAt)]);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn-ghost btn-sm btn-danger-ghost';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', 'Delete this behaviour note');
  remove.addEventListener('click', () => deleteRecord(`/api/admin/behavior/${row.id}`, 'behaviour note'));

  body.append(note, meta);
  item.append(body, remove);
  return item;
}

function testCard(row) {
  const item = document.createElement('li');
  item.className = 'record-item';
  const body = document.createElement('div');
  body.className = 'record-item-body';
  const title = document.createElement('p');
  title.className = 'record-note';
  title.textContent = `${row.subject} — ${row.score}%`;
  const meta = document.createElement('p');
  meta.className = 'record-meta';
  meta.textContent = recordMeta([row.term, formatDate(row.recordedOn), formatDate(row.createdAt)]);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn-ghost btn-sm btn-danger-ghost';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete result for ${row.subject}`);
  remove.addEventListener('click', () => deleteRecord(`/api/admin/tests/${row.id}`, 'test result'));

  body.append(title, meta);
  item.append(body, remove);
  return item;
}

function reportCard(row) {
  const item = document.createElement('li');
  item.className = 'record-item';
  const body = document.createElement('div');
  body.className = 'record-item-body';
  const title = document.createElement('p');
  title.className = 'record-note';
  title.textContent = row.fileName || 'Report card';
  const meta = document.createElement('p');
  meta.className = 'record-meta';
  meta.textContent = recordMeta([
    row.term,
    formatDate(row.createdAt),
    row.sizeBytes ? `${(row.sizeBytes / (1024 * 1024)).toFixed(1)} MB` : '',
    row.status === 'pending' ? 'Upload incomplete' : '',
  ]);

  const actions = document.createElement('div');
  actions.className = 'record-item-actions';
  if (row.status === 'ready' && row.url) {
    const open = document.createElement('a');
    open.className = 'btn btn-ghost btn-sm';
    open.href = row.url;
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = 'Open';
    actions.append(open);
  }
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn-ghost btn-sm btn-danger-ghost';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete report card ${row.fileName || ''}`.trim());
  remove.addEventListener('click', () => deleteReportCard(row));
  actions.append(remove);

  body.append(title, meta);
  item.append(body, actions);
  return item;
}

function renderRecords() {
  behaviorCount.textContent = String(records.behavior.length);
  testsCount.textContent = String(records.tests.length);
  reportCount.textContent = String(records.reportCards.length);

  behaviorList.replaceChildren(...records.behavior.map(behaviorCard));
  behaviorEmpty.hidden = records.behavior.length > 0;
  testList.replaceChildren(...records.tests.map(testCard));
  testEmpty.hidden = records.tests.length > 0;
  reportList.replaceChildren(...records.reportCards.map(reportCard));
  reportEmpty.hidden = records.reportCards.length > 0;
}

function openRecords(learner) {
  recordsLearner = learner;
  records = { behavior: [], tests: [], reportCards: [] };
  recordsSub.textContent = `${learner.firstName} ${learner.lastName} · ${learner.studentId} · ${gradeLabel(learner.grade)}`;
  recordsError.hidden = true;
  behaviorForm.reset();
  testForm.reset();
  reportForm.reset();
  [behaviorStatus, testStatus, reportStatus].forEach((node) => setStatus(node, ''));
  [behaviorSubmit, testSubmit, reportSubmit].forEach((button) => { button.disabled = false; });
  renderRecords();
  recordsDialog.showModal();
  loadRecords();
}

async function loadRecords() {
  if (!recordsLearner) return;
  const learnerId = recordsLearner.id;
  recordsError.hidden = true;
  try {
    const data = await api(`/api/admin/learners/${learnerId}/records`);
    if (recordsLearner?.id !== learnerId) return;
    records = {
      behavior: Array.isArray(data.behavior) ? data.behavior : [],
      tests: Array.isArray(data.tests) ? data.tests : [],
      reportCards: Array.isArray(data.reportCards) ? data.reportCards : [],
    };
    renderRecords();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    recordsError.textContent = errorMessage(error, 'Records could not be loaded.');
    recordsError.hidden = false;
  }
}

async function deleteRecord(path, label) {
  const confirmed = await confirmAction({
    title: 'Delete this record?',
    message: `The ${label} will be removed from this learner’s record. This cannot be undone.`,
    label: 'Delete',
  });
  if (!confirmed) return;
  try {
    await api(path, { method: 'DELETE' });
    toast('Record deleted.');
    await loadRecords();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    recordsError.textContent = errorMessage(error);
    recordsError.hidden = false;
  }
}

async function deleteReportCard(row) {
  const confirmed = await confirmAction({
    title: 'Delete this report card?',
    message: `“${row.fileName || 'Report card'}” will be removed from the learner portal. This cannot be undone.`,
    label: 'Delete report card',
  });
  if (!confirmed) return;
  try {
    await api(`/api/admin/report-cards/${row.id}`, { method: 'DELETE' });
    toast('Report card deleted.');
    await loadRecords();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    recordsError.textContent = errorMessage(error);
    recordsError.hidden = false;
  }
}

behaviorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!recordsLearner || !behaviorForm.reportValidity()) return;
  behaviorSubmit.disabled = true;
  setStatus(behaviorStatus, 'Saving…', 'success');
  try {
    await api(`/api/admin/learners/${recordsLearner.id}/behavior`, {
      method: 'POST',
      body: { note: behaviorNote.value.trim(), recordedOn: behaviorDate.value || undefined },
    });
    behaviorNote.value = '';
    behaviorDate.value = '';
    setStatus(behaviorStatus, '');
    toast('Behaviour note saved.');
    await loadRecords();
  } catch (error) {
    if (error.status === 401) {
      sessionExpired();
    } else {
      setStatus(behaviorStatus, errorMessage(error));
    }
  } finally {
    behaviorSubmit.disabled = false;
  }
});

testForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!recordsLearner || !testForm.reportValidity()) return;
  testSubmit.disabled = true;
  setStatus(testStatus, 'Saving…', 'success');
  try {
    await api(`/api/admin/learners/${recordsLearner.id}/tests`, {
      method: 'POST',
      body: {
        subject: testSubject.value.trim(),
        score: Number(testScore.value),
        term: testTerm.value.trim(),
        recordedOn: testDate.value || undefined,
      },
    });
    testSubject.value = '';
    testScore.value = '';
    testTerm.value = '';
    testDate.value = '';
    setStatus(testStatus, '');
    toast('Test result saved.');
    await loadRecords();
  } catch (error) {
    if (error.status === 401) {
      sessionExpired();
    } else {
      setStatus(testStatus, errorMessage(error));
    }
  } finally {
    testSubmit.disabled = false;
  }
});

reportForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!recordsLearner || !reportForm.reportValidity()) return;
  const file = reportFile.files?.[0];
  if (!file) {
    setStatus(reportStatus, 'Choose a report card file first.');
    return;
  }
  if (!DOCUMENT_TYPES.includes(file.type)) {
    setStatus(reportStatus, 'Use a PDF, JPG, PNG or WebP file.');
    return;
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    setStatus(reportStatus, 'That file is larger than 10 MB. Choose a smaller file.');
    return;
  }

  reportSubmit.disabled = true;
  setStatus(reportStatus, 'Preparing upload…', 'success');
  try {
    const intent = await api(`/api/admin/learners/${recordsLearner.id}/report-cards`, {
      method: 'POST',
      body: {
        fileName: file.name.slice(0, 120),
        contentType: file.type,
        sizeBytes: file.size,
        term: reportTerm.value.trim(),
      },
    });
    setStatus(reportStatus, 'Uploading report card…', 'success');
    let upload;
    const controller = new AbortController();
    const uploadTimer = setTimeout(() => controller.abort(), 120000);
    try {
      upload = await fetch(intent.uploadUrl, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': file.type },
        body: file,
        signal: controller.signal,
      });
    } catch {
      throw new ApiError('network_unavailable', 0);
    } finally {
      clearTimeout(uploadTimer);
    }
    if (!upload.ok) throw new ApiError('upload_failed', upload.status);
    setStatus(reportStatus, 'Checking the uploaded report card…', 'success');
    await api(`/api/admin/report-cards/${intent.id}/complete`, { method: 'POST' });
    reportForm.reset();
    setStatus(reportStatus, 'Report card uploaded.', 'success');
    toast('Report card uploaded.');
    await loadRecords();
  } catch (error) {
    if (error.status === 401) {
      sessionExpired();
    } else {
      setStatus(reportStatus, errorMessage(error));
    }
  } finally {
    reportSubmit.disabled = false;
  }
});

// ---- applications ----------------------------------------------------------

const STATUS_LABELS = { new: 'New', contacted: 'Contacted', archived: 'Archived' };

function parentLine(label, name, occupation, phone) {
  const wrap = document.createElement('span');
  wrap.textContent = `${label}: ${name || '—'}${occupation ? ` (${occupation})` : ''}`;
  if (phone) {
    const link = document.createElement('a');
    link.href = `tel:${phone.replace(/\s+/g, '')}`;
    link.textContent = phone;
    wrap.append(' · ', link);
  }
  return wrap;
}

function letterRow(term, value) {
  const row = document.createElement('div');
  row.className = 'letter-row';
  const dt = document.createElement('dt');
  dt.textContent = term;
  const dd = document.createElement('dd');
  dd.textContent = value || '—';
  row.append(dt, dd);
  return row;
}

function printApplication(item) {
  const header = document.createElement('header');
  header.className = 'letter-head';
  const school = document.createElement('div');
  school.className = 'letter-school';
  const logo = document.createElement('img');
  logo.className = 'letter-logo';
  logo.src = 'assets/emdesh-logo.jpg';
  logo.alt = '';
  const schoolText = document.createElement('div');
  const schoolName = document.createElement('h1');
  schoolName.textContent = 'Em-Desh English Medium Private School';
  const schoolMeta = document.createElement('p');
  schoolMeta.textContent = 'Along the C41 road, Okahao, Omusati Region, Namibia · +264 81 892 2721';
  schoolText.append(schoolName, schoolMeta);
  school.append(logo, schoolText);
  const today = document.createElement('p');
  today.className = 'letter-date';
  today.textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  header.append(school, today);

  const title = document.createElement('h2');
  title.className = 'letter-title';
  title.textContent = 'Application for admission';

  const intro = document.createElement('p');
  intro.className = 'letter-intro';
  intro.textContent = `This letter records the application received through the school website for ${item.firstName} ${item.lastName}.`;

  const details = document.createElement('dl');
  details.className = 'letter-details';
  details.append(
    letterRow('Learner', `${item.firstName} ${item.lastName}`),
    letterRow('Applying for', gradeLabel(item.grade)),
    letterRow('Application received', formatDate(item.createdAt)),
    letterRow('Status', STATUS_LABELS[item.status] ?? item.status),
    letterRow('Father', item.fatherName),
    letterRow('Father’s occupation', item.fatherOccupation),
    letterRow('Father’s phone', item.fatherPhone),
    letterRow('Mother', item.motherName),
    letterRow('Mother’s occupation', item.motherOccupation),
    letterRow('Mother’s phone', item.motherPhone),
    letterRow('Guardian', item.guardianName),
    letterRow('Guardian email', item.guardianEmail),
    letterRow('Guardian phone', item.guardianPhone),
  );

  const messageHead = document.createElement('h3');
  messageHead.textContent = 'Guardian’s message';
  const message = document.createElement('p');
  message.className = 'letter-message';
  message.textContent = item.message || 'No message was included with the application.';

  const officeHead = document.createElement('h3');
  officeHead.textContent = 'School office use';
  const lines = document.createElement('div');
  lines.className = 'letter-lines';
  for (const label of ['Decision', 'Date contacted', 'Staff signature']) {
    const line = document.createElement('p');
    line.textContent = `${label}:`;
    lines.append(line);
  }

  const footer = document.createElement('footer');
  footer.className = 'letter-foot';
  footer.textContent = 'Em-Desh English Medium Private School · Kindergarten–Grade 7 · Okahao, Omusati Region';

  printLetter.replaceChildren(header, title, intro, details, messageHead, message, officeHead, lines, footer);
  document.body.classList.add('is-printing');
  window.addEventListener('afterprint', () => document.body.classList.remove('is-printing'), { once: true });
  window.print();
}

function applicationCard(item) {
  const card = document.createElement('article');
  card.className = `application-card${item.status === 'archived' ? ' is-archived' : ''}`;

  const head = document.createElement('div');
  head.className = 'application-head';
  const titleWrap = document.createElement('div');
  const name = document.createElement('h3');
  name.className = 'application-name';
  name.textContent = `${item.firstName} ${item.lastName}`;
  const meta = document.createElement('p');
  meta.className = 'application-meta';
  meta.textContent = [`Applying for ${gradeLabel(item.grade)}`, `Sent ${formatDate(item.createdAt)}`].filter(Boolean).join(' · ');
  titleWrap.append(name, meta);

  const badge = document.createElement('span');
  badge.className = `badge badge-${item.status}`;
  badge.textContent = STATUS_LABELS[item.status] ?? item.status;
  head.append(titleWrap, badge);

  const contact = document.createElement('p');
  contact.className = 'application-contact';
  const guardian = document.createElement('span');
  guardian.textContent = item.guardianName || 'No guardian name';
  contact.append(guardian);
  if (item.guardianEmail) {
    const email = document.createElement('a');
    email.href = `mailto:${item.guardianEmail}`;
    email.textContent = item.guardianEmail;
    contact.append(email);
  }
  if (item.guardianPhone) {
    const phone = document.createElement('a');
    phone.href = `tel:${item.guardianPhone.replace(/\s+/g, '')}`;
    phone.textContent = item.guardianPhone;
    contact.append(phone);
  }

  const parents = document.createElement('p');
  parents.className = 'application-contact application-parents';
  parents.append(
    parentLine('Father', item.fatherName, item.fatherOccupation, item.fatherPhone),
    parentLine('Mother', item.motherName, item.motherOccupation, item.motherPhone),
  );

  card.append(head, contact, parents);

  if (item.message) {
    const message = document.createElement('p');
    message.className = 'application-message';
    message.textContent = item.message;
    card.append(message);
  }

  const actions = document.createElement('div');
  actions.className = 'application-actions';

  const select = document.createElement('select');
  select.className = 'input';
  select.setAttribute('aria-label', `Status for ${item.firstName} ${item.lastName}`);
  for (const status of ['new', 'contacted', 'archived']) {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = STATUS_LABELS[status];
    select.append(option);
  }
  select.value = item.status;
  select.addEventListener('change', () => updateApplicationStatus(item, select));

  const print = document.createElement('button');
  print.type = 'button';
  print.className = 'btn btn-ghost btn-sm';
  print.textContent = 'Print letter';
  print.setAttribute('aria-label', `Print application letter for ${item.firstName} ${item.lastName}`);
  print.addEventListener('click', () => printApplication(item));

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn-ghost btn-sm btn-danger-ghost';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete application from ${item.firstName} ${item.lastName}`);
  remove.addEventListener('click', () => deleteApplication(item));

  actions.append(print, select, remove);
  card.append(actions);
  return card;
}

function renderApplications(counts = null) {
  const newCount = counts?.new ?? applications.filter((item) => item.status === 'new').length;
  document.getElementById('stat-applications').textContent = String(newCount);

  if (applications.length === 0) {
    applicationCount.textContent = 'No applications yet';
  } else {
    const contacted = counts?.contacted ?? applications.filter((item) => item.status === 'contacted').length;
    applicationCount.textContent = `${applications.length} application${applications.length === 1 ? '' : 's'} · ${newCount} new · ${contacted} contacted`;
  }

  applicationsList.replaceChildren(...applications.map(applicationCard));
  applicationsList.hidden = applications.length === 0;
  applicationsEmpty.hidden = applications.length > 0;
}

async function loadApplications() {
  applicationsError.hidden = true;
  try {
    const data = await api('/api/admin/applications');
    applications = Array.isArray(data.items) ? data.items : [];
    renderApplications(data.counts);
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    applicationsError.textContent = errorMessage(error, 'Applications could not be loaded.');
    applicationsError.hidden = false;
  }
}

async function updateApplicationStatus(item, select) {
  select.disabled = true;
  try {
    await api(`/api/admin/applications/${item.id}`, { method: 'PATCH', body: { status: select.value } });
    toast(`Application marked as ${STATUS_LABELS[select.value].toLowerCase()}.`);
    await loadApplications();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    toast(errorMessage(error), 'error');
    select.value = item.status;
  } finally {
    select.disabled = false;
  }
}

async function deleteApplication(item) {
  const confirmed = await confirmAction({
    title: 'Delete this application?',
    message: `The application from ${item.firstName} ${item.lastName} will be removed from the dashboard. This cannot be undone.`,
    label: 'Delete application',
  });
  if (!confirmed) return;
  try {
    await api(`/api/admin/applications/${item.id}`, { method: 'DELETE' });
    toast('Application deleted.');
    await loadApplications();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    applicationsError.textContent = errorMessage(error);
    applicationsError.hidden = false;
  }
}

// ---- gallery ---------------------------------------------------------------

function adminPhoto(item) {
  const card = document.createElement('article');
  card.className = 'admin-photo';

  if (item.status === 'ready' && item.url) {
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = item.caption || 'School photo';
    image.loading = 'lazy';
    card.append(image);
  } else {
    const pending = document.createElement('div');
    pending.className = 'pending';
    pending.textContent = 'Upload incomplete';
    card.append(pending);
  }

  const body = document.createElement('div');
  body.className = 'admin-photo-body';
  const info = document.createElement('div');
  info.className = 'admin-photo-info';
  const caption = document.createElement('span');
  caption.className = 'admin-photo-caption';
  caption.textContent = item.caption || 'Untitled photo';
  const meta = document.createElement('span');
  meta.className = 'admin-photo-date';
  meta.textContent = [formatDate(item.createdAt), item.status === 'pending' ? 'Pending' : ''].filter(Boolean).join(' · ');
  info.append(caption, meta);

  const placement = document.createElement('select');
  placement.className = 'input admin-photo-placement';
  placement.setAttribute('aria-label', `Homepage placement for ${item.caption || 'photo'}`);
  for (const [value, label] of [['gallery', 'Gallery only'], ['news', 'Recent event'], ['hero', 'Homepage hero']]) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    placement.append(option);
  }
  placement.value = item.homepageRole || 'gallery';
  placement.disabled = item.status !== 'ready';
  placement.addEventListener('change', () => updatePhotoPlacement(item, placement));

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn-ghost btn-sm btn-danger-ghost';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete photo: ${item.caption || 'Untitled photo'}`);
  remove.addEventListener('click', () => deletePhoto(item));

  body.append(info, placement, remove);
  card.append(body);
  return card;
}

async function updatePhotoPlacement(item, select) {
  select.disabled = true;
  try {
    await api(`/api/admin/gallery/${item.id}`, { method: 'PATCH', body: { homepageRole: select.value } });
    item.homepageRole = select.value;
    toast(select.value === 'hero' ? 'Homepage hero replaced.' : select.value === 'news' ? 'Added to homepage recent events.' : 'Removed from homepage placement.');
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    select.value = item.homepageRole || 'gallery';
    toast(errorMessage(error, 'Photo placement could not be updated.'), 'error');
  } finally {
    select.disabled = false;
  }
}

function renderGallery() {
  const published = gallery.filter((item) => item.status === 'ready').length;
  const pending = gallery.length - published;
  document.getElementById('stat-gallery').textContent = String(gallery.length);
  adminGalleryCount.textContent = gallery.length === 0
    ? 'No photos uploaded yet'
    : `${published} published${pending ? ` · ${pending} pending` : ''}`;
  adminGallery.replaceChildren(...gallery.map(adminPhoto));
  adminGalleryEmpty.hidden = gallery.length > 0;
}

async function loadGallery() {
  galleryError.hidden = true;
  try {
    const data = await api('/api/admin/gallery');
    gallery = Array.isArray(data.items) ? data.items : [];
    renderGallery();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    galleryError.textContent = errorMessage(error, 'Gallery photos could not be loaded.');
    galleryError.hidden = false;
  }
}

async function deletePhoto(item) {
  const confirmed = await confirmAction({
    title: 'Delete this photo?',
    message: 'It will be removed from the public gallery immediately. This cannot be undone.',
    label: 'Delete photo',
  });
  if (!confirmed) return;
  try {
    await api(`/api/admin/gallery/${item.id}`, { method: 'DELETE' });
    toast('Photo deleted.');
    await loadGallery();
  } catch (error) {
    if (error.status === 401) return sessionExpired();
    galleryError.textContent = errorMessage(error);
    galleryError.hidden = false;
  }
}

function clearFileSelection() {
  photoFile.value = '';
  fileLabel.textContent = FILE_LABEL;
  photoPreview.hidden = true;
  photoPreview.removeAttribute('src');
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
}

photoFile.addEventListener('change', () => {
  setStatus(photoStatus, '');
  const file = photoFile.files?.[0];
  if (!file) { clearFileSelection(); return; }
  if (!IMAGE_TYPES.includes(file.type)) {
    clearFileSelection();
    setStatus(photoStatus, 'Use a JPG, PNG or WebP image.');
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    clearFileSelection();
    setStatus(photoStatus, 'That image is larger than 5 MB. Choose a smaller file.');
    return;
  }
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  photoPreview.src = previewUrl;
  photoPreview.hidden = false;
  fileLabel.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
});

photoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = photoFile.files?.[0];
  if (!file) {
    setStatus(photoStatus, 'Choose a photo first.');
    return;
  }
  if (!IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
    setStatus(photoStatus, 'Use a JPG, PNG or WebP image up to 5 MB.');
    return;
  }

  photoSubmit.disabled = true;
  setStatus(photoStatus, 'Preparing upload…', 'success');
  try {
    const intent = await api('/api/admin/gallery', {
      method: 'POST',
      body: { caption: photoCaption.value.trim(), contentType: file.type, sizeBytes: file.size, homepageRole: photoPlacement.value },
    });
    setStatus(photoStatus, 'Uploading photo…', 'success');
    let upload;
    const controller = new AbortController();
    const uploadTimer = setTimeout(() => controller.abort(), 90000);
    try {
      upload = await fetch(intent.uploadUrl, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': file.type },
        body: file,
        signal: controller.signal,
      });
    } catch {
      throw new ApiError('network_unavailable', 0);
    } finally {
      clearTimeout(uploadTimer);
    }
    if (!upload.ok) throw new ApiError('upload_failed', upload.status);
    setStatus(photoStatus, 'Checking the uploaded photo…', 'success');
    await api(`/api/admin/gallery/${intent.id}/complete`, { method: 'POST' });
    clearFileSelection();
    photoCaption.value = '';
    photoPlacement.value = 'gallery';
    setStatus(photoStatus, 'Photo published to the gallery.', 'success');
    toast('Photo published.');
    await loadGallery();
  } catch (error) {
    if (error.status === 401) {
      sessionExpired();
    } else {
      setStatus(photoStatus, errorMessage(error));
    }
  } finally {
    photoSubmit.disabled = false;
  }
});

// ---- tabs ------------------------------------------------------------------

const tabs = [
  {
    button: document.getElementById('tab-btn-homepage'),
    panel: document.getElementById('tab-homepage'),
  },
  {
    button: document.getElementById('tab-btn-gallery'),
    panel: document.getElementById('tab-gallery'),
  },
];

function selectTab(index) {
  tabs.forEach((tab, position) => {
    const selected = position === index;
    tab.button.setAttribute('aria-selected', String(selected));
    tab.button.tabIndex = selected ? 0 : -1;
    tab.panel.hidden = !selected;
  });
}

tabs.forEach((tab, index) => {
  tab.button.addEventListener('click', () => selectTab(index));
  tab.button.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectTab(next);
    tabs[next].button.focus();
  });
});

checkSession();
