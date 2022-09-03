import '../styles/styles.scss';

// Import all of Bootstrap's JS

import * as yup from 'yup';
import i18n from 'i18next';
import watcher from './view.js';
import resources from '../resources/locales/index.js';

const app = () => {
  const state = {
    defaultLng: 'ru',
    currentLink: {},
    links: [],
    errors: [],
  };
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
  };
  let errorsWatcher;
  const i18nextInstance = i18n.createInstance();
  const textPromise = i18nextInstance.init({
    lng: state.defaultLng,
    debug: false,
    resources,
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    let linkShema;
    const formData = new FormData(elements.form);
    state.currentLink.website = formData.get('url');
    textPromise
      .then(() => {
        linkShema = yup.object({
          website: yup.string().url(i18nextInstance.t('errors.linkNotValid')).notOneOf(state.links, i18nextInstance.t('errors.linkExist')).required(),
        });
        errorsWatcher = watcher(state, elements, i18nextInstance);
      })
      .then(() => linkShema.validate(state.currentLink))
      .then((data) => {
        state.links.push(data.website);
        errorsWatcher.errors = [];
      })
      .catch((err) => {
        errorsWatcher.errors = err.errors;
      });
  });
};
export default app;
