import watcher from './watchers/index.js';

export default (state, elements, i18nInstance, typeChanger = 'error') => {
  const currentWatcher = watcher(state, elements, i18nInstance, typeChanger);
  return currentWatcher;
};
