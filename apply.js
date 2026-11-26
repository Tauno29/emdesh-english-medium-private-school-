const FORMS = {
  nursery: {
    title: 'Nursery / Kindergarten (Pre-primary) application form 2027',
    fees: 'Registration fees N$ 100.00 non-refundable. School fees Nursery N$500.00 – Pre-primary N$600.00 per month.',
    grades: ['Nursery', 'Pre-primary'],
  },
  junior: {
    title: 'Junior Primary Phase application form 2027',
    fees: 'Registration fees N$ 100.00 non-refundable. School fees Grade 1 – Grade 3 N$700.00 per month.',
    grades: ['Grade 1', 'Grade 2', 'Grade 3'],
  },
  senior: {
    title: 'Senior Primary Phase application form 2027',
    fees: 'Registration fees N$ 100.00 non-refundable. School fees Grade 4 – Grade 5 N$800.00 per month, Grade 6 – Grade 7 N$900.00 per month.',
    grades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
  },
};
const ERRORS = {
  photo_required: 'Please attach a passport photo (JPG, PNG or WebP).',
  photo_too_large: 'The passport photo must be 5 MB or smaller.',
};

const form = document.getElementById('apply-form');
const body = document.getElementById('form-body');
const panel = document.getElementById('apply-panel');
const done = document.getElementById('apply-done');
const doneTitle = document.getElementById('apply-done-title');
const doneText = document.getElementById('apply-done-text');
const submit = document.getElementById('apply-submit');
const status = document.getElementById('apply-status');
const hostelSection = document.getElementById('hostel-section');
const gradeRow = form.querySelector('.grade-group .choice-row');
const photo = document.getElementById('f-photo');
const photoPreview = document.getElementById('photo-preview');
const photoLabel = document.getElementById('photo-label');
const childStrong = document.getElementById('indemnity-child');
let formType = '';

function setStatus(text, tone = 'error') {
  status.textContent = text;
  status.classList.toggle('is-error', tone === 'error');
  status.classList.toggle('is-success', tone === 'success');
}

function setSectionEnabled(section, enabled) {
  section.hidden = !enabled;
  section.querySelectorAll('input, textarea, select').forEach((el) => { el.disabled = !enabled; });
}

function chooseForm(type) {
  formType = type;
  const cfg = FORMS[type];
  document.getElementById('form-title').textContent = cfg.title;
  document.getElementById('form-fees').textContent = cfg.fees;
  gradeRow.replaceChildren(...cfg.grades.map((g) => {
    const label = document.createElement('label');
    label.className = 'choice';
    label.innerHTML = '<input type="radio" name="grade" data-label="Grade applying for" required><span></span>';
    label.querySelector('input').value = g;
    label.querySelector('span').textContent = g;
    return label;
  }));
  form.querySelectorAll('.doc-nursery').forEach((el) => { el.hidden = type !== 'nursery'; });
  body.hidden = false;
}

form.querySelectorAll('input[name="formType"]').forEach((r) => r.addEventListener('change', () => chooseForm(r.value)));
form.querySelectorAll('input[name="hostel"]').forEach((r) => r.addEventListener('change', () => setSectionEnabled(hostelSection, r.value === 'Yes' && r.checked)));
setSectionEnabled(hostelSection, false);
document.getElementById('f-signatureDate').value = new Date().toISOString().slice(0, 10);

const updateChild = () => {
  const n = `${form.elements.name.value.trim()} ${form.elements.surname.value.trim()}`.trim();
  childStrong.textContent = n || 'your child';
};
form.elements.name.addEventListener('input', updateChild);
form.elements.surname.addEventListener('input', updateChild);

photo.addEventListener('change', () => {
  const file = photo.files?.[0];
  if (!file) { photoPreview.hidden = true; photoLabel.textContent = 'Choose the passport photo'; return; }
  photoPreview.src = URL.createObjectURL(file);
  photoPreview.hidden = false;
  photoLabel.textContent = file.name;
});

function collectEntries() {
  const out = [];
  const seen = new Set();
  form.querySelectorAll('[data-label]').forEach((el) => {
    if (el.disabled || el.closest('[hidden]') || el.type === 'file') return;
    if (el.type === 'radio') {
      if (seen.has(el.name)) return;
      seen.add(el.name);
      const checked = form.querySelector(`input[name="${el.name}"]:checked`);
      if (checked) out.push([el.dataset.label, checked.value]);
      return;
    }
    if (el.type === 'checkbox') { out.push([el.dataset.label, el.checked ? 'Yes' : 'No']); return; }
    const v = el.value.trim();
    if (v) out.push([el.dataset.label, v]);
  });
  return out;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('');
  if (!formType) { setStatus('Choose which application form you need.'); return; }
  if (!form.reportValidity()) return;
  const file = photo.files?.[0];
  if (!file) { setStatus(ERRORS.photo_required); return; }
  if (file.size > 5 * 1024 * 1024) { setStatus(ERRORS.photo_too_large); return; }

  const cfg = FORMS[formType];
  const childName = `${form.elements.name.value.trim()} ${form.elements.surname.value.trim()}`;
  const grade = form.querySelector('input[name="grade"]:checked')?.value || '';
  const hostel = form.querySelector('input[name="hostel"]:checked')?.value || 'No';
  const entries = [['Application form', cfg.title], ...collectEntries()];

  submit.disabled = true;
  setStatus('Sending your application…', 'success');
  try {
    const data = new FormData();
    data.append('formType', formType);
    data.append('childName', childName);
    data.append('hostel', hostel);
    data.append('website', form.elements.website.value);
    data.append('entries', JSON.stringify(entries));
    data.append('photo', file);
    const LOV = 'https://project--cf4a80e7-8301-450b-b19f-d5fb82508f21.lovable.app';
    const onLovable = /lovable\.app$|localhost/.test(location.hostname);
    const urls = onLovable ? ['/api/public/application', LOV + '/api/public/application'] : [LOV + '/api/public/application', 'https://emdesh-english-medium-private-school.lovable.app/api/public/application'];
    let res;
    for (const u of urls) {
      try { res = await fetch(u, { method: 'POST', body: data }); break; } catch (e) { console.warn('send failed', u, e); }
    }
    if (!res) throw new Error('We could not reach the school server. Please check your internet connection and try again.');
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(ERRORS[result.error] || 'Your application could not be sent. Please try again.');

    if (result.accessKey) {
      const mail = {
        access_key: result.accessKey,
        subject: `New application: ${childName} – ${grade}${hostel === 'Yes' ? ' (with hostel)' : ''}`,
        from_name: 'Em-Desh website',
        'Passport photo': result.photoUrl || 'Saved on the website',
      };
      const email = form.elements.parentEmail.value.trim();
      if (email) mail.email = email;
      for (const [k, v] of entries) mail[k] = v;
      const sent = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(mail),
      }).then((r) => r.json()).catch(() => ({ success: false }));
      if (!sent.success) console.warn('Application saved but email forwarding failed');
    }

    doneText.textContent = `Thank you. The application for ${childName} (${grade}${hostel === 'Yes' ? ', with hostel' : ''}) has been sent to the school office. Remember to email your proof of registration payment to taunonakasole4@gmail.com with your child’s name and grade as reference.`;
    form.reset();
    body.hidden = true;
    formType = '';
    setStatus('');
    panel.hidden = true;
    done.hidden = false;
    doneTitle.focus();
  } catch (error) {
    setStatus(error.message);
  } finally {
    submit.disabled = false;
  }
});

document.getElementById('apply-again').addEventListener('click', () => {
  photoPreview.hidden = true;
  photoLabel.textContent = 'Choose the passport photo';
  setSectionEnabled(hostelSection, false);
  document.getElementById('f-signatureDate').value = new Date().toISOString().slice(0, 10);
  done.hidden = true;
  panel.hidden = false;
});
