import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import watcher from './view.js';
import resources from './locales/index.js';
import domParser from './domParser.js';

const genNewPosts = (currentPosts, statePosts) => currentPosts
  .filter((item) => {
    const boolFlag = statePosts.filter((el) => el.title === item.title);
    return boolFlag.length === 0;
  });
const genRequestUri = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const loadRss = (url, watchedState) => {
  const { content } = watchedState;
  return axios.get(genRequestUri(url))
    .catch(() => { throw new Error('networkError'); })
    .then((responce) => {
      const { feed, posts } = domParser(responce.data.contents);
      feed.url = url;
      posts.forEach((post) => {
        post.id = _.uniqueId();
      });
      content.posts = [posts, ...content.posts].flat();
      content.feeds = [feed, ...content.feeds].flat();
    });
};
const updateRss = (watchedState) => {
  const { content } = watchedState;
  const requests = content.feeds.map((feed) => axios.get(genRequestUri(feed.url))
    .then((responce) => {
      const data = domParser(responce.data.contents);
      const posts = genNewPosts(data.posts, content.posts);
      if (posts.length === 0) return;
      posts.forEach((post) => {
        post.id = _.uniqueId();
      });
      content.posts = [posts, ...content.posts].flat();
    }));
  Promise.all(requests).then(() => {
    setTimeout(() => updateRss(watchedState), 5000);
  });
};

const app = () => {
  const initialState = {
    defaultLng: 'ru',
    form: {
      error: null,
      state: 'filling',
    },
    contentLoad: {
      error: null,
      state: 'idle',
    },
    content: {
      feeds: [],
      posts: [],
    },
    uiState: {
      seenPosts: [],
      modalPostId: null,
    },
  };
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('.addBtn'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: initialState.defaultLng,
    debug: false,
    resources,
  })
    .then(() => {
      const watchedState = watcher(initialState, elements, i18nextInstance);
      updateRss(watchedState);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const urls = watchedState.content.feeds.map((el) => el.url);
        const linkShema = yup.string().url('linkNotValid').notOneOf(urls, 'linkExist').required();
        linkShema.validate(url)
          .then(() => {
            watchedState.form.state = 'proccessing';
            return loadRss(url, watchedState);
          })
          .then(() => {
            watchedState.contentLoad.state = 'success';
          })
          .catch((err) => {
            if (err instanceof yup.ValidationError) {
              watchedState.form.error = err.message;
              watchedState.form.state = 'failedOnValidation';
              return;
            }
            watchedState.contentLoad.error = err.message;
            watchedState.contentLoad.state = 'failedOnLoad';
          })
          .finally(() => {
            watchedState.form.state = 'filling';
          });
      });

      elements.posts.addEventListener('click', (e) => {
        const currentId = e.target.dataset.id;
        if (!currentId) return;
        watchedState.uiState.modalPostId = currentId;
        watchedState.uiState.seenPosts = [currentId, ...watchedState.uiState.seenPosts];
      });
    });
};

export default app;
