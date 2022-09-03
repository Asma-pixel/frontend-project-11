import '../styles/styles.scss';

// Import all of Bootstrap's JS

import * as yup from 'yup';
import watcher from './view.js';

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
  const watch = watcher(state, elements);

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
        watch.errors = [];
      })
      .catch((err) => {
        watch.errors = err.errors;
      });
  });
};
export default app;
