import onChange from 'on-change';
import errorRender from './renders/errorRender.js';
import contentRender from './renders/contentRender.js';
import proccessRender from './renders/proccessRender.js';

export default (state, elements, i18nInstance) => onChange(state, (path, value) => {
  switch (value) {
    case '': return;
    case 'failed': errorRender(state.errors, elements); break;
    case 'success': contentRender(state.content, elements, i18nInstance); break;
    case 'proccessing': proccessRender(elements); break;
    default: throw new Error('Нету такого процесса');
  }
});
