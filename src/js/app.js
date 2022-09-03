import '../styles/styles.scss';

// Import all of Bootstrap's JS

import * as yup from 'yup';

import onChange from 'on-change';

const app = () => {
  const state = {
    currentLink: {},
    links: [],
    errors: [],
  };
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
  };
  const watcherErrors = onChange(state, (path, value) => {
    if (value.length === 0) {
      elements.input.classList.remove('is-invalid');
      elements.input.value = '';
      elements.input.focus();
      elements.feedback.innerHTML = 'Rss успешно загружен';
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
      return;
    }
    elements.input.classList.add('is-invalid');
    elements.feedback.innerHTML = value;
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
  });
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const linkShema = yup.object({
      website: yup.string().url('Ссылка должна быть валидным URL').notOneOf(state.links, 'RSS уже существует').required('asdf'),
    });

    const formData = new FormData(elements.form);
    state.currentLink.website = formData.get('url');

    linkShema.validate(state.currentLink)
      .then((data) => {
        state.links.push(data.website);
        watcherErrors.errors = [];
      })
      .catch((err) => {
        watcherErrors.errors = err.errors;
      });
  });
};
export default app;
