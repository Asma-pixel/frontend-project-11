import errorWatcher from './errorWatcher.js';

export default (state, elements, i18nInstance, typeChanger) => {
  switch (typeChanger) {
    case 'error': return errorWatcher(state, elements, i18nInstance);
    default: throw new Error('Неподходящий вотчер');
  }
};
