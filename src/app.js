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
const requestForAdd = (url, watchedState) => {
  const { content, uiState } = watchedState;
  return axios.get(genRequestUri(url))
    .then((responce) => {
      const { feed, posts } = domParser(responce.data.contents);
      feed.url = url;
      posts.forEach((post) => {
        post.id = _.uniqueId();
        const UiStateItem = {
          id: post.id,
          isClicked: false,
        };
        uiState.push(UiStateItem);
      });
      content.post = [posts, ...content.post].flat();
      content.feed = [feed, content.feed].flat();
      watchedState.formState = 'postRender';
      watchedState.formState = 'feedRender';
      watchedState.formState = 'initial';
    });
};
const requestForUpdate = (watchedState) => {
  const { uiState, content } = watchedState;
  content.feed.forEach((feed) => {
    axios.get(genRequestUri(feed.url))
      .then((responce) => {
        const data = domParser(responce.data.contents);
        const newPosts = genNewPosts(data.posts, content.post);
        if (newPosts.length === 0) return;
        newPosts.forEach((post) => {
          post.id = _.uniqueId();
          const uiStateItem = {
            id: post.id,
            isClicked: false,
          };
          uiState.push(uiStateItem);
        });
        content.post = [newPosts, ...content.post].flat();

        watchedState.formState = 'postRender';
        watchedState.formState = 'initial';
      })
      .then(() => {
        setTimeout(() => requestForUpdate(watchedState), 5000);
      });
  });
};
const app = () => {
  const initialState = {
    defaultLng: 'ru',
    formState: 'initial',
    errors: [],
    content: {
      feed: [],
      post: [],
    },
    uiState: [],
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
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const urls = watchedState.content.feed.map((el) => el.url);
        const linkShema = yup.string().url('linkNotValid').notOneOf(urls, 'linkExist').required();
        linkShema.validate(url)
          .catch((err) => { throw new Error(err.errors); })
          .then(() => {
            watchedState.formState = 'proccessing';
            elements.button.disabled = true;
            return requestForAdd(url, watchedState);
          })
          .then(() => {
            watchedState.formState = 'success';
            elements.button.disabled = false;
          })
          .catch((err) => {
            watchedState.errors = err.message;
            watchedState.formState = 'failed';
          })
          .finally(() => {
            watchedState.formState = 'initial';
            requestForUpdate(watchedState);
          });
      });
    });
};

export default app;
