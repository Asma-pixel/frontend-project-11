import '../styles/styles.scss';

// Import all of Bootstrap's JS

import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import watcher from './view.js';
import resources from '../resources/locales/index.js';
import domParser from './parsers/domParser';

const request = (url, state, i18nextInstance) => {
  const err = {};
  const request = axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`);
  request.then((responce) => {
    console.log(responce);
    console.log(responce.data.contents);
    return domParser(responce.data.contents);
  })
    .then(console.log);

  return request;
};
const app = () => {
  const state = {
    defaultLng: 'ru',
    currentLink: {},
    formState: '',
    links: [],
    errors: [],
    content: {
      feed: [],
      post: [],
    },
  };
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('button'),
  };
  let processWatcher;
  const i18nextInstance = i18n.createInstance();
  const initPromise = i18nextInstance.init({
    lng: state.defaultLng,
    debug: false,
    resources,
  })
    .then(() => {
      processWatcher = watcher(state, elements, i18nextInstance);
    });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    let linkShema;
    const formData = new FormData(elements.form);
    state.currentLink.website = formData.get('url');
    initPromise
      .then(() => {
        linkShema = yup.object({
          website: yup.string().url(i18nextInstance.t('errors.linkNotValid')).notOneOf(state.links, i18nextInstance.t('errors.linkExist')).required(),
        });
      })
      .then(() => linkShema.validate(state.currentLink))
      .then((data) => {
        processWatcher.formState = i18nextInstance.t('formState.proccessing');
        return request(data.website, state, i18nextInstance);
      })
      .then((data) => {
        console.log(data);
        state.links.push(state.currentLink.website);
        state.errors = [];
        processWatcher.formState = i18nextInstance.t('formState.success');
      })
      .catch((err) => {
        state.errors = err.errors;
        processWatcher.formState = i18nextInstance.t('formState.failed');
      })
      .finally(() => {
        processWatcher.formState = '';
      });
  });
};
export default app;
