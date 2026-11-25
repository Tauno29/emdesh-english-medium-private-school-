const BASE = '/.netlify/functions/app';

// Cookie sessions cover normal browsing; this header session also works when
// the embedding preview treats the site as third-party and drops cookies.
let authToken = null;

export function setAuthToken(token) {
  authToken = typeof token === 'string' && token ? token : null;
}

export function clearAuthToken() {
  authToken = null;
}

export class ApiError extends Error {
  constructor(code, status) {
    super(code || 'request_failed');
    this.name = 'ApiError';
    this.code = code || 'request_failed';
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { accept: 'application/json' };
  if (authToken) headers.authorization = `Bearer ${authToken}`;
  const init = { method, credentials: 'same-origin', headers };
  if (body !== undefined) {
    headers['content-type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  let response;
  const url = method === 'GET' && path === '/api/gallery' ? ((/lovable\.app$|localhost/.test(location.hostname) ? '/school-api' : 'https://project--cf4a80e7-8301-450b-b19f-d5fb82508f21.lovable.app/api/public/school') + '/gallery') : authToken
    ? `${BASE}${path}${path.includes('?') ? '&' : '?'}s=${encodeURIComponent(authToken)}`
    : BASE + path;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError('network_unavailable', 0);
  }
  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = null; }
  }
  if (!response.ok) {
    const code = data?.error ?? data?.code ?? (response.status === 401 ? 'login_required' : 'request_failed');
    throw new ApiError(code, response.status);
  }
  return data ?? {};
}

const MESSAGES = {
  network_unavailable: 'The school server could not be reached. Check your connection and try again.',
  invalid_credentials: 'That student ID or PIN is not correct.',
  login_required: 'Please sign in again.',
  account_inactive: 'This learner record is inactive. Please speak to the school office.',
  too_many_attempts: 'Too many attempts. Please wait a few minutes and try again.',
  origin_forbidden: 'The request was blocked for security reasons. Reload the page and try again.',
  service_not_configured: 'The school dashboard is not configured yet. Please contact the school office.',
  invalid_input: 'Please check the form and try again.',
  first_name_required: 'Enter the learner’s first name.',
  last_name_required: 'Enter the learner’s last name.',
  grade_invalid: 'Choose the learner’s grade.',
  guardian_required: 'Enter the guardian’s full name.',
  contact_required: 'Add a guardian email or phone number so the school office can reply.',
  email_invalid: 'Enter a valid email address.',
  consent_required: 'Please tick the box to allow the school office to contact you.',
  unsupported_media_type: 'Use a JPG, PNG or WebP image.',
  invalid_video: 'Choose an MP4 or WebM video up to 25 MB.',
  unsupported_document_type: 'Use a PDF or a JPG, PNG or WebP image.',
  document_too_large: 'Report cards can be up to 10 MB.',
  payload_too_large: 'That request was too large.',
  invalid_upload: 'The uploaded image could not be verified. Try a smaller JPG, PNG or WebP file.',
  video_upload_failed: 'The welcome video could not be verified. Please try again.',
  upload_pending: 'The upload did not reach storage. Please try again.',
  upload_unavailable: 'The image could not be verified. Please try again.',
  upload_failed: 'The image upload failed. Please try again.',
  storage_unavailable: 'Photo storage is temporarily unavailable. Please try again.',
  database_unavailable: 'The school records are temporarily unavailable. Please try again.',
  delete_confirmation_required: 'Type “delete all learners” exactly to confirm this permanent action.',
  student_id_unavailable: 'Could not allocate a student ID. Please try again.',
  pin_unchanged: 'Choose a PIN that is different from your current one.',
  not_found: 'That item no longer exists. Refresh the page.',
  method_not_allowed: 'That action is not available.',
  request_failed: 'Something went wrong. Please try again.',
};

export function errorMessage(error, fallback = MESSAGES.request_failed) {
  const code = error?.code;
  if (code && MESSAGES[code]) return MESSAGES[code];
  if (code && code !== 'request_failed') return `${fallback} (${code})`;
  return fallback;
}

export function gradeLabel(grade) {
  return grade === 'KG' ? 'Kindergarten / Pre-Primary' : `Grade ${grade}`;
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function initials(firstName, lastName) {
  return `${(firstName ?? '').charAt(0)}${(lastName ?? '').charAt(0)}`.toUpperCase() || '?';
}

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const DOCUMENT_TYPES = ['application/pdf', ...IMAGE_TYPES];
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
