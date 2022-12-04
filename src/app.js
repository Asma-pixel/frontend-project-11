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
const request = (url, state, i18nextInstance, processWatcher) => {
  const tempState = state;
  const tempWatcher = processWatcher;
  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((responce) => {
      const data = domParser(responce.data.contents, i18nextInstance, url);
      const newPosts = genNewPosts(data.posts, state.content.post);
      newPosts.forEach((post) => {
        const tempPost = post;
        tempPost.id = _.uniqueId();
        const uiStateItem = {
          id: tempPost.id,
          isClicked: false,
        };
        tempState.uiState.push(uiStateItem);
      });
      tempState.content.post.push(newPosts);
      tempState.content.post = state.content.post.flat();
      tempWatcher.formState = '';
      tempWatcher.formState = 'postRender';
      return data;
    })
    .then((data) => {
      setTimeout(() => request(url, state, i18nextInstance, processWatcher), 5000);
      return data;
    });
};
const app = () => {
  const state = {
    defaultLng: 'ru',
    currentLink: {},
    formState: '',
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
    button: document.querySelector('button'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: state.defaultLng,
    debug: false,
    resources,
  })
    .then(() => {
      const processWatcher = watcher(state, elements, i18nextInstance);
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(elements.form);
        const link = { website: formData.get('url') };
        const links = state.content.feed.map((el) => el.link);
        const linkShema = yup.object({
          website: yup.string().url('linkNotValid').notOneOf(links, 'linkExist').required(),
        });

        linkShema.validate(link)
          .catch((err) => { throw new Error(err.errors); })
          .then((data) => {
            processWatcher.formState = 'proccessing';
            return request(data.website, state, i18nextInstance, processWatcher);
          })
          .then((data) => {
            state.errors = [];
            processWatcher.formState = 'success';
            state.content.feed = [data.feed, ...state.content.feed];
            state.content.feed = state.content.feed.flat();
            processWatcher.formState = 'feedRender';
          })
          .catch((err) => {
            state.errors = err.message;
            processWatcher.formState = 'failed';
          })
          .finally(() => {
            processWatcher.formState = '';
          });
      });
    });
};

export default app;
