import '../styles/styles.scss';

// Import all of Bootstrap's JS

import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import watcher from './view.js';
import resources from '../resources/locales/index.js';
import domParser from './parsers/domParser.js';

const isNewFeed = (currentFeed, stateFeed) => {
  const flagArr = stateFeed.filter(item => item.id === currentFeed.id);
  return flagArr.length === 0 ? true : false;
}
const genNewPosts = (currentPosts, statePosts) => {
  return currentPosts
  .filter((item) => {
      const boolFlag = statePosts.filter(el => el.title == item.title)
      return boolFlag.length === 0 ? true : false;
  })
}
const request = (url, state, i18nextInstance, processWatcher) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((responce) => {
      const data = domParser(responce.data.contents, i18nextInstance, state.content.currentFeedId);
      const feedForPush = isNewFeed(data.feed, state.content.feed) ? data.feed : [];
      state.content.feed.push(feedForPush);
      const newPosts = genNewPosts(data.posts, state.content.post);
      console.log(newPosts)
      state.content.post.push(newPosts);

      state.content.feed  =  state.content.feed.flat();
      state.content.post  =  state.content.post.flat();
      processWatcher.formState = '';


      processWatcher.formState = i18nextInstance.t('formState.postRender');
    });
  setTimeout(() => request(url, state, i18nextInstance, processWatcher), 5000);
};
const app = () => {
  const state = {
    defaultLng: 'ru',
    currentLink: {},

    formState: '',
    links: [],
    errors: [],
    content: {
      currentFeedId: '',
      feed: [],
      post: [],
    },
  };
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('button'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
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
    state.content.post.flat();
    initPromise
      .then(() => {
        linkShema = yup.object({
          website: yup.string().url(i18nextInstance.t('errors.linkNotValid')).notOneOf(state.links, i18nextInstance.t('errors.linkExist')).required(),
        });
      })
      .then(() => linkShema.validate(state.currentLink))
      .catch((err) => { throw new Error(err.errors); })
      .then((data) => {
        processWatcher.formState = i18nextInstance.t('formState.proccessing');
        state.content.currentFeedId = _.uniqueId();
        request(data.website, state, i18nextInstance, processWatcher);
      })
      .then(() => {
        state.links.push(state.currentLink.website);
        state.errors = [];
        processWatcher.formState = i18nextInstance.t('formState.success');
        processWatcher.formState = i18nextInstance.t('formState.feedRender');
      })
      .catch((err) => {
        state.errors = err.message;
        processWatcher.formState = i18nextInstance.t('formState.failed');
      })
      .finally(() => {
        processWatcher.formState = '';
      });
  });
};
export default app;
