import onChange from 'on-change';
import postRender from './postRender.js';
import proccessRender from './proccessRender.js';
import statusRender from './statusRender.js';
import feedRender from './feedRender.js';

export default (state, elements, i18nInstance) => onChange(state, (path, value) => {
  switch (value) {
    case '': return;
    case 'failed': statusRender(state.errors, elements, i18nInstance, 'failed'); break;
    case 'success': statusRender(state.content, elements, i18nInstance, 'success'); break;
    case 'proccessing': proccessRender(elements); break;
    case 'feedRender': feedRender(state.content, elements); break;
    case 'postRender': postRender(state.content, elements); break;
    default: throw new Error(`Нету такого процесса - ${value}`);
  }
});
