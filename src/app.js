import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import watcher from './view.js';
import resources from './locales/index.js';
import domParser from './domParser.js';

const genNewPosts = (currentPosts, statePosts) => {
  const { feedId } = currentPosts[0];

  const postsFromFeed = statePosts.filter((el) => el.feedId === feedId);

  return currentPosts
    .filter((item) => {
      const boolFlag = postsFromFeed.filter((el) => el.title === item.title);
      return boolFlag.length === 0;
    });
};
const genRequestUri = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const loadRss = (url, watchedState) => {
  const { content, contentLoad } = watchedState;
  contentLoad.state = 'contentLoad';
  return axios.get(genRequestUri(url))
    .catch(() => { throw new Error('networkError'); })
    .then((responce) => {
      const { feed, posts } = domParser(responce.data.contents);
      feed.url = url;
      feed.id = _.uniqueId();
      posts.forEach((post) => {
        post.id = _.uniqueId();
        post.feedId = feed.id;
      });
      content.posts = [...posts, ...content.posts];
      content.feeds = [feed, ...content.feeds];
      contentLoad.state = 'success';
    })
    .catch((err) => {
      contentLoad.error = err.message;
      contentLoad.state = 'failedOnLoad';
    });
};
const updateRss = (watchedState) => {
  const { content } = watchedState;
  const requests = content.feeds.map((feed) => axios.get(genRequestUri(feed.url))
    .then((responce) => {
      const { posts } = domParser(responce.data.contents);
      posts.forEach((post) => {
        post.id = _.uniqueId();
        post.feedId = feed.id;
      });
      const newPosts = genNewPosts(posts, content.posts);
      if (newPosts.length === 0) return;
      content.posts = [...newPosts, ...content.posts];
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
      valid: true,
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
            loadRss(url, watchedState);
            watchedState.form.valid = true;
          })
          .catch((err) => {
            watchedState.form.error = err.message;
            watchedState.form.valid = false;
          });
      });
      elements.posts.addEventListener('click', (e) => {
        const currentId = e.target.dataset.id;
        if (!currentId) return;
        watchedState.uiState.modalPostId = currentId;
        const isNewId = !watchedState.uiState.seenPosts.some((el) => el === currentId);
        if (isNewId) {
          watchedState.uiState.seenPosts = [currentId, ...watchedState.uiState.seenPosts];
        }
      });
    });
};

export default app;
